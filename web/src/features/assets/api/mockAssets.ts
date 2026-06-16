import seedAssets from './seed.json'
import { isAssetInsideBBox } from '../../../shared/utils/bbox'
import type { Asset, GetAssetsQuery } from '../model/asset.types'

export const initialMockAssets = seedAssets as Asset[]

export function cloneMockAssets(): Asset[] {
  return initialMockAssets.map((asset) => ({ ...asset }))
}

export function filterAssets(
  assets: readonly Asset[],
  query: GetAssetsQuery = {},
): Asset[] {
  const filteredAssets = assets.filter((asset) => {
    const matchesType = !query.type || asset.type === query.type
    const matchesStatus = !query.status || asset.status === query.status
    const matchesBBox = !query.bbox || isAssetInsideBBox(asset, query.bbox)

    return matchesType && matchesStatus && matchesBBox
  })

  return typeof query.limit === 'number'
    ? filteredAssets.slice(0, query.limit)
    : filteredAssets
}
