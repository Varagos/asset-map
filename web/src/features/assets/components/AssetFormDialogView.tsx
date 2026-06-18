import type { BaseSyntheticEvent } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  LocateFixed,
  MapPin,
  PencilLine,
  Save,
  X,
} from 'lucide-react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ASSET_STATUSES, ASSET_TYPES } from '../model/asset.types'
import { AssetLocationPicker } from './AssetLocationPicker'
import type { AssetFormInput } from '../model/asset.schema'

type AssetFormDialogViewProps = {
  assetName?: string
  errors: FieldErrors<AssetFormInput>
  isEditMode: boolean
  isOpen: boolean
  isSaving: boolean
  lat: number
  lng: number
  onCancel: () => void
  onLocationChange: (lat: number, lng: number) => void
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  onUseCurrentLocation: () => void
  register: UseFormRegister<AssetFormInput>
}

function formatOptionLabel(value: string): string {
  if (value === 'ok') {
    return 'OK'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function fieldError(message: string | undefined) {
  return message ? <span className="text-xs text-error">{message}</span> : null
}

export function AssetFormDialogView({
  assetName,
  errors,
  isEditMode,
  isOpen,
  isSaving,
  lat,
  lng,
  onCancel,
  onLocationChange,
  onSubmit,
  onUseCurrentLocation,
  register,
}: AssetFormDialogViewProps) {
  if (!isOpen) {
    return null
  }

  const title = isEditMode
    ? `Edit Asset${assetName ? `: ${assetName}` : ''}`
    : 'New Asset'

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-primary/40 p-md backdrop-blur-sm">
      <section className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-xl border border-outline-variant bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <header className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-outline-variant bg-surface-container-lowest p-lg">
          <div className="flex min-w-0 items-center gap-sm">
            <PencilLine className="h-7 w-7 shrink-0 fill-primary/10 text-primary" />
            <h2 className="truncate font-headline-md text-2xl font-semibold text-primary">
              {title}
            </h2>
          </div>
          <button
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onCancel}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-lg">
          <form
            className="space-y-lg"
            id="asset-form"
            onSubmit={(event) => void onSubmit(event)}
          >
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <label className="space-y-xs">
                <span className="block text-xs font-semibold text-on-surface-variant">
                  Asset Name
                </span>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-sm text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter asset name"
                  type="text"
                  {...register('name')}
                />
                {fieldError(errors.name?.message)}
              </label>

              <label className="space-y-xs">
                <span className="block text-xs font-semibold text-on-surface-variant">
                  Asset Type
                </span>
                <span className="relative block">
                  <select
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm pr-10 text-sm capitalize text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register('type')}
                  >
                    {ASSET_TYPES.map((assetType) => (
                      <option key={assetType} value={assetType}>
                        {formatOptionLabel(assetType)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-md top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              <label className="space-y-xs">
                <span className="block text-xs font-semibold text-on-surface-variant">
                  Status
                </span>
                <span className="relative block">
                  <select
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm pl-10 pr-10 text-sm capitalize text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register('status')}
                  >
                    {ASSET_STATUSES.map((assetStatus) => (
                      <option key={assetStatus} value={assetStatus}>
                        {formatOptionLabel(assetStatus)}
                      </option>
                    ))}
                  </select>
                  <AlertTriangle className="pointer-events-none absolute left-md top-1/2 h-4 w-4 -translate-y-1/2 text-on-tertiary-container" />
                  <ChevronDown className="pointer-events-none absolute right-md top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                </span>
              </label>

              <label className="space-y-xs">
                <span className="block text-xs font-semibold text-on-surface-variant">
                  Installed Date
                </span>
                <span className="relative block">
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm pl-10 text-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    type="date"
                    {...register('installed_at')}
                  />
                  <CalendarDays className="pointer-events-none absolute left-md top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                </span>
                {fieldError(errors.installed_at?.message)}
              </label>

              <label className="space-y-xs">
                <span className="block text-xs font-semibold text-on-surface-variant">
                  Last Inspected{' '}
                  <span className="font-normal text-outline">(Optional)</span>
                </span>
                <span className="relative block">
                  <input
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm pl-10 text-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    type="date"
                    {...register('last_inspected_at')}
                  />
                  <CheckSquare className="pointer-events-none absolute left-md top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                </span>
                {fieldError(errors.last_inspected_at?.message)}
              </label>
            </div>

            <section className="space-y-sm rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-xs text-xs font-semibold text-primary">
                  <MapPin className="h-[18px] w-[18px]" />
                  Geographic Location
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
                <div className="flex flex-col justify-center gap-gutter md:col-span-4">
                  <label className="space-y-xs">
                    <span className="block text-xs font-semibold text-on-surface-variant">
                      Latitude
                    </span>
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-md py-sm font-code-sm text-xs text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. 34.0522"
                      step="any"
                      type="number"
                      {...register('lat', { valueAsNumber: true })}
                    />
                    {fieldError(errors.lat?.message)}
                  </label>

                  <label className="space-y-xs">
                    <span className="block text-xs font-semibold text-on-surface-variant">
                      Longitude
                    </span>
                    <input
                      className="w-full rounded-lg border border-outline-variant bg-surface px-md py-sm font-code-sm text-xs text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. -118.2437"
                      step="any"
                      type="number"
                      {...register('lng', { valueAsNumber: true })}
                    />
                    {fieldError(errors.lng?.message)}
                  </label>

                  <button
                    className="mt-sm flex items-center justify-center gap-xs rounded border border-primary px-md py-sm text-xs font-semibold text-primary transition-colors hover:bg-primary-fixed"
                    onClick={onUseCurrentLocation}
                    type="button"
                  >
                    <LocateFixed className="h-4 w-4" />
                    Use Current Location
                  </button>
                </div>

                <AssetLocationPicker
                  lat={lat}
                  lng={lng}
                  onLocationChange={onLocationChange}
                />
              </div>
            </section>

            <label className="space-y-xs">
              <span className="block text-xs font-semibold text-on-surface-variant">
                Maintenance Notes
              </span>
              <textarea
                className="min-h-24 w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-sm text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter any specific maintenance observations or history here..."
                rows={3}
                {...register('notes')}
              />
            </label>
          </form>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-sm rounded-b-xl border-t border-outline-variant bg-surface-container-lowest p-lg">
          <button
            className="rounded border border-outline bg-surface px-lg py-[10px] text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex items-center gap-xs rounded border border-primary bg-primary px-lg py-[10px] text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            form="asset-form"
            type="submit"
          >
            <Save className="h-[18px] w-[18px]" />
            {isSaving ? 'Saving...' : 'Save Asset'}
          </button>
        </footer>
      </section>
    </div>
  )
}
