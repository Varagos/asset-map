import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { areBBoxesEqual } from '../../../shared/utils/bbox'
import type {
  AssetStatus,
  AssetListSort,
  AssetType,
  BBox,
  GetAssetsQuery,
} from '../model/asset.types'

export type AssetUiState = {
  type: AssetType | 'all'
  status: AssetStatus | 'all'
  listPage: number
  listSort: AssetListSort
  selectedAssetId: string | null
  formMode: 'create' | 'edit' | null
  editingAssetId: string | null
  deletingAssetId: string | null
  committedAreaBounds: BBox | null
  draftMapBounds: BBox | null
  hasUnappliedMapBoundsChange: boolean
}

const initialState: AssetUiState = {
  type: 'all',
  status: 'all',
  listPage: 1,
  listSort: 'status',
  selectedAssetId: null,
  formMode: null,
  editingAssetId: null,
  deletingAssetId: null,
  committedAreaBounds: null,
  draftMapBounds: null,
  hasUnappliedMapBoundsChange: false,
}

export const assetUiSlice = createSlice({
  name: 'assetUi',
  initialState,
  reducers: {
    setType(state, action: PayloadAction<AssetType | 'all'>) {
      state.type = action.payload
      state.listPage = 1
    },
    setStatus(state, action: PayloadAction<AssetStatus | 'all'>) {
      state.status = action.payload
      state.listPage = 1
    },
    setListPage(state, action: PayloadAction<number>) {
      state.listPage = Math.max(1, action.payload)
    },
    setListSort(state, action: PayloadAction<AssetListSort>) {
      state.listSort = action.payload
      state.listPage = 1
    },
    selectAsset(state, action: PayloadAction<string | null>) {
      state.selectedAssetId = action.payload
    },
    openCreateForm(state) {
      state.formMode = 'create'
      state.editingAssetId = null
    },
    openEditForm(state, action: PayloadAction<string>) {
      state.formMode = 'edit'
      state.editingAssetId = action.payload
    },
    closeForm(state) {
      state.formMode = null
      state.editingAssetId = null
    },
    openDeleteDialog(state, action: PayloadAction<string>) {
      state.deletingAssetId = action.payload
    },
    closeDeleteDialog(state) {
      state.deletingAssetId = null
    },
    setDraftMapBounds(state, action: PayloadAction<BBox>) {
      state.draftMapBounds = action.payload
    },
    markMapBoundsChanged(state, action: PayloadAction<BBox>) {
      state.draftMapBounds = action.payload
      state.hasUnappliedMapBoundsChange = !areBBoxesEqual(
        state.committedAreaBounds,
        action.payload,
      )
    },
    applyAreaFilter(state) {
      if (state.draftMapBounds) {
        state.committedAreaBounds = state.draftMapBounds
        state.hasUnappliedMapBoundsChange = false
        state.listPage = 1
      }
    },
    clearAreaFilter(state) {
      state.committedAreaBounds = null
      state.hasUnappliedMapBoundsChange = false
      state.listPage = 1
    },
  },
})

export const {
  applyAreaFilter,
  clearAreaFilter,
  closeDeleteDialog,
  closeForm,
  markMapBoundsChanged,
  openCreateForm,
  openDeleteDialog,
  openEditForm,
  selectAsset,
  setDraftMapBounds,
  setListPage,
  setListSort,
  setStatus,
  setType,
} = assetUiSlice.actions

export const assetUiReducer = assetUiSlice.reducer

const selectAssetUi = (state: { assetUi: AssetUiState }) => state.assetUi

export const selectAssetsQuery = createSelector(
  [selectAssetUi],
  (assetUi): GetAssetsQuery => ({
    type: assetUi.type === 'all' ? undefined : assetUi.type,
    status: assetUi.status === 'all' ? undefined : assetUi.status,
    bbox: assetUi.committedAreaBounds ?? undefined,
  }),
)
