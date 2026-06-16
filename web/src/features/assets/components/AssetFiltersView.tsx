import { Circle } from 'lucide-react'
import { ASSET_STATUSES, ASSET_TYPES } from '../model/asset.types'
import type { AssetStatus, AssetType } from '../model/asset.types'

type AssetFiltersViewProps = {
  onStatusChange: (status: AssetStatus | 'all') => void
  onTypeChange: (type: AssetType | 'all') => void
  status: AssetStatus | 'all'
  type: AssetType | 'all'
}

const statusClasses: Record<AssetStatus, string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  critical: 'border-error/30 bg-error/10 text-error',
}

const statusDotClasses: Record<AssetStatus, string> = {
  ok: 'fill-emerald-500 text-emerald-500',
  warning: 'fill-amber-500 text-amber-500',
  critical: 'fill-error text-error',
}

function formatFilterLabel(value: string): string {
  if (value === 'ok') {
    return 'OK'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function AssetFiltersView({
  onStatusChange,
  onTypeChange,
  status,
  type,
}: AssetFiltersViewProps) {
  return (
    <section className="flex flex-col gap-md border-b border-outline-variant bg-surface p-md">
      <div className="flex flex-col gap-xs">
        <span className="text-xs font-semibold text-on-surface-variant">
          Type
        </span>
        <div className="flex flex-wrap gap-xs">
          {(['all', ...ASSET_TYPES] as const).map((assetType) => {
            const isSelected = assetType === type

            return (
              <button
                className={[
                  'rounded border px-sm py-xs text-xs font-semibold transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container',
                ].join(' ')}
                key={assetType}
                onClick={() => onTypeChange(assetType)}
                type="button"
              >
                {formatFilterLabel(assetType)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-xs font-semibold text-on-surface-variant">
          Status
        </span>
        <div className="flex flex-wrap gap-xs">
          <button
            className={[
              'rounded border px-sm py-xs text-xs font-semibold transition-colors',
              status === 'all'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container',
            ].join(' ')}
            onClick={() => onStatusChange('all')}
            type="button"
          >
            All
          </button>
          {ASSET_STATUSES.map((assetStatus) => {
            const isSelected = assetStatus === status

            return (
              <button
                className={[
                  'flex items-center gap-1 rounded border px-sm py-xs text-xs font-semibold transition-colors',
                  isSelected
                    ? statusClasses[assetStatus]
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container',
                ].join(' ')}
                key={assetStatus}
                onClick={() => onStatusChange(assetStatus)}
                type="button"
              >
                <Circle
                  aria-hidden="true"
                  className={[
                    'h-1.5 w-1.5',
                    isSelected
                      ? statusDotClasses[assetStatus]
                      : 'fill-outline text-outline',
                  ].join(' ')}
                />
                {formatFilterLabel(assetStatus)}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
