import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockToggleExecute = vi.fn();

vi.mock('@/main/factories/use-cases', () => ({
  makeToggleFavoriteUseCase: () => ({
    execute: mockToggleExecute,
  }),
  makeGetIndicatorDetailUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetAllIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeGetFavoriteIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
  makeSyncExternalIndicatorsUseCase: () => ({
    execute: vi.fn(),
  }),
}));

import { registerRoutes } from '@/infrastructure/http/controllers';

describe('Favorite Toggle Controller - POST /indicators/:id/favorite (Unit)', () => {
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

  it('deve marcar como favorito quando não era favorito (isFavorite: true)', async () => {
    mockToggleExecute.mockResolvedValue({ isFavorite: true });

    const response = await request(app).post('/indicators/USD_BRL/favorite');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isFavorite: true });
    expect(mockToggleExecute).toHaveBeenCalledTimes(1);
    expect(mockToggleExecute).toHaveBeenCalledWith('USD_BRL');
  });

  it('deve desmarcar favorito quando já era favorito (isFavorite: false)', async () => {
    mockToggleExecute.mockResolvedValue({ isFavorite: false });

    const response = await request(app).post('/indicators/USD_BRL/favorite');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isFavorite: false });
    expect(mockToggleExecute).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 404 quando indicador não encontrado', async () => {
    mockToggleExecute.mockRejectedValue(new Error('Indicador INVALID não encontrado'));

    const response = await request(app).post('/indicators/INVALID/favorite');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Not Found',
      statusCode: 404,
    });
    expect(response.body.message).toContain('não encontrado');
  });

  it('deve retornar 500 quando use case lança erro genérico', async () => {
    mockToggleExecute.mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/indicators/USD_BRL/favorite');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Internal Server Error',
      statusCode: 500,
    });
    expect(response.body.message).toBe('Database error');
  });
});