import type { BaseSyntheticEvent } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Button } from '../../../shared/components/Button'
import { Dialog } from '../../../shared/components/Dialog'
import { ASSET_STATUSES, ASSET_TYPES } from '../model/asset.types'
import type { AssetFormInput } from '../model/asset.schema'

type AssetFormDialogViewProps = {
  errors: FieldErrors<AssetFormInput>
  isEditMode: boolean
  isOpen: boolean
  isSaving: boolean
  onCancel: () => void
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  register: UseFormRegister<AssetFormInput>
}

export function AssetFormDialogView({
  errors,
  isEditMode,
  isOpen,
  isSaving,
  onCancel,
  onSubmit,
  register,
}: AssetFormDialogViewProps) {
  return (
    <Dialog
      actions={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            disabled={isSaving}
            form="asset-form"
            type="submit"
            variant="primary"
          >
            {isSaving ? 'Saving...' : 'Save asset'}
          </Button>
        </>
      }
      open={isOpen}
      title={isEditMode ? 'Edit asset' : 'New asset'}
    >
      <form
        className="grid gap-4"
        id="asset-form"
        onSubmit={(event) => void onSubmit(event)}
      >
        <label className="grid gap-1 text-sm font-medium">
          Name
          <input
            className="rounded-default border border-outline-variant px-3 py-2"
            {...register('name')}
          />
          {errors.name ? (
            <span className="text-xs text-error">{errors.name.message}</span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Type
            <select
              className="rounded-default border border-outline-variant px-3 py-2 capitalize"
              {...register('type')}
            >
              {ASSET_TYPES.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium">
            Status
            <select
              className="rounded-default border border-outline-variant px-3 py-2 capitalize"
              {...register('status')}
            >
              {ASSET_STATUSES.map((assetStatus) => (
                <option key={assetStatus} value={assetStatus}>
                  {assetStatus}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Latitude
            <input
              className="rounded-default border border-outline-variant px-3 py-2"
              step="0.000001"
              type="number"
              {...register('lat', { valueAsNumber: true })}
            />
            {errors.lat ? (
              <span className="text-xs text-error">{errors.lat.message}</span>
            ) : null}
          </label>

          <label className="grid gap-1 text-sm font-medium">
            Longitude
            <input
              className="rounded-default border border-outline-variant px-3 py-2"
              step="0.000001"
              type="number"
              {...register('lng', { valueAsNumber: true })}
            />
            {errors.lng ? (
              <span className="text-xs text-error">{errors.lng.message}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Installed date
            <input
              className="rounded-default border border-outline-variant px-3 py-2"
              type="date"
              {...register('installed_at')}
            />
            {errors.installed_at ? (
              <span className="text-xs text-error">
                {errors.installed_at.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-1 text-sm font-medium">
            Last inspected date
            <input
              className="rounded-default border border-outline-variant px-3 py-2"
              type="date"
              {...register('last_inspected_at')}
            />
            {errors.last_inspected_at ? (
              <span className="text-xs text-error">
                {errors.last_inspected_at.message}
              </span>
            ) : null}
          </label>
        </div>

        <label className="grid gap-1 text-sm font-medium">
          Notes
          <textarea
            className="min-h-24 rounded-default border border-outline-variant px-3 py-2"
            {...register('notes')}
          />
        </label>
      </form>
    </Dialog>
  )
}
