import { toAssetDto, type AssetDto } from '../asset.dto'
import { AssetNotFoundError } from '../../domain/asset.errors'
import type { UpdateAssetInput } from '../../domain/asset.types'
import type { AssetsRepository } from '../ports/assets.repository'

export type UpdateAssetCommand = {
  id: string
  changes: UpdateAssetInput
}

export class UpdateAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute({ id, changes }: UpdateAssetCommand): Promise<AssetDto> {
    const asset = await this.assetsRepository.findById(id)

    if (!asset) {
      throw new AssetNotFoundError(id)
    }

    const savedAsset = await this.assetsRepository.save(asset.update(changes))

    return toAssetDto(savedAsset)
  }
}
