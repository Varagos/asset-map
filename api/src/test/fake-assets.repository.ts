import type {
  AssetsRepository,
  ListAssetsCriteria,
  PaginatedAssets,
} from '../modules/assets/application/ports/assets.repository'
import type { Asset } from '../modules/assets/domain/asset.entity'
import type { AssetProps } from '../modules/assets/domain/asset.types'

function isInsideBBox(asset: AssetProps, criteria: ListAssetsCriteria): boolean {
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

function sortAssets(assets: Asset[], sort: ListAssetsCriteria['sort']): Asset[] {
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
    this.assets = [...seedAssets]
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
      items: sortedAssets.slice(
        criteria.offset,
        criteria.offset + criteria.limit,
      ),
      total: sortedAssets.length,
      limit: criteria.limit,
      offset: criteria.offset,
    })
  }

  findById(id: string): Promise<Asset | null> {
    return Promise.resolve(
      this.assets.find((asset) => asset.toPrimitives().id === id) ?? null,
    )
  }

  save(asset: Asset): Promise<Asset> {
    const id = asset.toPrimitives().id
    const existingIndex = this.assets.findIndex(
      (item) => item.toPrimitives().id === id,
    )

    if (existingIndex === -1) {
      this.assets = [asset, ...this.assets]
      return Promise.resolve(asset)
    }

    this.assets = this.assets.map((item) =>
      item.toPrimitives().id === id ? asset : item,
    )

    return Promise.resolve(asset)
  }

  deleteById(id: string): Promise<boolean> {
    const initialLength = this.assets.length
    this.assets = this.assets.filter((asset) => asset.toPrimitives().id !== id)

    return Promise.resolve(this.assets.length !== initialLength)
  }
}
