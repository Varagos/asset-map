import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useGetAssetsQuery } from '../api/assetsApi'
import {
  openCreateForm,
  selectAsset,
  selectAssetsQuery,
  setListPage,
  setListSort,
} from '../state/assetUiSlice'
import { AssetDetailDrawer } from './AssetDetailDrawer'
import { AssetDashboardView } from './AssetDashboardView'
import { AssetFilters } from './AssetFilters'
import { AssetFormDialog } from './AssetFormDialog'
import { AssetMap } from './AssetMap'
import { DeleteAssetDialog } from './DeleteAssetDialog'
import type { GetAssetsQuery } from '../model/asset.types'

const LIST_PAGE_SIZE = 50
const MAP_ASSET_LIMIT = 5000

export function AssetDashboard() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(selectAssetsQuery)
  const { committedAreaBounds, listPage, listSort, selectedAssetId } = useAppSelector(
    (state) => state.assetUi,
  )
  const listQuery = useMemo<GetAssetsQuery>(
    () => ({
      ...query,
      limit: LIST_PAGE_SIZE,
      offset: (listPage - 1) * LIST_PAGE_SIZE,
      sort: listSort,
    }),
    [listPage, listSort, query],
  )
  const mapQuery = useMemo<GetAssetsQuery>(
    () => ({
      ...query,
      limit: MAP_ASSET_LIMIT,
      offset: 0,
      sort: 'status',
    }),
    [query],
  )
  const allAssetsQuery = useMemo<GetAssetsQuery>(
    () => ({
      limit: MAP_ASSET_LIMIT,
      offset: 0,
      sort: 'status',
    }),
    [],
  )
  const { data: listResult, isLoading } = useGetAssetsQuery(listQuery)
  const { data: mapResult } = useGetAssetsQuery(mapQuery)
  const { data: allAssetsResult } = useGetAssetsQuery(allAssetsQuery)
  const assets = listResult?.items ?? []
  const mapAssets = mapResult?.items ?? assets
  const allAssets = allAssetsResult?.items ?? []
  const totalFilteredAssets = listResult?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalFilteredAssets / LIST_PAGE_SIZE))
  const currentPage = Math.min(listPage, totalPages)

  useEffect(() => {
    if (listPage > totalPages) {
      dispatch(setListPage(totalPages))
    }
  }, [dispatch, listPage, totalPages])

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
      isAreaFilterActive={Boolean(committedAreaBounds)}
      isLoading={isLoading}
      map={
        <AssetMap
          assets={mapAssets}
          isAreaFilterActive={Boolean(committedAreaBounds)}
          selectedAssetId={selectedAssetId}
        />
      }
      okCount={okCount}
      onCreateAsset={() => dispatch(openCreateForm())}
      onListPageChange={(page) => dispatch(setListPage(page))}
      onListSortChange={(sort) => dispatch(setListSort(sort))}
      onSelectAsset={(assetId) => dispatch(selectAsset(assetId))}
      page={currentPage}
      pageSize={LIST_PAGE_SIZE}
      selectedAssetId={selectedAssetId}
      sort={listSort}
      totalCount={allAssets.length}
      totalFilteredAssets={totalFilteredAssets}
      totalPages={totalPages}
      warningCount={warningCount}
    />
  )
}
