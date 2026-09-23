import { describe, it, expect, vi } from 'vitest';
import { SyncExternalIndicatorsUseCase } from './SyncExternalIndicatorsUseCase';
import { Indicator } from '@/domain/entities/Indicator';
import { Observation } from '@/domain/entities/Observation';
import { ExternalObservation } from '@/domain/repositories/IExternalProvider';

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

function makeExternalObservation(overrides: Partial<ExternalObservation> = {}): ExternalObservation {
  return {
    referenceDate: new Date('2026-09-21'),
    value: 5.30,
    ...overrides,
  };
}

describe('SyncExternalIndicatorsUseCase', () => {
  it('deve sincronizar indicadores com sucesso', async () => {
    const indicator = makeIndicator({ id: 'USD_BRL', source: 'BCB' });
    const indicator2 = makeIndicator({ id: 'SELIC', source: 'BCB' });

    const indicatorRepo = {
      findAll: vi.fn().mockResolvedValue([indicator, indicator2]),
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    };

    const obsRepo = {
      findLatest: vi.fn().mockResolvedValue(null),
      findByIndicatorId: vi.fn()
        .mockResolvedValueOnce([
          makeObservation({ referenceDate: new Date('2026-09-20'), value: 5.25 }),
          makeObservation({ referenceDate: new Date('2026-09-19'), value: 5.20 }),
        ])
        .mockResolvedValueOnce([
          makeObservation({ referenceDate: new Date('2026-09-20'), value: 13.75 }),
          makeObservation({ referenceDate: new Date('2026-09-19'), value: 13.75 }),
        ]),
      saveMany: vi.fn().mockResolvedValue(undefined),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
    };

    const bcbProvider = {
      fetchData: vi.fn().mockResolvedValue([{ referenceDate: new Date('2026-09-21'), value: 5.30 }]),
    };

    const fredProvider = {
      fetchData: vi.fn().mockResolvedValue([]),
    };

    const useCase = new SyncExternalIndicatorsUseCase(
      indicatorRepo as any,
      obsRepo as any,
      bcbProvider as any,
      fredProvider as any
    );

    const result = await useCase.execute();

    expect(result.items).toHaveLength(2);
    expect(result.items[0].indicatorId).toBe('USD_BRL');
    expect(result.items[0].synced).toBe(1);
    expect(result.items[1].indicatorId).toBe('SELIC');
    expect(result.items[1].synced).toBe(1);
    expect(indicatorRepo.update).toHaveBeenCalledTimes(2);
  });

  it('deve continuar sincronização mesmo se um provider falhar', async () => {
    const indicator = makeIndicator({ id: 'USD_BRL', source: 'BCB' });
    const indicator2 = makeIndicator({ id: 'FEDFUNDS', source: 'FRED' });

    const indicatorRepo = {
      findAll: vi.fn().mockResolvedValue([indicator, indicator2]),
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    };

    const obsRepo = {
      findLatest: vi.fn().mockResolvedValue(null),
      findByIndicatorId: vi.fn()
        .mockResolvedValueOnce([makeObservation()])
        .mockResolvedValueOnce([makeObservation({ indicatorId: 'FEDFUNDS' })]),
      saveMany: vi.fn().mockResolvedValue(undefined),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
    };

    const bcbProvider = {
      fetchData: vi.fn().mockRejectedValue(new Error('BCB indisponível')),
    };

    const fredProvider = {
      fetchData: vi.fn().mockResolvedValue([{ referenceDate: new Date('2026-09-01'), value: 5.33 }]),
    };

    const useCase = new SyncExternalIndicatorsUseCase(
      indicatorRepo as any,
      obsRepo as any,
      bcbProvider as any,
      fredProvider as any
    );

    const result = await useCase.execute();

    expect(result.items).toHaveLength(2);
    expect(result.items[0].indicatorId).toBe('USD_BRL');
    expect(result.items[0].error).toBeDefined();
    expect(result.items[1].indicatorId).toBe('FEDFUNDS');
    expect(result.items[1].synced).toBe(1);
  });

  it('deve não sincronizar se não houver dados novos', async () => {
    const indicator = makeIndicator({ id: 'USD_BRL', source: 'BCB' });

    const indicatorRepo = {
      findAll: vi.fn().mockResolvedValue([indicator]),
      findById: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const obsRepo = {
      findLatest: vi.fn().mockResolvedValue(null),
      findByIndicatorId: vi.fn().mockResolvedValue([makeObservation()]),
      saveMany: vi.fn(),
      findByIndicatorIdBeforeDate: vi.fn(),
      findByIndicatorIdInDateRange: vi.fn(),
    };

    const bcbProvider = {
      fetchData: vi.fn().mockResolvedValue([]),
    };

    const fredProvider = {
      fetchData: vi.fn(),
    };

    const useCase = new SyncExternalIndicatorsUseCase(
      indicatorRepo as any,
      obsRepo as any,
      bcbProvider as any,
      fredProvider as any
    );

    const result = await useCase.execute();

    expect(result.items).toHaveLength(1);
    expect(result.items[0].synced).toBe(0);
    expect(obsRepo.saveMany).not.toHaveBeenCalled();
  });
});