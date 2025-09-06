import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error without exposing sensitive data
  const requestId = req.body?.requestId || 'unknown';
  console.error(`[${requestId}] Error:`, error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error',
    meta: { requestId }
  });
};
