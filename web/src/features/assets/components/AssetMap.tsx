import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  applyAreaFilter,
  clearAreaFilter,
  markMapBoundsChanged,
  selectAsset,
  setDraftMapBounds,
} from '../state/assetUiSlice'
import { AssetMapView } from './AssetMapView'
import type { Asset, BBox } from '../model/asset.types'

type AssetMapProps = {
  assets: Asset[]
  isAreaFilterActive: boolean
  selectedAssetId: string | null
}

export function AssetMap({
  assets,
  isAreaFilterActive,
  selectedAssetId,
}: AssetMapProps) {
  const dispatch = useAppDispatch()
  const hasUnappliedMapBoundsChange = useAppSelector(
    (state) => state.assetUi.hasUnappliedMapBoundsChange,
  )

  const center = useMemo<[number, number]>(() => {
    const firstAsset = assets[0]

    return firstAsset ? [firstAsset.lat, firstAsset.lng] : [42.3601, -71.0589]
  }, [assets])
  const handleSelectAsset = useCallback(
    (assetId: string) => dispatch(selectAsset(assetId)),
    [dispatch],
  )
  const handleApplyAreaFilter = useCallback(() => {
    dispatch(applyAreaFilter())
  }, [dispatch])
  const handleClearAreaFilter = useCallback(() => {
    dispatch(clearAreaFilter())
  }, [dispatch])
  const handleMapBoundsChanged = useCallback(
    (bbox: BBox) => dispatch(markMapBoundsChanged(bbox)),
    [dispatch],
  )
  const handleMapBoundsSynced = useCallback(
    (bbox: BBox) => dispatch(setDraftMapBounds(bbox)),
    [dispatch],
  )

  return (
    <AssetMapView
      assets={assets}
      center={center}
      hasUnappliedMapBoundsChange={hasUnappliedMapBoundsChange}
      isAreaFilterActive={isAreaFilterActive}
      onApplyAreaFilter={handleApplyAreaFilter}
      onClearAreaFilter={handleClearAreaFilter}
      onMapBoundsChanged={handleMapBoundsChanged}
      onMapBoundsSynced={handleMapBoundsSynced}
      onSelectAsset={handleSelectAsset}
      selectedAssetId={selectedAssetId}
      shouldFitAssets={!isAreaFilterActive}
    />
  )
}
