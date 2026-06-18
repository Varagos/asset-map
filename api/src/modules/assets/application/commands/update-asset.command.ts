import { toAssetDto, type AssetDto } from '../asset.dto'
import { AssetNotFoundError } from '../../domain/asset.errors'
import type { Asset } from '../../domain/asset.entity'
import type { UpdateAssetInput } from '../../domain/asset.types'
import type { AssetsRepository } from '../ports/assets.repository'

export type UpdateAssetCommand = {
  id: string
  changes: UpdateAssetInput
}

function applyAssetChanges(asset: Asset, changes: UpdateAssetInput): Asset {
  let nextAsset = asset

  if (changes.name !== undefined) {
    nextAsset = nextAsset.rename(changes.name)
  }

  if (changes.type !== undefined) {
    nextAsset = nextAsset.changeType(changes.type)
  }

  if (changes.status !== undefined) {
    nextAsset = nextAsset.changeStatus(changes.status)
  }

  if (changes.lat !== undefined || changes.lng !== undefined) {
    const current = nextAsset.toPrimitives()

    nextAsset = nextAsset.relocate(
      changes.lat === undefined ? current.lat : changes.lat,
      changes.lng === undefined ? current.lng : changes.lng,
    )
  }

  if (changes.installed_at !== undefined) {
    nextAsset = nextAsset.changeInstallationDate(changes.installed_at)
  }

  if (changes.last_inspected_at !== undefined) {
    nextAsset = nextAsset.changeLastInspectionDate(changes.last_inspected_at)
  }

  if (changes.notes !== undefined) {
    nextAsset = nextAsset.changeNotes(changes.notes)
  }

  return nextAsset
}

export class UpdateAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute({ id, changes }: UpdateAssetCommand): Promise<AssetDto> {
    const asset = await this.assetsRepository.findById(id)

    if (!asset) {
      throw new AssetNotFoundError(id)
    }

    const savedAsset = await this.assetsRepository.save(
      applyAssetChanges(asset, changes),
    )

    return toAssetDto(savedAsset)
  }
}
