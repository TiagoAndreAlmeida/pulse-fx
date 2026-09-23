import { describe, it, expect, vi } from 'vitest';
import { GetAllIndicatorsUseCase } from './GetAllIndicatorsUseCase';
import { Indicator } from '@/domain/entities/Indicator';

function makeIndicator(overrides: Partial<IndicatorProps> = {}): Indicator {
  return new Indicator({
    id: 'USD_BRL',
    name: 'Dólar PTAX',
    source: 'BCB',
    unit: 'CURRENCY',
    frequency: 'DAILY',
    lastValue: 5.25,
    variation: 0.02,
    updatedAt: new Date('2026-09-20'),
    ...overrides,
  });
}

interface IndicatorProps {
  id: string;
  name: string;
  source: 'BCB' | 'FRED';
  unit: 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
  frequency: 'DAILY' | 'MONTHLY';
  lastValue: number;
  variation: number;
  updatedAt: Date;
}

describe('GetAllIndicatorsUseCase', () => {
  it('deve retornar todos os indicadores mapeados para DTO', async () => {
    const indicatorRepo = {
      findAll: vi.fn().mockResolvedValue([
        makeIndicator({ id: 'USD_BRL' }),
        makeIndicator({ id: 'SELIC', name: 'Selic', source: 'BCB', unit: 'PERCENTAGE', frequency: 'DAILY', lastValue: 13.75, variation: 0 }),
      ]),
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetAllIndicatorsUseCase(indicatorRepo as any);
    const result = await useCase.execute();

    expect(result.indicators).toHaveLength(2);
    expect(result.indicators[0]).toMatchObject({
      id: 'USD_BRL',
      name: 'Dólar PTAX',
      source: 'BCB',
      unit: 'CURRENCY',
      frequency: 'DAILY',
      lastValue: 5.25,
      variation: 0.02,
    });
    expect(result.indicators[0].referenceDate).toEqual(new Date('2026-09-20'));
    expect(indicatorRepo.findAll).toHaveBeenCalled();
  });

  it('deve retornar array vazio quando não há indicadores', async () => {
    const indicatorRepo = {
      findAll: vi.fn().mockResolvedValue([]),
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetAllIndicatorsUseCase(indicatorRepo as any);
    const result = await useCase.execute();

    expect(result.indicators).toEqual([]);
  });

  it('deve chamar findAll do repositório', async () => {
    const findAllMock = vi.fn().mockResolvedValue([makeIndicator()]);
    const indicatorRepo = {
      findAll: findAllMock,
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new GetAllIndicatorsUseCase(indicatorRepo as any);
    await useCase.execute();

    expect(findAllMock).toHaveBeenCalledTimes(1);
  });
});