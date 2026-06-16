import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { cloneMockAssets, filterAssets } from './mockAssets'
import type {
  Asset,
  CreateAssetInput,
  GetAssetsQuery,
  UpdateAssetInput,
} from '../model/asset.types'

type MockApiError = {
  status: number
  message: string
}

let assets = cloneMockAssets()

function createAssetId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `asset-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function notFound(id: string): MockApiError {
  return {
    status: 404,
    message: `Asset ${id} was not found`,
  }
}

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: fakeBaseQuery<MockApiError>(),
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    getAssets: builder.query<Asset[], GetAssetsQuery | void>({
      queryFn: (query) => ({
        data: filterAssets(assets, query ?? {}),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Asset', id: 'LIST' },
              ...result.map((asset) => ({
                type: 'Asset' as const,
                id: asset.id,
              })),
            ]
          : [{ type: 'Asset', id: 'LIST' }],
    }),
    getAssetById: builder.query<Asset, string>({
      queryFn: (id) => {
        const asset = assets.find((item) => item.id === id)

        return asset ? { data: asset } : { error: notFound(id) }
      },
      providesTags: (_result, _error, id) => [{ type: 'Asset', id }],
    }),
    createAsset: builder.mutation<Asset, CreateAssetInput>({
      queryFn: (input) => {
        const asset = {
          ...input,
          id: createAssetId(),
        }

        assets = [asset, ...assets]

        return { data: asset }
      },
      invalidatesTags: [{ type: 'Asset', id: 'LIST' }],
    }),
    updateAsset: builder.mutation<Asset, UpdateAssetInput>({
      queryFn: ({ id, changes }) => {
        const assetIndex = assets.findIndex((asset) => asset.id === id)

        if (assetIndex === -1) {
          return { error: notFound(id) }
        }

        const updatedAsset = {
          ...assets[assetIndex],
          ...changes,
          id,
        }

        assets = assets.map((asset) => (asset.id === id ? updatedAsset : asset))

        return { data: updatedAsset }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
      ],
    }),
    deleteAsset: builder.mutation<{ id: string }, string>({
      queryFn: (id) => {
        const assetExists = assets.some((asset) => asset.id === id)

        if (!assetExists) {
          return { error: notFound(id) }
        }

        assets = assets.filter((asset) => asset.id !== id)

        return { data: { id } }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useGetAssetByIdQuery,
  useGetAssetsQuery,
  useUpdateAssetMutation,
} = assetsApi
