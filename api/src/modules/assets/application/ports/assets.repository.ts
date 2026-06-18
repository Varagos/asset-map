import type { Asset } from '../../domain/asset.entity'
import type {
  AssetListSort,
  AssetStatus,
  AssetType,
  BBox,
} from '../../domain/asset.types'

export type ListAssetsCriteria = {
  type?: AssetType
  status?: AssetStatus
  bbox?: BBox
  limit: number
  offset: number
  sort: AssetListSort
}

export type PaginatedAssets = {
  items: Asset[]
  total: number
  limit: number
  offset: number
}

export interface AssetsRepository {
  list(criteria: ListAssetsCriteria): Promise<PaginatedAssets>
  findById(id: string): Promise<Asset | null>
  save(asset: Asset): Promise<Asset>
  deleteById(id: string): Promise<boolean>
}
