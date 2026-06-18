import type { ZodIssue } from 'zod'

export type ValidationIssue = {
  path: string
  message: string
}

export class RequestValidationError extends Error {
  readonly code = 'REQUEST_VALIDATION_FAILED'
  readonly details: ValidationIssue[]

  constructor(issues: ZodIssue[]) {
    super('Request validation failed')
    this.name = 'RequestValidationError'
    this.details = issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))
  }
}
