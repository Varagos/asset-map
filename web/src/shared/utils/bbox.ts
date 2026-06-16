import type { Asset, BBox } from '../../features/assets/model/asset.types'

export function isAssetInsideBBox(asset: Asset, bbox: BBox): boolean {
  return (
    asset.lng >= bbox.minLng &&
    asset.lng <= bbox.maxLng &&
    asset.lat >= bbox.minLat &&
    asset.lat <= bbox.maxLat
  )
}

export function areBBoxesEqual(
  left: BBox | null,
  right: BBox | null,
  epsilon = 0.000001,
): boolean {
  if (left === right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return (
    Math.abs(left.minLng - right.minLng) < epsilon &&
    Math.abs(left.minLat - right.minLat) < epsilon &&
    Math.abs(left.maxLng - right.maxLng) < epsilon &&
    Math.abs(left.maxLat - right.maxLat) < epsilon
  )
}
