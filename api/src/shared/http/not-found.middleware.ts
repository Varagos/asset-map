import type { NextFunction, Request, Response } from 'express'

export function notFoundMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const error = new Error(`Route ${request.method} ${request.path} not found`)
  error.name = 'NotFoundError'
  next(error)
}
