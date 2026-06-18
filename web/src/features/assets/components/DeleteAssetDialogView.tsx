import {
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '../../../shared/components/Button'

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
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-primary/40 p-md backdrop-blur-sm">
      <section
        aria-labelledby="delete-asset-title"
        aria-modal="true"
        className="w-full max-w-[34rem] overflow-hidden rounded-lg border border-error/25 bg-surface shadow-[0_18px_50px_rgba(15,23,42,0.22)]"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-md border-b border-outline-variant bg-error-container/50 p-lg">
          <div className="flex min-w-0 gap-md">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-error text-on-error shadow-sm">
              <AlertTriangle aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2
                className="font-headline-sm text-xl font-semibold text-on-error-container"
                id="delete-asset-title"
              >
                Delete asset?
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <button
            aria-label="Close delete confirmation"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-on-surface-variant transition-colors hover:bg-surface/70 focus:outline-none focus:ring-2 focus:ring-error/30"
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-md p-lg">
          <div className="rounded-md border border-outline-variant bg-surface-container-lowest p-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Asset
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-on-surface">
              {assetName ?? 'Loading asset...'}
            </p>
          </div>
          <p className="text-sm leading-6 text-on-surface-variant">
            Removing this asset will delete it from the list and map for
            everyone using this workspace.
          </p>
        </div>

        <footer className="flex items-center justify-end gap-sm border-t border-outline-variant bg-surface-container-lowest p-lg">
          <Button
            className="min-w-24"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="min-w-36"
            disabled={isDeleting || !assetName}
            onClick={onConfirmDelete}
            variant="danger"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Asset'}
          </Button>
        </footer>
      </section>
    </div>
  )
}
