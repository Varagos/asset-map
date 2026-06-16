import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { Drawer } from '../../../shared/components/Drawer'
import { formatCoordinates, formatDate } from '../../../shared/utils/dates'
import type { Asset } from '../model/asset.types'

type AssetDetailDrawerViewProps = {
  asset: Asset | undefined
  onClose: () => void
  onDeleteAsset: (assetId: string) => void
  onEditAsset: (assetId: string) => void
  open: boolean
}

export function AssetDetailDrawerView({
  asset,
  onClose,
  onDeleteAsset,
  onEditAsset,
  open,
}: AssetDetailDrawerViewProps) {
  return (
    <Drawer
      actions={
        asset ? (
          <>
            <Button onClick={() => onEditAsset(asset.id)}>Edit</Button>
            <Button onClick={() => onDeleteAsset(asset.id)} variant="danger">
              Delete
            </Button>
          </>
        ) : null
      }
      onClose={onClose}
      open={open}
      title={asset?.name ?? 'Asset details'}
    >
      {asset ? (
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-on-surface-variant">Status</dt>
            <dd>
              <Badge tone={asset.status}>{asset.status}</Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-on-surface-variant">Type</dt>
            <dd className="capitalize">{asset.type}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Coordinates</dt>
            <dd className="font-code-sm">
              {formatCoordinates(asset.lat, asset.lng)}
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Installed</dt>
            <dd>{formatDate(asset.installed_at)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Last inspected</dt>
            <dd>{formatDate(asset.last_inspected_at)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap">
              {asset.notes || 'No notes'}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-on-surface-variant">Asset not found.</p>
      )}
    </Drawer>
  )
}
