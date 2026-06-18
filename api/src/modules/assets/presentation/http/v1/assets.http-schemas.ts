import { z } from 'zod'
import {
  ASSET_LIST_SORTS,
  ASSET_STATUSES,
  ASSET_TYPES,
  type BBox,
} from '../../../domain/asset.types'
import type { CreateAssetInput, UpdateAssetInput } from '../../../domain/asset.types'
import type { ListAssetsCriteria } from '../../../application/ports/assets.repository'

const validDateString = z.string().refine((value) => {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value))
}, 'Enter a valid date')

const optionalDateString = z
  .union([validDateString, z.literal(''), z.null()])
  .transform((value) => (value ? value : null))

const coordinateQuerySchema = {
  minLng: z.coerce.number().finite().min(-180).max(180).optional(),
  minLat: z.coerce.number().finite().min(-90).max(90).optional(),
  maxLng: z.coerce.number().finite().min(-180).max(180).optional(),
  maxLat: z.coerce.number().finite().min(-90).max(90).optional(),
}

function buildBBox(input: {
  minLng?: number | undefined
  minLat?: number | undefined
  maxLng?: number | undefined
  maxLat?: number | undefined
}): BBox | undefined {
  if (
    input.minLng === undefined ||
    input.minLat === undefined ||
    input.maxLng === undefined ||
    input.maxLat === undefined
  ) {
    return undefined
  }

  return {
    minLng: input.minLng,
    minLat: input.minLat,
    maxLng: input.maxLng,
    maxLat: input.maxLat,
  }
}

export const assetIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export const listAssetsQuerySchema = z
  .object({
    type: z.enum(ASSET_TYPES).optional(),
    status: z.enum(ASSET_STATUSES).optional(),
    limit: z.coerce.number().int().min(1).max(5000).default(50),
    offset: z.coerce.number().int().min(0).default(0),
    sort: z.enum(ASSET_LIST_SORTS).default('status'),
    ...coordinateQuerySchema,
  })
  .superRefine((value, context) => {
    const bboxKeys = ['minLng', 'minLat', 'maxLng', 'maxLat'] as const
    const bboxValues = bboxKeys.map((key) => value[key])
    const providedCount = bboxValues.filter((item) => item !== undefined).length

    if (providedCount !== 0 && providedCount !== bboxKeys.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide all bbox params or none of them',
        path: ['bbox'],
      })
    }

    if (
      providedCount === bboxKeys.length &&
      value.minLng !== undefined &&
      value.maxLng !== undefined &&
      value.minLng > value.maxLng
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'minLng must be less than or equal to maxLng',
        path: ['minLng'],
      })
    }

    if (
      providedCount === bboxKeys.length &&
      value.minLat !== undefined &&
      value.maxLat !== undefined &&
      value.minLat > value.maxLat
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'minLat must be less than or equal to maxLat',
        path: ['minLat'],
      })
    }
  })
  .transform((value): ListAssetsCriteria => {
    const criteria: ListAssetsCriteria = {
      limit: value.limit,
      offset: value.offset,
      sort: value.sort,
    }
    const bbox = buildBBox(value)

    if (value.type) {
      criteria.type = value.type
    }

    if (value.status) {
      criteria.status = value.status
    }

    if (bbox) {
      criteria.bbox = bbox
    }

    return criteria
  })

const assetBodyObjectSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(ASSET_TYPES),
  status: z.enum(ASSET_STATUSES),
  lat: z.coerce.number().finite().min(-90).max(90),
  lng: z.coerce.number().finite().min(-180).max(180),
  installed_at: validDateString,
  last_inspected_at: optionalDateString,
  notes: z.string(),
})

export const assetBodySchema: z.ZodType<CreateAssetInput> = assetBodyObjectSchema

export const updateAssetBodySchema: z.ZodType<UpdateAssetInput> =
  assetBodyObjectSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: 'Provide at least one asset field to update',
    })
