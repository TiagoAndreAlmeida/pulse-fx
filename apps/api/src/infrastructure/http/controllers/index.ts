import { Application, Request, Response, NextFunction } from 'express';
import { makeIndicatorsRoute } from './indicators';
import { makeGetAllIndicatorsUseCase } from '@/main/factories/use-cases';

export function registerRoutes(app: Application): void {
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get(
    '/indicators',
    makeIndicatorsRoute(makeGetAllIndicatorsUseCase())
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