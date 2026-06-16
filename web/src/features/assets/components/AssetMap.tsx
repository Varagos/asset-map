import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  refreshMapBounds,
  selectAsset,
  setCommittedMapBounds,
  setDraftMapBounds,
} from '../state/assetUiSlice'
import { AssetMapView } from './AssetMapView'
import type { Asset, BBox } from '../model/asset.types'

type AssetMapProps = {
  assets: Asset[]
  selectedAssetId: string | null
}

export function AssetMap({ assets, selectedAssetId }: AssetMapProps) {
  const dispatch = useAppDispatch()
  const { hasUnappliedMapBoundsChange, limitToVisibleMapArea } = useAppSelector(
    (state) => state.assetUi,
  )

  const center = useMemo<[number, number]>(() => {
    const firstAsset = assets[0]

    return firstAsset ? [firstAsset.lat, firstAsset.lng] : [42.3601, -71.0589]
  }, [assets])
  const handleCommitMapBounds = useCallback(
    (bbox: BBox) => dispatch(setCommittedMapBounds(bbox)),
    [dispatch],
  )
  const handleRefreshResults = useCallback(() => {
    dispatch(refreshMapBounds())
  }, [dispatch])
  const handleSelectAsset = useCallback(
    (assetId: string) => dispatch(selectAsset(assetId)),
    [dispatch],
  )
  const handleUpdateDraftMapBounds = useCallback(
    (bbox: BBox) => dispatch(setDraftMapBounds(bbox)),
    [dispatch],
  )

  return (
    <AssetMapView
      assets={assets}
      center={center}
      hasUnappliedMapBoundsChange={hasUnappliedMapBoundsChange}
      isLimitedToVisibleMapArea={limitToVisibleMapArea}
      onCommitMapBounds={handleCommitMapBounds}
      onRefreshResults={handleRefreshResults}
      onSelectAsset={handleSelectAsset}
      onUpdateDraftMapBounds={handleUpdateDraftMapBounds}
      selectedAssetId={selectedAssetId}
    />
  )
}
