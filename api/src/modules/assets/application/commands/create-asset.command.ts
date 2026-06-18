import { Asset } from '../../domain/asset.entity'
import { toAssetDto, type AssetDto } from '../asset.dto'
import type { CreateAssetInput } from '../../domain/asset.types'
import type { AssetsRepository } from '../ports/assets.repository'

export class CreateAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute(input: CreateAssetInput): Promise<AssetDto> {
    const asset = Asset.create(input)
    const savedAsset = await this.assetsRepository.save(asset)

    return toAssetDto(savedAsset)
  }
}
