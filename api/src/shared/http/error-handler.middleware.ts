import { ZodError } from 'zod'
import { DomainError } from '../errors/domain-error'
import { AssetNotFoundError, InvalidAssetError } from '../../modules/assets/domain/asset.errors'
import { RequestValidationError } from './request-validation-error'
import type { NextFunction, Request, Response } from 'express'

type ErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
    requestId: string
  }
}

function getRequestId(response: Response): string {
  return typeof response.locals.requestId === 'string'
    ? response.locals.requestId
    : 'unknown'
}

function sendError(
  response: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  const body: ErrorResponse = {
    error: {
      code,
      message,
      requestId: getRequestId(response),
    },
  }

  if (details !== undefined) {
    body.error.details = details
  }

  response.status(status).json(body)
}

export function errorHandlerMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (response.headersSent) {
    request.socket.destroy()
    return
  }

  if (error instanceof RequestValidationError) {
    sendError(response, 400, error.code, error.message, error.details)
    return
  }

  if (error instanceof ZodError) {
    const validationError = new RequestValidationError(error.issues)
    sendError(
      response,
      400,
      validationError.code,
      validationError.message,
      validationError.details,
    )
    return
  }

  if (error instanceof AssetNotFoundError) {
    sendError(response, 404, error.code, error.message)
    return
  }

  if (error instanceof InvalidAssetError) {
    sendError(response, 400, error.code, error.message, error.details)
    return
  }

  if (error instanceof DomainError) {
    sendError(response, 400, error.code, error.message)
    return
  }

  if (error instanceof Error && error.name === 'NotFoundError') {
    sendError(response, 404, 'ROUTE_NOT_FOUND', error.message)
    return
  }

  console.error({
    requestId: getRequestId(response),
    method: request.method,
    path: request.path,
    error,
  })

  sendError(
    response,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred',
  )
}
