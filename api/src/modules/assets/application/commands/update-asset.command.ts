import { toAssetDto, type AssetDto } from '../asset.dto'
import { AssetNotFoundError } from '../../domain/asset.errors'
import type { Asset } from '../../domain/asset.entity'
import type { UpdateAssetInput } from '../../domain/asset.types'
import type { AssetsRepository } from '../ports/assets.repository'

export type UpdateAssetCommand = {
  id: string
  expectedVersion: number
  changes: UpdateAssetInput
}

function applyAssetChanges(asset: Asset, changes: UpdateAssetInput): void {
  if (changes.name !== undefined) {
    asset.rename(changes.name)
  }

  if (changes.type !== undefined) {
    asset.changeType(changes.type)
  }

  if (changes.status !== undefined) {
    asset.changeStatus(changes.status)
  }

  if (changes.lat !== undefined || changes.lng !== undefined) {
    const current = asset.toPrimitives()

    asset.relocate(
      changes.lat === undefined ? current.lat : changes.lat,
      changes.lng === undefined ? current.lng : changes.lng,
    )
  }

  if (changes.installed_at !== undefined) {
    asset.changeInstallationDate(changes.installed_at)
  }

  if (changes.last_inspected_at !== undefined) {
    asset.changeLastInspectionDate(changes.last_inspected_at)
  }

  if (changes.notes !== undefined) {
    asset.changeNotes(changes.notes)
  }
}

export class UpdateAssetCommandHandler {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async execute({
    id,
    expectedVersion,
    changes,
  }: UpdateAssetCommand): Promise<AssetDto> {
    const asset = await this.assetsRepository.findById(id)

    if (!asset) {
      throw new AssetNotFoundError(id)
    }

    applyAssetChanges(asset, changes)

    const savedAsset = await this.assetsRepository.save(asset, {
      expectedVersion,
    })

    return toAssetDto(savedAsset)
  }
}
