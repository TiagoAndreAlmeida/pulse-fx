import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockSyncExecute = vi.fn();

vi.mock('@/main/factories/use-cases', () => ({
  makeSyncExternalIndicatorsUseCase: () => ({
    execute: mockSyncExecute,
  }),
  makeGetAllIndicatorsUseCase: () => ({
    execute: vi.fn(),
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
}));

import { registerRoutes } from '@/infrastructure/http/controllers';

describe('Admin Sync Controller - POST /admin/sync (Unit)', () => {
  let app: express.Express;

  beforeEach(() => {
    // Set the ADMIN_API_KEY for the test environment
    process.env.ADMIN_API_KEY = 'k7CFoa75qwvHE8KfKGze2fKmgvYLmLam';
    
    const testApp = express();
    testApp.use(express.json());
    registerRoutes(testApp);
    vi.clearAllMocks();
    app = testApp;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve executar sync com sucesso com API key válida (200)', async () => {
    const mockResult = {
      items: [
        { indicatorId: 'USD_BRL', synced: 10 },
        { indicatorId: 'SELIC', synced: 5 },
      ],
      timestamp: new Date('2026-09-24T22:00:00.000Z'),
    };

    mockSyncExecute.mockResolvedValue(mockResult);

    const response = await request(app)
      .post('/admin/sync')
      .set('x-admin-key', 'k7CFoa75qwvHE8KfKGze2fKmgvYLmLam');

    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(mockResult.items);
    expect(response.body.timestamp).toBeDefined();
    expect(typeof response.body.timestamp).toBe('string');
    expect(mockSyncExecute).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 401 sem header x-admin-key', async () => {
    const response = await request(app).post('/admin/sync');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      statusCode: 401,
    });
    expect(response.body.message).toContain('API key inválida ou ausente');
  });

  it('deve retornar 401 com API key inválida', async () => {
    const response = await request(app)
      .post('/admin/sync')
      .set('x-admin-key', 'invalid-key');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      error: 'Unauthorized',
      statusCode: 401,
    });
    expect(response.body.message).toContain('API key inválida ou ausente');
  });

  it('deve retornar 500 quando use case lança erro genérico', async () => {
    mockSyncExecute.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/admin/sync')
      .set('x-admin-key', 'k7CFoa75qwvHE8KfKGze2fKmgvYLmLam');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      error: 'Internal Server Error',
      statusCode: 500,
    });
    expect(response.body.message).toBe('Database error');
  });
});