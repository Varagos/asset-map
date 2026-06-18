import type { Asset } from '../domain/asset.entity'
import type { AssetProps } from '../domain/asset.types'

export type AssetDto = AssetProps

export function toAssetDto(asset: Asset): AssetDto {
  return asset.toPrimitives()
}
