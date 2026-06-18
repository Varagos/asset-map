import { toAssetDto, type AssetDto } from '../asset.dto'
import { AssetNotFoundError } from '../../domain/asset.errors'
import type { AssetsRepository } from '../ports/assets.repository'

export class GetAssetByIdQueryHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute(id: string): Promise<AssetDto> {
    const asset = await this.assetsRepository.findById(id)

    if (!asset) {
      throw new AssetNotFoundError(id)
    }

    return toAssetDto(asset)
  }
}
