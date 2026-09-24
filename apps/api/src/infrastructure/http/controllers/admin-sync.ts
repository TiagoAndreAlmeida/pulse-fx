import { Request, Response, NextFunction } from 'express';
import { SyncExternalIndicatorsUseCase } from '@/use-cases/SyncExternalIndicatorsUseCase';

export function makeAdminSyncRoute(syncUseCase: SyncExternalIndicatorsUseCase) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await syncUseCase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}