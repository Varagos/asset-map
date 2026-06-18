import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  useGetAssetsQuery,
  useGetAssetsSummaryQuery,
} from '../api/assetsApi'
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
  const { data: listResult, isLoading } = useGetAssetsQuery(listQuery)
  const { data: mapResult } = useGetAssetsQuery(mapQuery)
  const { data: summary } = useGetAssetsSummaryQuery()
  const assets = listResult?.items ?? []
  const mapAssets = mapResult?.items ?? assets
  const totalFilteredAssets = listResult?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalFilteredAssets / LIST_PAGE_SIZE))
  const currentPage = Math.min(listPage, totalPages)

  useEffect(() => {
    if (listPage > totalPages) {
      dispatch(setListPage(totalPages))
    }
  }, [dispatch, listPage, totalPages])

  return (
    <AssetDashboardView
      assets={assets}
      criticalCount={summary?.critical ?? 0}
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
      okCount={summary?.ok ?? 0}
      onCreateAsset={() => dispatch(openCreateForm())}
      onListPageChange={(page) => dispatch(setListPage(page))}
      onListSortChange={(sort) => dispatch(setListSort(sort))}
      onSelectAsset={(assetId) => dispatch(selectAsset(assetId))}
      page={currentPage}
      pageSize={LIST_PAGE_SIZE}
      selectedAssetId={selectedAssetId}
      sort={listSort}
      totalCount={summary?.total ?? 0}
      totalFilteredAssets={totalFilteredAssets}
      totalPages={totalPages}
      warningCount={summary?.warning ?? 0}
    />
  )
}
