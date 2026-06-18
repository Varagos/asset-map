import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import type {
  Asset,
  AssetsSummary,
  CreateAssetInput,
  DeleteAssetInput,
  GetAssetsQuery,
  GetAssetsResponse,
  UpdateAssetInput,
} from '../model/asset.types'

function toEntityTag(version: number): string {
  return `"${version}"`
}

function toSearchParams(query: GetAssetsQuery = {}) {
  const params = new URLSearchParams()

  if (query.type) {
    params.set('type', query.type)
  }

  if (query.status) {
    params.set('status', query.status)
  }

  if (query.limit !== undefined) {
    params.set('limit', String(query.limit))
  }

  if (query.offset !== undefined) {
    params.set('offset', String(query.offset))
  }

  if (query.sort) {
    params.set('sort', query.sort)
  }

  if (query.bbox) {
    params.set('minLng', String(query.bbox.minLng))
    params.set('minLat', String(query.bbox.minLat))
    params.set('maxLng', String(query.bbox.maxLng))
    params.set('maxLat', String(query.bbox.maxLat))
  }

  return params
}

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  }),
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    getAssets: builder.query<GetAssetsResponse, GetAssetsQuery | void>({
      query: (query) => {
        const params = toSearchParams(query ?? {})

        return {
          url: `assets${params.size > 0 ? `?${params.toString()}` : ''}`,
        }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Asset', id: 'LIST' },
              ...result.items.map((asset) => ({
                type: 'Asset' as const,
                id: asset.id,
              })),
            ]
          : [{ type: 'Asset', id: 'LIST' }],
    }),
    getAssetById: builder.query<Asset, string>({
      query: (id) => `assets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Asset', id }],
    }),
    getAssetsSummary: builder.query<AssetsSummary, void>({
      query: () => 'assets/summary',
      providesTags: [{ type: 'Asset', id: 'SUMMARY' }],
    }),
    createAsset: builder.mutation<Asset, CreateAssetInput>({
      query: (input) => ({
        url: 'assets',
        method: 'POST',
        body: input,
      }),
      invalidatesTags: [
        { type: 'Asset', id: 'LIST' },
        { type: 'Asset', id: 'SUMMARY' },
      ],
    }),
    updateAsset: builder.mutation<Asset, UpdateAssetInput>({
      query: ({ id, version, changes }) => ({
        url: `assets/${id}`,
        method: 'PATCH',
        headers: {
          'If-Match': toEntityTag(version),
        },
        body: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
        { type: 'Asset', id: 'SUMMARY' },
      ],
    }),
    deleteAsset: builder.mutation<void, DeleteAssetInput>({
      query: ({ id, version }) => ({
        url: `assets/${id}`,
        method: 'DELETE',
        headers: {
          'If-Match': toEntityTag(version),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
        { type: 'Asset', id: 'SUMMARY' },
      ],
    }),
  }),
})

export const {
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useGetAssetByIdQuery,
  useGetAssetsQuery,
  useGetAssetsSummaryQuery,
  useUpdateAssetMutation,
} = assetsApi
