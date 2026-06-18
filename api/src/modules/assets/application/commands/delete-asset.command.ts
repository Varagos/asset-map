import {
  AssetNotFoundError,
  AssetVersionConflictError,
} from '../../domain/asset.errors'
import type { AssetsRepository } from '../ports/assets.repository'

export type DeleteAssetCommand = {
  id: string
  expectedVersion: number
}

export class DeleteAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute({ id, expectedVersion }: DeleteAssetCommand): Promise<void> {
    const asset = await this.assetsRepository.findById(id)

    if (!asset) {
      throw new AssetNotFoundError(id)
    }

    const deleted = await this.assetsRepository.deleteById(id, {
      expectedVersion,
    })

    if (!deleted) {
      throw new AssetVersionConflictError(id)
    }
  }
}
