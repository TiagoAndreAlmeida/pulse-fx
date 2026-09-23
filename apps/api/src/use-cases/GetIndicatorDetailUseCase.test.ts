import { describe, it, expect, vi } from 'vitest';
import { GetIndicatorDetailUseCase } from './GetIndicatorDetailUseCase';
import { Indicator } from '@/domain/entities/Indicator';
import { Observation } from '@/domain/entities/Observation';

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

function makeObservation(overrides: Partial<ObservationProps> = {}): Observation {
  return new Observation({
    id: 'obs-1',
    indicatorId: 'USD_BRL',
    referenceDate: new Date('2026-09-20'),
    value: 5.25,
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

interface ObservationProps {
  id: string;
  indicatorId: string;
  referenceDate: Date;
  value: number;
}

describe('GetIndicatorDetailUseCase', () => {
  it('deve retornar detalhe completo com observations', async () => {
    const indicator = makeIndicator();
    const observations = [
      makeObservation({ referenceDate: new Date('2026-09-20'), value: 5.25 }),
      makeObservation({ referenceDate: new Date('2026-09-19'), value: 5.20 }),
      makeObservation({ referenceDate: new Date('2026-09-18'), value: 5.18 }),
    ];

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const observationRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue(observations),
      findLatest: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
      saveMany: vi.fn(),
    };

    const useCase = new GetIndicatorDetailUseCase(indicatorRepo as any, observationRepo as any);
    const result = await useCase.execute('USD_BRL');

    expect(result.indicator).toMatchObject({
      id: 'USD_BRL',
      name: 'Dólar PTAX',
      source: 'BCB',
      unit: 'CURRENCY',
      frequency: 'DAILY',
      lastValue: 5.25,
      variation: 0.02,
    });
    expect(result.indicator.referenceDate).toEqual(new Date('2026-09-20'));
    expect(result.indicator.observations).toHaveLength(3);
    expect(result.indicator.observations[0]).toMatchObject({
      date: new Date('2026-09-20'),
      value: 5.25,
    });
    expect(indicatorRepo.findById).toHaveBeenCalledWith('USD_BRL');
    expect(observationRepo.findByIndicatorId).toHaveBeenCalledWith('USD_BRL', 30);
  });

  it('deve lançar erro se indicador não existe', async () => {
    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const observationRepo = {
      findByIndicatorId: vi.fn(),
      findLatest: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
      saveMany: vi.fn(),
    };

    const useCase = new GetIndicatorDetailUseCase(indicatorRepo as any, observationRepo as any);

    await expect(useCase.execute('INVALID')).rejects.toThrow('Indicador INVALID não encontrado');
  });

  it('deve retornar detalhe com observations vazio se sem dados', async () => {
    const indicator = makeIndicator();
    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const observationRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue([]),
      findLatest: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
      saveMany: vi.fn(),
    };

    const useCase = new GetIndicatorDetailUseCase(indicatorRepo as any, observationRepo as any);
    const result = await useCase.execute('USD_BRL');

    expect(result.indicator.observations).toEqual([]);
    expect(result.indicator.id).toBe('USD_BRL');
  });

  it('deve usar limit 12 para frequência MONTHLY', async () => {
    const indicator = makeIndicator({ frequency: 'MONTHLY', id: 'FEDFUNDS' });
    const observations = [makeObservation({ indicatorId: 'FEDFUNDS' })];

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const observationRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue(observations),
      findLatest: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
      saveMany: vi.fn(),
    };

    const useCase = new GetIndicatorDetailUseCase(indicatorRepo as any, observationRepo as any);
    await useCase.execute('FEDFUNDS');

    expect(observationRepo.findByIndicatorId).toHaveBeenCalledWith('FEDFUNDS', 12);
  });

  it('deve chamar apenas findById e findByIndicatorId', async () => {
    const indicator = makeIndicator();
    const observations = [makeObservation()];

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const observationRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue(observations),
      findLatest: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
      saveMany: vi.fn(),
    };

    const useCase = new GetIndicatorDetailUseCase(indicatorRepo as any, observationRepo as any);
    await useCase.execute('USD_BRL');

    expect(indicatorRepo.findById).toHaveBeenCalledTimes(1);
    expect(observationRepo.findByIndicatorId).toHaveBeenCalledTimes(1);
    expect(observationRepo.findLatest).not.toHaveBeenCalled();
  });
});