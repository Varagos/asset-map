export const ASSET_TYPES = ['pipe', 'hydrant', 'sensor', 'valve'] as const
export const ASSET_STATUSES = ['ok', 'warning', 'critical'] as const

export type AssetType = (typeof ASSET_TYPES)[number]
export type AssetStatus = (typeof ASSET_STATUSES)[number]

export type Asset = {
  id: string
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
  search?: string
  type?: AssetType
  status?: AssetStatus
  bbox?: BBox
  limit?: number
}

export type CreateAssetInput = Omit<Asset, 'id'>

export type UpdateAssetInput = {
  id: string
  changes: Partial<Omit<Asset, 'id'>>
}
