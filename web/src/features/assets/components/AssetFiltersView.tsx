import { Button } from '../../../shared/components/Button'
import { ASSET_STATUSES, ASSET_TYPES } from '../model/asset.types'
import type { AssetStatus, AssetType } from '../model/asset.types'

type AssetFiltersViewProps = {
  hasUnappliedMapBoundsChange: boolean
  limitToVisibleMapArea: boolean
  onLimitToVisibleMapAreaChange: (enabled: boolean) => void
  onRefreshMapArea: () => void
  onSearchChange: (search: string) => void
  onStatusChange: (status: AssetStatus | 'all') => void
  onTypeChange: (type: AssetType | 'all') => void
  search: string
  status: AssetStatus | 'all'
  type: AssetType | 'all'
}

export function AssetFiltersView({
  hasUnappliedMapBoundsChange,
  limitToVisibleMapArea,
  onLimitToVisibleMapAreaChange,
  onRefreshMapArea,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  search,
  status,
  type,
}: AssetFiltersViewProps) {
  return (
    <section className="space-y-4 p-4">
      <label className="grid gap-1 text-sm font-medium text-on-surface">
        Search
        <input
          className="rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search assets..."
          type="search"
          value={search}
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-on-surface">
        Type
        <select
          className="rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm capitalize"
          onChange={(event) =>
            onTypeChange(event.target.value as AssetType | 'all')
          }
          value={type}
        >
          <option value="all">All</option>
          {ASSET_TYPES.map((assetType) => (
            <option key={assetType} value={assetType}>
              {assetType}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-on-surface">
        Status
        <select
          className="rounded-default border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm capitalize"
          onChange={(event) =>
            onStatusChange(event.target.value as AssetStatus | 'all')
          }
          value={status}
        >
          <option value="all">All</option>
          {ASSET_STATUSES.map((assetStatus) => (
            <option key={assetStatus} value={assetStatus}>
              {assetStatus}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-3">
        <h2 className="mb-2 text-sm font-semibold text-on-surface">Map Area</h2>
        <label className="flex items-start gap-2 text-sm text-on-surface">
          <input
            checked={limitToVisibleMapArea}
            className="mt-1"
            onChange={(event) =>
              onLimitToVisibleMapAreaChange(event.target.checked)
            }
            type="checkbox"
          />
          <span>Limit results to visible map area</span>
        </label>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-on-surface-variant">
            {hasUnappliedMapBoundsChange
              ? 'Map area changed.'
              : 'Current map area'}
          </span>
          <Button disabled={!limitToVisibleMapArea} onClick={onRefreshMapArea}>
            Refresh map area
          </Button>
        </div>
      </div>
    </section>
  )
}
