import { Request, Response, NextFunction } from 'express';
import { GetAllIndicatorsUseCase } from '@/use-cases/GetAllIndicatorsUseCase';

export function makeIndicatorsRoute(getAllIndicatorsUseCase: GetAllIndicatorsUseCase) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await getAllIndicatorsUseCase.execute();
      res.json(result.indicators);
    } catch (error) {
      next(error);
    }
  };
}