import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/main/factories/use-cases', () => ({
  makeGetIndicatorDetailUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetAllIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetFavoriteIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeToggleFavoriteUseCase: () => ({
    execute: vi.fn(),
  }),
}));

import { registerRoutes } from '@/infrastructure/http/controllers';

describe('Indicator Detail Controller - GET /indicators/:id (Unit)', () => {
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

  it('deve retornar 200 com detalhe do indicador e observations', async () => {
    const mockDetail = {
      id: 'USD_BRL',
      name: 'Dólar Comercial PTAX',
      source: 'BCB' as const,
      unit: 'CURRENCY' as const,
      frequency: 'DAILY' as const,
      lastValue: 5.25,
      variation: 0.02,
      referenceDate: new Date('2026-09-20'),
      observations: [
        { date: new Date('2026-09-20'), value: 5.25 },
        { date: new Date('2026-09-19'), value: 5.20 },
        { date: new Date('2026-09-18'), value: 5.18 },
      ],
    };

    mockDetailExecute.mockResolvedValue({ indicator: mockDetail });

    const response = await request(app).get('/indicators/USD_BRL');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('USD_BRL');
    expect(response.body.observations).toHaveLength(3);
    expect(response.body.observations[0]).toMatchObject({
      date: '2026-09-20T00:00:00.000Z',
      value: 5.25,
    });
  });

  it('deve retornar 404 quando indicador não encontrado', async () => {
    mockDetailExecute.mockRejectedValue(new Error('Indicador INVALID não encontrado'));

    const response = await request(app).get('/indicators/INVALID');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Not Found',
      statusCode: 404,
    });
    expect(response.body.message).toContain('não encontrado');
  });

  it('deve retornar 500 quando use case lança erro genérico', async () => {
    mockDetailExecute.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/indicators/USD_BRL');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Internal Server Error',
      statusCode: 500,
    });
    expect(response.body.message).toBe('Database error');
  });
});