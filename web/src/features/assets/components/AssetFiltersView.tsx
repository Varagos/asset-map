import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Droplet,
  Gauge,
  Layers3,
  Wrench,
} from 'lucide-react'
import { ASSET_STATUSES, ASSET_TYPES } from '../model/asset.types'
import type { AssetStatus, AssetType } from '../model/asset.types'

type AssetFiltersViewProps = {
  onStatusChange: (status: AssetStatus | 'all') => void
  onTypeChange: (type: AssetType | 'all') => void
  status: AssetStatus | 'all'
  type: AssetType | 'all'
}

const statusClasses: Record<AssetStatus, string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-sm',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700 shadow-sm',
  critical: 'border-error/30 bg-error/10 text-error shadow-sm',
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

function renderTypeIcon(assetType: AssetType | 'all') {
  const className = 'h-3.5 w-3.5 shrink-0'

  switch (assetType) {
    case 'all':
      return <Layers3 aria-hidden="true" className={className} />
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

function renderStatusIcon(assetStatus: AssetStatus | 'all') {
  const className = 'h-3.5 w-3.5 shrink-0'

  switch (assetStatus) {
    case 'all':
      return <Layers3 aria-hidden="true" className={className} />
    case 'ok':
      return <CheckCircle2 aria-hidden="true" className={className} />
    case 'warning':
      return <AlertTriangle aria-hidden="true" className={className} />
    case 'critical':
      return <Circle aria-hidden="true" className={`${className} fill-current`} />
  }
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
        <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
          Type
        </span>
        <div className="flex flex-wrap gap-xs">
          {(['all', ...ASSET_TYPES] as const).map((assetType) => {
            const isSelected = assetType === type

            return (
              <button
                className={[
                  'inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
                  isSelected
                    ? 'border-primary bg-primary text-on-primary shadow-sm'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline hover:bg-surface-container',
                ].join(' ')}
                key={assetType}
                onClick={() => onTypeChange(assetType)}
                type="button"
              >
                {renderTypeIcon(assetType)}
                {formatFilterLabel(assetType)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
          Status
        </span>
        <div className="flex flex-wrap gap-xs">
          <button
            className={[
              'inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
              status === 'all'
                ? 'border-primary bg-primary text-on-primary shadow-sm'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline hover:bg-surface-container',
            ].join(' ')}
            onClick={() => onStatusChange('all')}
            type="button"
          >
            {renderStatusIcon('all')}
            All
          </button>
          {ASSET_STATUSES.map((assetStatus) => {
            const isSelected = assetStatus === status

            return (
              <button
                className={[
                  'inline-flex min-h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20',
                  isSelected
                    ? statusClasses[assetStatus]
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline hover:bg-surface-container',
                ].join(' ')}
                key={assetStatus}
                onClick={() => onStatusChange(assetStatus)}
                type="button"
              >
                {isSelected ? (
                  renderStatusIcon(assetStatus)
                ) : (
                  <Circle
                    aria-hidden="true"
                    className={[
                      'h-1.5 w-1.5',
                      statusDotClasses[assetStatus],
                    ].join(' ')}
                  />
                )}
                {formatFilterLabel(assetStatus)}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
