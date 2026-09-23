import { Application, Request, Response, NextFunction } from 'express';
import { makeIndicatorsRoute } from './indicators';
import { makeFavoritesRoute } from './favorites';
import { makeIndicatorDetailRoute } from './indicator-detail';
import { makeFavoriteToggleRoute } from './favorite-toggle';
import { makeGetAllIndicatorsUseCase } from '@/main/factories/use-cases';
import { makeGetFavoriteIndicatorsUseCase } from '@/main/factories/use-cases';
import { makeGetIndicatorDetailUseCase } from '@/main/factories/use-cases';
import { makeToggleFavoriteUseCase } from '@/main/factories/use-cases';

export function registerRoutes(app: Application): void {
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get(
    '/indicators',
    makeIndicatorsRoute(makeGetAllIndicatorsUseCase())
  );

  app.get(
    '/indicators/favorites',
    makeFavoritesRoute(makeGetFavoriteIndicatorsUseCase())
  );

  app.get(
    '/indicators/:id',
    makeIndicatorDetailRoute(makeGetIndicatorDetailUseCase())
  );

  app.post(
    '/indicators/:id/favorite',
    makeFavoriteToggleRoute(makeToggleFavoriteUseCase())
  );

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Failed to process request',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  });
}