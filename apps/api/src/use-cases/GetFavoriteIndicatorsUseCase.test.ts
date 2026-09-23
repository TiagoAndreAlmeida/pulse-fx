import { describe, it, expect, vi } from 'vitest';
import { GetFavoriteIndicatorsUseCase } from './GetFavoriteIndicatorsUseCase';
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

describe('GetFavoriteIndicatorsUseCase', () => {
  it('deve retornar apenas favoritos mapeados para DTO', async () => {
    const repo = {
      findAll: vi.fn(),
      findFavorites: vi.fn().mockResolvedValue([
        makeIndicator({ id: 'USD_BRL' }),
      ]),
    };

    const useCase = new GetFavoriteIndicatorsUseCase(repo as any);
    const result = await useCase.execute();

    expect(result.indicators).toHaveLength(1);
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
    expect(repo.findFavorites).toHaveBeenCalled();
  });

  it('deve retornar array vazio quando não há favoritos', async () => {
    const repo = {
      findAll: vi.fn(),
      findFavorites: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetFavoriteIndicatorsUseCase(repo as any);
    const result = await useCase.execute();

    expect(result.indicators).toEqual([]);
  });

  it('deve chamar findFavorites do repositório', async () => {
    const findFavoritesMock = vi.fn().mockResolvedValue([makeIndicator()]);
    const repo = {
      findAll: vi.fn(),
      findFavorites: findFavoritesMock,
    };

    const useCase = new GetFavoriteIndicatorsUseCase(repo as any);
    await useCase.execute();

    expect(findFavoritesMock).toHaveBeenCalledTimes(1);
  });
});