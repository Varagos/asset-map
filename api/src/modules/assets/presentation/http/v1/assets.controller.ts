import { Router } from 'express'
import { asyncHandler } from '../../../../../shared/http/async-handler'
import { RequestValidationError } from '../../../../../shared/http/request-validation-error'
import {
  assetBodySchema,
  assetIdParamsSchema,
  listAssetsQuerySchema,
  updateAssetBodySchema,
} from './assets.http-schemas'
import type { AssetsApplication } from '../../../application/assets.application'
import type { SafeParseReturnType } from 'zod'

type SafeParseSchema<TOutput> = {
  safeParse(input: unknown): SafeParseReturnType<unknown, TOutput>
}

function parseOrThrow<TOutput>(
  schema: SafeParseSchema<TOutput>,
  input: unknown,
): TOutput {
  const result = schema.safeParse(input)

  if (!result.success) {
    throw new RequestValidationError(result.error.issues)
  }

  return result.data
}

export function createAssetsRouter(application: AssetsApplication): Router {
  const router = Router()

  router.get(
    '/',
    asyncHandler(async (request, response) => {
      const query = parseOrThrow(listAssetsQuerySchema, request.query)
      const result = await application.listAssets.execute(query)

      response.json(result)
    }),
  )

  router.get(
    '/:id',
    asyncHandler(async (request, response) => {
      const { id } = parseOrThrow(assetIdParamsSchema, request.params)
      const result = await application.getAssetById.execute(id)

      response.json(result)
    }),
  )

  router.post(
    '/',
    asyncHandler(async (request, response) => {
      const body = parseOrThrow(assetBodySchema, request.body)
      const result = await application.createAsset.execute(body)

      response.status(201).json(result)
    }),
  )

  router.patch(
    '/:id',
    asyncHandler(async (request, response) => {
      const { id } = parseOrThrow(assetIdParamsSchema, request.params)
      const changes = parseOrThrow(updateAssetBodySchema, request.body)
      const result = await application.updateAsset.execute({ id, changes })

      response.json(result)
    }),
  )

  router.delete(
    '/:id',
    asyncHandler(async (request, response) => {
      const { id } = parseOrThrow(assetIdParamsSchema, request.params)

      await application.deleteAsset.execute(id)
      response.status(204).send()
    }),
  )

  return router
}
