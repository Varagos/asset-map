export const ASSET_TYPES = ['pipe', 'hydrant', 'sensor', 'valve'] as const
export const ASSET_STATUSES = ['ok', 'warning', 'critical'] as const
export const ASSET_LIST_SORTS = ['status', 'name'] as const

export type AssetType = (typeof ASSET_TYPES)[number]
export type AssetStatus = (typeof ASSET_STATUSES)[number]
export type AssetListSort = (typeof ASSET_LIST_SORTS)[number]

export type BBox = {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export type AssetProps = {
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

export type CreateAssetInput = Omit<AssetProps, 'id'>

export type UpdateAssetInput = {
  [Key in keyof Omit<AssetProps, 'id'>]?: Omit<AssetProps, 'id'>[Key] | undefined
}
