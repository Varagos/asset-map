import type { Asset, BBox } from '../../features/assets/model/asset.types'

export function isAssetInsideBBox(asset: Asset, bbox: BBox): boolean {
  return (
    asset.lng >= bbox.minLng &&
    asset.lng <= bbox.maxLng &&
    asset.lat >= bbox.minLat &&
    asset.lat <= bbox.maxLat
  )
}

export function areBBoxesEqual(left: BBox | null, right: BBox | null): boolean {
  if (left === right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return (
    left.minLng === right.minLng &&
    left.minLat === right.minLat &&
    left.maxLng === right.maxLng &&
    left.maxLat === right.maxLat
  )
}
