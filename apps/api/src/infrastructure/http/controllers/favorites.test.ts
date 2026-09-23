import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('@/main/factories/use-cases', () => ({
  makeGetFavoriteIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetAllIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetIndicatorDetailUseCase: () => ({
    execute: vi.fn(),
  }),
  makeToggleFavoriteUseCase: () => ({
    execute: vi.fn(),
  }),
}));

import { registerRoutes } from '@/infrastructure/http/controllers';

describe('Favorites Controller - GET /indicators/favorites (Unit)', () => {
  let app: express.Express;

  beforeEach(() => {
    const testApp = express();
    testApp.use(express.json());
    registerRoutes(testApp);
    vi.clearAllMocks();
    app = testApp;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve retornar 200 com lista de favoritos', async () => {
    const mockFavorites = [
      {
        id: 'USD_BRL',
        name: 'Dólar Comercial PTAX',
        source: 'BCB' as const,
        unit: 'CURRENCY' as const,
        frequency: 'DAILY' as const,
        lastValue: 5.25,
        variation: 0.02,
        referenceDate: new Date('2026-09-20'),
      },
      {
        id: 'SELIC',
        name: 'Taxa Selic Meta',
        source: 'BCB' as const,
        unit: 'PERCENTAGE' as const,
        frequency: 'DAILY' as const,
        lastValue: 13.75,
        variation: -0.1,
        referenceDate: new Date('2026-09-20'),
      },
    ];

    mockFavoritesExecute.mockResolvedValue({ indicators: mockFavorites });

    const response = await request(app).get('/indicators/favorites');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toBe('USD_BRL');
    expect(response.body[1].id).toBe('SELIC');
    expect(response.body[0]).toHaveProperty('lastValue');
    expect(response.body[0]).toHaveProperty('variation');
    expect(response.body[0]).toHaveProperty('referenceDate');
  });

  it('deve retornar array vazio quando não há favoritos', async () => {
    mockFavoritesExecute.mockResolvedValue({ indicators: [] });

    const response = await request(app).get('/indicators/favorites');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('deve retornar 500 quando use case lança erro', async () => {
    mockFavoritesExecute.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/indicators/favorites');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Internal Server Error',
      statusCode: 500,
    });
    expect(response.body.message).toBe('Database error');
  });
});