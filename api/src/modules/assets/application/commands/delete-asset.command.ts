import { AssetNotFoundError } from '../../domain/asset.errors'
import type { AssetsRepository } from '../ports/assets.repository'

export class DeleteAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.assetsRepository.deleteById(id)

    if (!deleted) {
      throw new AssetNotFoundError(id)
    }
  }
}
