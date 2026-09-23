import { Request, Response, NextFunction } from 'express';
import { GetFavoriteIndicatorsUseCase } from '@/use-cases/GetFavoriteIndicatorsUseCase';

export function makeFavoritesRoute(getFavoritesUseCase: GetFavoriteIndicatorsUseCase) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await getFavoritesUseCase.execute();
      res.json(result.indicators);
    } catch (error) {
      next(error);
    }
  };
}