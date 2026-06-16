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
import type { Asset, AssetStatus } from '../model/asset.types'

const LIST_PAGE_SIZE = 50

const statusRank: Record<AssetStatus, number> = {
  critical: 0,
  warning: 1,
  ok: 2,
}

function sortAssets(assets: readonly Asset[], sort: 'status' | 'name'): Asset[] {
  return [...assets].sort((left, right) => {
    if (sort === 'name') {
      return left.name.localeCompare(right.name)
    }

    const statusComparison = statusRank[left.status] - statusRank[right.status]

    return statusComparison || left.name.localeCompare(right.name)
  })
}

export function AssetDashboard() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(selectAssetsQuery)
  const { committedAreaBounds, listPage, listSort, selectedAssetId } = useAppSelector(
    (state) => state.assetUi,
  )
  const { data: assets = [], isLoading } = useGetAssetsQuery(query)
  const { data: allAssets = [] } = useGetAssetsQuery()
  const sortedAssets = useMemo(
    () => sortAssets(assets, listSort),
    [assets, listSort],
  )
  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / LIST_PAGE_SIZE))
  const currentPage = Math.min(listPage, totalPages)
  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * LIST_PAGE_SIZE,
    currentPage * LIST_PAGE_SIZE,
  )

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
      assets={paginatedAssets}
      criticalCount={criticalCount}
      deleteDialog={<DeleteAssetDialog />}
      detailDrawer={<AssetDetailDrawer />}
      filters={<AssetFilters />}
      formDialog={<AssetFormDialog />}
      isAreaFilterActive={Boolean(committedAreaBounds)}
      isLoading={isLoading}
      map={
        <AssetMap
          assets={assets}
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
      totalFilteredAssets={sortedAssets.length}
      totalPages={totalPages}
      warningCount={warningCount}
    />
  )
}
