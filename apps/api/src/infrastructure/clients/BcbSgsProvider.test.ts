import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BcbSgsProvider } from './BcbSgsProvider';
import { ExternalObservation } from '@/domain/repositories/IExternalProvider';

describe('BcbSgsProvider', () => {
  let provider: BcbSgsProvider;

  beforeEach(() => {
    provider = new BcbSgsProvider();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deve buscar dados do BCB e retornar observations parseadas', async () => {
    const mockResponse = [
      { data: '19/09/2026', valor: '5.4210' },
      { data: '22/09/2026', valor: '5.4530' },
    ];

    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await provider.fetchData('USD_BRL', new Date('2026-01-01'));

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject<ExternalObservation>({
      referenceDate: new Date(2026, 8, 19),
      value: 5.4210,
    });
    expect(result[1]).toMatchObject<ExternalObservation>({
      referenceDate: new Date(2026, 8, 22),
      value: 5.4530,
    });
  });

  it('deve lançar erro se indicador não for mapeado', async () => {
    await expect(provider.fetchData('INVALID', new Date())).rejects.toThrow('Indicador BCB não mapeado: INVALID');
  });

  it('deve lançar erro se resposta HTTP não for ok', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(provider.fetchData('USD_BRL', new Date())).rejects.toThrow('Erro ao buscar dados do BCB: 500 Internal Server Error');
  });

  it('deve ignorar valores inválidos (NaN)', async () => {
    const mockResponse = [
      { data: '19/09/2026', valor: '5.4210' },
      { data: '22/09/2026', valor: 'invalid' },
    ];

    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await provider.fetchData('USD_BRL', new Date('2026-01-01'));
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(5.4210);
  });

  it('deve formatar data corretamente para DD/MM/YYYY', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    });

    await provider.fetchData('USD_BRL', new Date(2026, 8, 15));

    const calledUrl = (global.fetch as vi.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('dataInicial=15/09/2026');
  });
});