import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FredApiProvider } from './FredApiProvider';
import { ExternalObservation } from '@/domain/repositories/IExternalProvider';

describe('FredApiProvider', () => {
  let provider: FredApiProvider;

  beforeEach(() => {
    process.env.FRED_API_KEY = 'test-key';
    provider = new FredApiProvider();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deve buscar dados do FRED e retornar observations parseadas', async () => {
    const mockResponse = {
      observations: [
        { date: '2026-07-01', value: '5.33' },
        { date: '2026-08-01', value: '5.33' },
      ],
    };

    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await provider.fetchData('FEDFUNDS', new Date('2026-01-01'));

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject<ExternalObservation>({
      referenceDate: new Date('2026-07-01'),
      value: 5.33,
    });
    expect(result[1]).toMatchObject<ExternalObservation>({
      referenceDate: new Date('2026-08-01'),
      value: 5.33,
    });
  });

  it('deve ignorar valores "." (dados ausentes)', async () => {
    const mockResponse = {
      observations: [
        { date: '2026-07-01', value: '5.33' },
        { date: '2026-08-01', value: '.' },
        { date: '2026-09-01', value: '5.50' },
      ],
    };

    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await provider.fetchData('FEDFUNDS', new Date('2026-01-01'));
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe(5.33);
    expect(result[1].value).toBe(5.50);
  });

  it('deve lançar erro se indicador não for mapeado', async () => {
    await expect(provider.fetchData('INVALID', new Date())).rejects.toThrow('Indicador FRED não mapeado: INVALID');
  });

  it('deve lançar erro se resposta HTTP não for ok', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(provider.fetchData('FEDFUNDS', new Date())).rejects.toThrow('Erro ao buscar dados do FRED: 401 Unauthorized');
  });

  it('deve incluir api_key e file_type=json na URL', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ observations: [] }),
    });

    await provider.fetchData('FEDFUNDS', new Date('2026-01-01'));

    const calledUrl = (global.fetch as vi.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('api_key=test-key');
    expect(calledUrl).toContain('file_type=json');
    expect(calledUrl).toContain('observation_start=2026-01-01');
  });

  it('deve lançar erro se FRED_API_KEY não estiver configurada', () => {
    delete process.env.FRED_API_KEY;
    expect(() => new FredApiProvider()).toThrow('FRED_API_KEY não configurada');
  });
});