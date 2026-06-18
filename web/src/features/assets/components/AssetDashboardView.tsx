import type { ReactNode } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers3,
  Plus,
} from 'lucide-react'
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
  const stats = [
    {
      label: 'Total',
      value: totalCount,
      icon: Database,
      className: 'border-outline-variant bg-surface-container-lowest text-primary',
    },
    {
      label: 'OK',
      value: okCount,
      icon: CheckCircle2,
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700',
    },
    {
      label: 'Warning',
      value: warningCount,
      icon: AlertTriangle,
      className: 'border-amber-500/25 bg-amber-500/10 text-amber-700',
    },
    {
      label: 'Critical',
      value: criticalCount,
      icon: Layers3,
      className: 'border-error/25 bg-error/10 text-error',
    },
  ]

  return (
    <main className="h-screen overflow-hidden bg-background text-on-surface">
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-md border-b border-outline-variant bg-surface px-4 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-on-primary shadow-sm">
              <Layers3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-headline-md text-xl font-bold text-primary">
                AssetMap
              </h1>
              <p className="truncate text-xs font-medium text-on-surface-variant">
                Infrastructure asset tracking
              </p>
            </div>
          </div>

          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  className={[
                    'flex min-h-10 items-center gap-2 rounded-md border px-3 shadow-sm',
                    stat.className,
                  ].join(' ')}
                  key={stat.label}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                      {stat.label}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {stat.value}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>

          <Button
            className="shrink-0 px-3"
            onClick={onCreateAsset}
            variant="primary"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
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
