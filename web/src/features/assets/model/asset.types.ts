export const ASSET_TYPES = ['pipe', 'hydrant', 'sensor', 'valve'] as const
export const ASSET_STATUSES = ['ok', 'warning', 'critical'] as const

export type AssetType = (typeof ASSET_TYPES)[number]
export type AssetStatus = (typeof ASSET_STATUSES)[number]
export type AssetListSort = 'status' | 'name'

export type Asset = {
  id: string
  version: number
  name: string
  type: AssetType
  status: AssetStatus
  lat: number
  lng: number
  installed_at: string
  last_inspected_at: string | null
  notes: string
}

export type BBox = {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export type GetAssetsQuery = {
  type?: AssetType
  status?: AssetStatus
  bbox?: BBox
  limit?: number
  offset?: number
  sort?: AssetListSort
}

export type GetAssetsResponse = {
  items: Asset[]
  total: number
  limit: number
  offset: number
}

export type AssetsSummary = {
  total: number
  ok: number
  warning: number
  critical: number
}

export type CreateAssetInput = Omit<Asset, 'id' | 'version'>

export type UpdateAssetInput = {
  id: string
  version: number
  changes: Partial<CreateAssetInput>
}

export type DeleteAssetInput = {
  id: string
  version: number
}
