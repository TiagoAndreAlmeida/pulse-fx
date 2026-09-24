import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockExecute = vi.fn();

vi.mock('@/main/factories/use-cases', () => ({
  makeGetAllIndicatorsUseCase: () => ({
    execute: mockExecute,
  }),
  makeGetFavoriteIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetIndicatorDetailUseCase: () => ({
    execute: vi.fn(),
  }),
  makeToggleFavoriteUseCase: () => ({
    execute: vi.fn(),
  }),
  makeSyncExternalIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
}));

import { registerRoutes } from '@/infrastructure/http/controllers';

describe('Indicators Controller - GET /indicators (Unit)', () => {
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

  it('deve retornar 200 com lista de indicadores', async () => {
    const mockIndicators = [
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

    mockExecute.mockResolvedValue({ indicators: mockIndicators });

    const response = await request(app).get('/indicators');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toBe('USD_BRL');
    expect(response.body[1].id).toBe('SELIC');
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('deve retornar array vazio quando não há indicadores', async () => {
    mockExecute.mockResolvedValue({ indicators: [] });

    const response = await request(app).get('/indicators');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 500 quando use case lança erro', async () => {
    mockExecute.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/indicators');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Internal Server Error',
      statusCode: 500,
    });
    expect(response.body.message).toBe('Database error');
  });
});