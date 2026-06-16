import { z } from 'zod'
import { ASSET_STATUSES, ASSET_TYPES } from './asset.types'
import type { Asset, CreateAssetInput } from './asset.types'

const validDateString = z.string().refine((value) => {
  if (!value.trim()) {
    return false
  }

  return !Number.isNaN(Date.parse(value))
}, 'Enter a valid date')

const optionalDateString = z.union([validDateString, z.literal(''), z.null()])

export const assetFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  type: z.enum(ASSET_TYPES),
  status: z.enum(ASSET_STATUSES),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  installed_at: validDateString,
  last_inspected_at: optionalDateString,
  notes: z.string(),
})

export type AssetFormInput = z.input<typeof assetFormSchema>
export type AssetFormValues = z.output<typeof assetFormSchema>

export function toCreateAssetInput(values: AssetFormValues): CreateAssetInput {
  return {
    name: values.name.trim(),
    type: values.type,
    status: values.status,
    lat: values.lat,
    lng: values.lng,
    installed_at: values.installed_at,
    last_inspected_at: values.last_inspected_at || null,
    notes: values.notes,
  }
}

export function assetToFormValues(asset: Asset): AssetFormInput {
  return {
    name: asset.name,
    type: asset.type,
    status: asset.status,
    lat: asset.lat,
    lng: asset.lng,
    installed_at: asset.installed_at,
    last_inspected_at: asset.last_inspected_at ?? '',
    notes: asset.notes,
  }
}
