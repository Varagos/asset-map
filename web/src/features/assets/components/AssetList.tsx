import { Badge } from '../../../shared/components/Badge'
import { formatCoordinates, formatDate } from '../../../shared/utils/dates'
import type { Asset } from '../model/asset.types'

type AssetListProps = {
  assets: Asset[]
  isLimitedToVisibleMapArea: boolean
  onSelectAsset: (assetId: string) => void
  selectedAssetId: string | null
}

export function AssetList({
  assets,
  isLimitedToVisibleMapArea,
  onSelectAsset,
  selectedAssetId,
}: AssetListProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col border-t border-outline-variant">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-on-surface">
          {isLimitedToVisibleMapArea ? 'Assets in visible map area' : 'Assets'}
        </h2>
        <p className="text-xs text-on-surface-variant">
          Showing {assets.length} asset{assets.length === 1 ? '' : 's'}
          {isLimitedToVisibleMapArea ? ' in this map area' : ''}
        </p>
      </div>

      {assets.length === 0 ? (
        <p className="px-4 py-6 text-sm text-on-surface-variant">
          {isLimitedToVisibleMapArea
            ? 'No assets found in this map area. Try zooming out or clearing filters.'
            : 'No assets found. Try clearing filters.'}
        </p>
      ) : (
        <ul className="min-h-0 flex-1 overflow-auto">
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId

            return (
              <li key={asset.id}>
                <button
                  className={[
                    'grid w-full gap-1 border-t border-outline-variant px-4 py-3 text-left hover:bg-surface-container-low',
                    isSelected ? 'bg-secondary-container' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectAsset(asset.id)}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-on-surface">
                      {asset.name}
                    </span>
                    <Badge tone={asset.status}>{asset.status}</Badge>
                  </span>
                  <span className="text-xs capitalize text-on-surface-variant">
                    {asset.type} - {formatDate(asset.last_inspected_at)}
                  </span>
                  <span className="font-code-sm text-xs text-on-surface-variant">
                    {formatCoordinates(asset.lat, asset.lng)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
