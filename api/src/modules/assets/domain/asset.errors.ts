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
