import type { ReactNode } from 'react'
import { Button } from '../../../shared/components/Button'
import { AssetList } from './AssetList'
import type { Asset, AssetListSort } from '../model/asset.types'

type AssetDashboardViewProps = {
  assets: Asset[]
  criticalCount: number
  deleteDialog: ReactNode
  detailDrawer: ReactNode
  filters: ReactNode
  formDialog: ReactNode
  isAreaFilterActive: boolean
  isLoading: boolean
  map: ReactNode
  okCount: number
  onCreateAsset: () => void
  onListPageChange: (page: number) => void
  onListSortChange: (sort: AssetListSort) => void
  onSelectAsset: (assetId: string) => void
  page: number
  pageSize: number
  selectedAssetId: string | null
  sort: AssetListSort
  totalCount: number
  totalFilteredAssets: number
  totalPages: number
  warningCount: number
}

export function AssetDashboardView({
  assets,
  criticalCount,
  deleteDialog,
  detailDrawer,
  filters,
  formDialog,
  isAreaFilterActive,
  isLoading,
  map,
  okCount,
  onCreateAsset,
  onListPageChange,
  onListSortChange,
  onSelectAsset,
  page,
  pageSize,
  selectedAssetId,
  sort,
  totalCount,
  totalFilteredAssets,
  totalPages,
  warningCount,
}: AssetDashboardViewProps) {
  return (
    <main className="h-screen overflow-hidden bg-background text-on-surface">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-headline-md text-2xl font-bold text-primary">
              AssetMap
            </h1>
            <p className="text-xs font-semibold text-on-surface-variant">
              Infrastructure asset tracking
            </p>
          </div>
          <div className="hidden items-center gap-4 text-xs md:flex">
            <span>Total: {totalCount}</span>
            <span>OK: {okCount}</span>
            <span>Warning: {warningCount}</span>
            <span>Critical: {criticalCount}</span>
          </div>
          <Button onClick={onCreateAsset} variant="primary">
            New Asset
          </Button>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="z-10 flex w-[400px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
            {filters}
            <AssetList
              assets={assets}
              isAreaFilterActive={isAreaFilterActive}
              onPageChange={onListPageChange}
              onSelectAsset={onSelectAsset}
              onSortChange={onListSortChange}
              page={page}
              pageSize={pageSize}
              selectedAssetId={selectedAssetId}
              sort={sort}
              totalAssets={totalFilteredAssets}
              totalPages={totalPages}
            />
          </aside>

          <section className="flex min-w-0 flex-1">
            {isLoading ? (
              <div className="grid flex-1 place-items-center text-sm text-on-surface-variant">
                Loading assets...
              </div>
            ) : (
              map
            )}
            {detailDrawer}
          </section>
        </div>

        {formDialog}
        {deleteDialog}
      </div>
    </main>
  )
}
