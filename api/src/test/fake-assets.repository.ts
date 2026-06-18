import type {
  AssetsRepository,
  DeleteAssetOptions,
  ListAssetsCriteria,
  PaginatedAssets,
  SaveAssetOptions,
} from '../modules/assets/application/ports/assets.repository'
import { Asset } from '../modules/assets/domain/asset.entity'
import { AssetVersionConflictError } from '../modules/assets/domain/asset.errors'
import type { AssetProps } from '../modules/assets/domain/asset.types'

function cloneAsset(asset: Asset): Asset {
  return Asset.reconstitute(asset.toPrimitives())
}

function isInsideBBox(
  asset: AssetProps,
  criteria: ListAssetsCriteria,
): boolean {
  if (!criteria.bbox) {
    return true
  }

  const { maxLat, maxLng, minLat, minLng } = criteria.bbox

  return (
    asset.lng >= minLng &&
    asset.lng <= maxLng &&
    asset.lat >= minLat &&
    asset.lat <= maxLat
  )
}

function statusRank(status: AssetProps['status']): number {
  if (status === 'critical') {
    return 0
  }

  if (status === 'warning') {
    return 1
  }

  return 2
}

function sortAssets(
  assets: Asset[],
  sort: ListAssetsCriteria['sort'],
): Asset[] {
  return [...assets].sort((leftAsset, rightAsset) => {
    const left = leftAsset.toPrimitives()
    const right = rightAsset.toPrimitives()

    if (sort === 'name') {
      return left.name.localeCompare(right.name)
    }

    return (
      statusRank(left.status) - statusRank(right.status) ||
      left.name.localeCompare(right.name)
    )
  })
}

export class FakeAssetsRepository implements AssetsRepository {
  private assets: Asset[]

  constructor(seedAssets: Asset[] = []) {
    this.assets = seedAssets.map(cloneAsset)
  }

  list(criteria: ListAssetsCriteria): Promise<PaginatedAssets> {
    const filteredAssets = this.assets.filter((asset) => {
      const props = asset.toPrimitives()

      return (
        (!criteria.type || props.type === criteria.type) &&
        (!criteria.status || props.status === criteria.status) &&
        isInsideBBox(props, criteria)
      )
    })
    const sortedAssets = sortAssets(filteredAssets, criteria.sort)

    return Promise.resolve({
      items: sortedAssets
        .slice(criteria.offset, criteria.offset + criteria.limit)
        .map(cloneAsset),
      total: sortedAssets.length,
      limit: criteria.limit,
      offset: criteria.offset,
    })
  }

  findById(id: string): Promise<Asset | null> {
    const asset = this.assets.find((item) => item.toPrimitives().id === id)

    return Promise.resolve(asset ? cloneAsset(asset) : null)
  }

  save(asset: Asset, options?: SaveAssetOptions): Promise<Asset> {
    const props = asset.toPrimitives()
    const id = props.id
    const existingIndex = this.assets.findIndex(
      (item) => item.toPrimitives().id === id,
    )

    if (existingIndex === -1) {
      if (options?.expectedVersion !== undefined) {
        throw new AssetVersionConflictError(id)
      }

      const createdAsset = cloneAsset(asset)

      this.assets = [createdAsset, ...this.assets]
      return Promise.resolve(cloneAsset(createdAsset))
    }

    const existingAsset = this.assets[existingIndex]

    if (!existingAsset) {
      throw new AssetVersionConflictError(id)
    }

    const existingVersion = existingAsset.toPrimitives().version

    if (
      options?.expectedVersion !== undefined &&
      existingVersion !== options.expectedVersion
    ) {
      throw new AssetVersionConflictError(id)
    }

    const savedAsset = Asset.reconstitute({
      ...props,
      version: existingVersion + 1,
    })

    this.assets = this.assets.map((item) =>
      item.toPrimitives().id === id ? savedAsset : item,
    )

    return Promise.resolve(cloneAsset(savedAsset))
  }

  deleteById(id: string, options?: DeleteAssetOptions): Promise<boolean> {
    const existingAsset = this.assets.find(
      (asset) => asset.toPrimitives().id === id,
    )

    if (
      existingAsset &&
      options?.expectedVersion !== undefined &&
      existingAsset.toPrimitives().version !== options.expectedVersion
    ) {
      return Promise.resolve(false)
    }

    const initialLength = this.assets.length
    this.assets = this.assets.filter((asset) => asset.toPrimitives().id !== id)

    return Promise.resolve(this.assets.length !== initialLength)
  }
}
