import { Button } from '../../../shared/components/Button'
import { Dialog } from '../../../shared/components/Dialog'

type DeleteAssetDialogViewProps = {
  assetName: string | undefined
  isDeleting: boolean
  onCancel: () => void
  onConfirmDelete: () => void
  open: boolean
}

export function DeleteAssetDialogView({
  assetName,
  isDeleting,
  onCancel,
  onConfirmDelete,
  open,
}: DeleteAssetDialogViewProps) {
  return (
    <Dialog
      actions={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            disabled={isDeleting}
            onClick={onConfirmDelete}
            variant="danger"
          >
            Delete
          </Button>
        </>
      }
      open={open}
      title="Delete asset?"
    >
      <p className="text-sm text-on-surface">
        Delete {assetName ?? 'asset'}? This action cannot be undone.
      </p>
    </Dialog>
  )
}
