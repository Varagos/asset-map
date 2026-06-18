import { DomainError } from '../../../shared/errors/domain-error'

export class AssetNotFoundError extends DomainError {
  readonly code = 'ASSET_NOT_FOUND'

  constructor(id: string) {
    super(`Asset ${id} was not found`)
  }
}

export class InvalidAssetError extends DomainError {
  readonly code = 'INVALID_ASSET'

  constructor(
    message: string,
    readonly details: readonly string[] = [],
  ) {
    super(message)
  }
}

export class AssetVersionPreconditionRequiredError extends DomainError {
  readonly code = 'ASSET_VERSION_PRECONDITION_REQUIRED'

  constructor() {
    super('Send If-Match with the asset version before writing this asset')
  }
}

export class InvalidAssetVersionPreconditionError extends DomainError {
  readonly code = 'INVALID_ASSET_VERSION_PRECONDITION'

  constructor() {
    super('If-Match must be a strong ETag containing a positive asset version')
  }
}

export class AssetVersionConflictError extends DomainError {
  readonly code = 'ASSET_VERSION_CONFLICT'

  constructor(id: string) {
    super(`Asset ${id} has changed since it was loaded`)
  }
}
