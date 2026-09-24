import { Request, Response, NextFunction } from 'express';

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const adminKey = req.headers['x-admin-key'];
  const validKey = process.env.ADMIN_API_KEY;

  if (!adminKey || adminKey !== validKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key inválida ou ausente',
      statusCode: 401,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  next();
}