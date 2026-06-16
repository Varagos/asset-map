import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useGetAssetsQuery } from '../api/assetsApi'
import {
  openCreateForm,
  selectAsset,
  selectAssetsQuery,
} from '../state/assetUiSlice'
import { AssetDetailDrawer } from './AssetDetailDrawer'
import { AssetDashboardView } from './AssetDashboardView'
import { AssetFilters } from './AssetFilters'
import { AssetFormDialog } from './AssetFormDialog'
import { AssetMap } from './AssetMap'
import { DeleteAssetDialog } from './DeleteAssetDialog'

export function AssetDashboard() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(selectAssetsQuery)
  const { limitToVisibleMapArea, selectedAssetId } = useAppSelector(
    (state) => state.assetUi,
  )
  const { data: assets = [], isLoading } = useGetAssetsQuery(query)
  const { data: allAssets = [] } = useGetAssetsQuery()

  const okCount = allAssets.filter((asset) => asset.status === 'ok').length
  const warningCount = allAssets.filter(
    (asset) => asset.status === 'warning',
  ).length
  const criticalCount = allAssets.filter(
    (asset) => asset.status === 'critical',
  ).length

  return (
    <AssetDashboardView
      assets={assets}
      criticalCount={criticalCount}
      deleteDialog={<DeleteAssetDialog />}
      detailDrawer={<AssetDetailDrawer />}
      filters={<AssetFilters />}
      formDialog={<AssetFormDialog />}
      isLimitedToVisibleMapArea={limitToVisibleMapArea}
      isLoading={isLoading}
      map={<AssetMap assets={assets} selectedAssetId={selectedAssetId} />}
      okCount={okCount}
      onCreateAsset={() => dispatch(openCreateForm())}
      onSelectAsset={(assetId) => dispatch(selectAsset(assetId))}
      selectedAssetId={selectedAssetId}
      totalCount={allAssets.length}
      warningCount={warningCount}
    />
  )
}
