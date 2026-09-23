import { Request, Response, NextFunction } from 'express';
import { GetIndicatorDetailUseCase } from '@/use-cases/GetIndicatorDetailUseCase';

export function makeIndicatorDetailRoute(getDetailUseCase: GetIndicatorDetailUseCase) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      if (!id) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Parâmetro "id" é obrigatório',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await getDetailUseCase.execute(id);
      res.json(result.indicator);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          statusCode: 404,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  };
}