import { describe, it, expect, vi } from 'vitest';
import { ToggleFavoriteUseCase } from './ToggleFavoriteUseCase';
import { Indicator } from '@/domain/entities/Indicator';
import { Favorite } from '@/domain/entities/Favorite';

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

function makeFavorite(overrides: Partial<FavoriteProps> = {}): Favorite {
  return Favorite.create({
    indicatorId: 'USD_BRL',
    createdAt: new Date('2026-09-20'),
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

interface FavoriteProps {
  indicatorId: string;
  createdAt: Date;
}

describe('ToggleFavoriteUseCase', () => {
  it('deve marcar como favorito quando não era favorito', async () => {
    const indicator = makeIndicator();
    const favoriteRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      add: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn(),
    };

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ToggleFavoriteUseCase(indicatorRepo as any, favoriteRepo as any);
    const result = await useCase.execute('USD_BRL');

    expect(result).toEqual({ isFavorite: true });
    expect(favoriteRepo.findByIndicatorId).toHaveBeenCalledWith('USD_BRL');
    expect(favoriteRepo.add).toHaveBeenCalled();
    expect(favoriteRepo.remove).not.toHaveBeenCalled();
  });

  it('deve desmarcar favorito quando já era favorito', async () => {
    const indicator = makeIndicator();
    const favorite = makeFavorite();

    const favoriteRepo = {
      findByIndicatorId: vi.fn().mockResolvedValue(favorite),
      findAll: vi.fn(),
      add: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(indicator),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ToggleFavoriteUseCase(indicatorRepo as any, favoriteRepo as any);
    const result = await useCase.execute('USD_BRL');

    expect(result).toEqual({ isFavorite: false });
    expect(favoriteRepo.findByIndicatorId).toHaveBeenCalledWith('USD_BRL');
    expect(favoriteRepo.remove).toHaveBeenCalledWith('USD_BRL');
    expect(favoriteRepo.add).not.toHaveBeenCalled();
  });

  it('deve lançar erro se indicador não existe', async () => {
    const favoriteRepo = {
      findByIndicatorId: vi.fn(),
      findAll: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
    };

    const indicatorRepo = {
      findById: vi.fn().mockResolvedValue(null),
      findAll: vi.fn(),
      findFavorites: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    const useCase = new ToggleFavoriteUseCase(indicatorRepo as any, favoriteRepo as any);

    await expect(useCase.execute('INVALID')).rejects.toThrow('Indicador INVALID não encontrado');
    expect(indicatorRepo.findById).toHaveBeenCalledWith('INVALID');
  });
});