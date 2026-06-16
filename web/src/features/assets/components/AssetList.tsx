import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Circle,
  Droplet,
  Gauge,
  MapPin,
  Wrench,
} from 'lucide-react'
import { formatCoordinates, formatDate } from '../../../shared/utils/dates'
import type {
  Asset,
  AssetListSort,
  AssetStatus,
  AssetType,
} from '../model/asset.types'

type AssetListProps = {
  assets: Asset[]
  isAreaFilterActive: boolean
  onPageChange: (page: number) => void
  onSelectAsset: (assetId: string) => void
  onSortChange: (sort: AssetListSort) => void
  page: number
  pageSize: number
  selectedAssetId: string | null
  sort: AssetListSort
  totalAssets: number
  totalPages: number
}

const statusClasses: Record<AssetStatus, string> = {
  ok: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-700',
  critical: 'border-error/20 bg-error/10 text-error',
}

const statusDotClasses: Record<AssetStatus, string> = {
  ok: 'fill-emerald-500 text-emerald-500',
  warning: 'fill-amber-500 text-amber-500',
  critical: 'fill-error text-error',
}

function formatStatus(status: AssetStatus): string {
  return status === 'ok'
    ? 'OK'
    : status.charAt(0).toUpperCase() + status.slice(1)
}

function renderAssetIcon(type: AssetType, isSelected: boolean) {
  const className = isSelected
    ? 'h-[18px] w-[18px] text-primary'
    : 'h-[18px] w-[18px] text-on-surface-variant'

  switch (type) {
    case 'pipe':
      return <Wrench aria-hidden="true" className={className} />
    case 'hydrant':
      return <Droplet aria-hidden="true" className={className} />
    case 'sensor':
      return <Activity aria-hidden="true" className={className} />
    case 'valve':
      return <Gauge aria-hidden="true" className={className} />
  }
}

export function AssetList({
  assets,
  isAreaFilterActive,
  onPageChange,
  onSelectAsset,
  onSortChange,
  page,
  pageSize,
  selectedAssetId,
  sort,
  totalAssets,
  totalPages,
}: AssetListProps) {
  const pageStart = totalAssets === 0 ? 0 : (page - 1) * pageSize + 1
  const pageEnd = Math.min(page * pageSize, totalAssets)
  const showingText =
    totalAssets === 0
      ? `Showing 0 assets${isAreaFilterActive ? ' in this area' : ''}`
      : `Showing ${
          totalAssets <= pageSize
            ? totalAssets
            : pageStart === pageEnd
              ? pageStart
              : `${pageStart}-${pageEnd} of ${totalAssets}`
        } asset${totalAssets === 1 ? '' : 's'}${
          isAreaFilterActive ? ' in this area' : ''
        }`

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-md py-sm">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-semibold text-on-surface">Assets</h2>
          <p className="text-[11px] text-on-surface-variant">{showingText}</p>
        </div>

        <label className="flex items-center gap-xs">
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Sort by:
          </span>
          <select
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1 text-[12px] text-on-surface focus:border-primary focus:outline-none"
            onChange={(event) =>
              onSortChange(event.target.value as AssetListSort)
            }
            value={sort}
          >
            <option value="status">Status (Critical First)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </label>
      </div>

      {assets.length === 0 ? (
        <p className="flex-1 bg-surface-container-low px-md py-lg text-sm text-on-surface-variant">
          No assets found. Try clearing filters.
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-xs overflow-auto bg-surface-container-low p-sm">
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId

            return (
              <li key={asset.id}>
                <button
                  className={[
                    'relative flex w-full cursor-pointer flex-col gap-xs rounded-lg border p-sm text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-[#f1f5f9] pl-md shadow-sm'
                      : 'border-outline-variant bg-surface hover:bg-surface-container-lowest',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectAsset(asset.id)}
                  type="button"
                >
                  {isSelected ? (
                    <span className="absolute bottom-0 left-0 top-0 w-1 rounded-l-lg bg-primary" />
                  ) : null}
                  <span className="flex items-start justify-between gap-xs">
                    <span className="flex min-w-0 items-center gap-xs">
                      {renderAssetIcon(asset.type, isSelected)}
                      <span
                        className={[
                          'truncate text-[14px] font-semibold leading-tight',
                          isSelected ? 'text-primary' : 'text-on-surface',
                        ].join(' ')}
                      >
                        {asset.name}
                      </span>
                    </span>
                    <span
                      className={[
                        'flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                        statusClasses[asset.status],
                      ].join(' ')}
                    >
                      <Circle
                        aria-hidden="true"
                        className={[
                          'h-1.5 w-1.5',
                          statusDotClasses[asset.status],
                        ].join(' ')}
                      />
                      {formatStatus(asset.status)}
                    </span>
                  </span>
                  <span className="mt-1 flex items-end justify-between gap-xs">
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                        <CalendarDays aria-hidden="true" className="h-3 w-3" />
                        Last: {formatDate(asset.last_inspected_at)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] capitalize text-on-surface-variant">
                        <MapPin aria-hidden="true" className="h-3 w-3" />
                        {asset.type}
                      </span>
                    </span>
                    <span className="font-code-sm text-[10px] text-on-surface-variant/70">
                      {formatCoordinates(asset.lat, asset.lng)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex shrink-0 items-center justify-between border-t border-outline-variant bg-surface p-sm">
        <button
          aria-label="Previous page"
          className="flex items-center justify-center rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <span className="text-[12px] text-on-surface">
          Page {page} of {totalPages}
        </span>
        <button
          aria-label="Next page"
          className="flex items-center justify-center rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
