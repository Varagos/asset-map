import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { areBBoxesEqual } from '../../../shared/utils/bbox'
import type {
  AssetStatus,
  AssetType,
  BBox,
  GetAssetsQuery,
} from '../model/asset.types'

export type AssetUiState = {
  search: string
  type: AssetType | 'all'
  status: AssetStatus | 'all'
  selectedAssetId: string | null
  formMode: 'create' | 'edit' | null
  editingAssetId: string | null
  deletingAssetId: string | null
  limitToVisibleMapArea: boolean
  committedMapBounds: BBox | null
  draftMapBounds: BBox | null
  hasUnappliedMapBoundsChange: boolean
}

const initialState: AssetUiState = {
  search: '',
  type: 'all',
  status: 'all',
  selectedAssetId: null,
  formMode: null,
  editingAssetId: null,
  deletingAssetId: null,
  limitToVisibleMapArea: false,
  committedMapBounds: null,
  draftMapBounds: null,
  hasUnappliedMapBoundsChange: false,
}

export const assetUiSlice = createSlice({
  name: 'assetUi',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setType(state, action: PayloadAction<AssetType | 'all'>) {
      state.type = action.payload
    },
    setStatus(state, action: PayloadAction<AssetStatus | 'all'>) {
      state.status = action.payload
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
    setLimitToVisibleMapArea(state, action: PayloadAction<boolean>) {
      state.limitToVisibleMapArea = action.payload

      if (!action.payload) {
        state.hasUnappliedMapBoundsChange = false
        return
      }

      if (!state.committedMapBounds && state.draftMapBounds) {
        state.committedMapBounds = state.draftMapBounds
      }
    },
    setDraftMapBounds(state, action: PayloadAction<BBox>) {
      state.draftMapBounds = action.payload

      if (
        state.limitToVisibleMapArea &&
        !areBBoxesEqual(state.committedMapBounds, action.payload)
      ) {
        state.hasUnappliedMapBoundsChange = true
      }
    },
    refreshMapBounds(state) {
      if (state.draftMapBounds) {
        state.committedMapBounds = state.draftMapBounds
      }

      state.hasUnappliedMapBoundsChange = false
    },
    setCommittedMapBounds(state, action: PayloadAction<BBox>) {
      state.committedMapBounds = action.payload
      state.draftMapBounds = action.payload
      state.hasUnappliedMapBoundsChange = false
    },
  },
})

export const {
  closeDeleteDialog,
  closeForm,
  openCreateForm,
  openDeleteDialog,
  openEditForm,
  refreshMapBounds,
  selectAsset,
  setCommittedMapBounds,
  setDraftMapBounds,
  setLimitToVisibleMapArea,
  setSearch,
  setStatus,
  setType,
} = assetUiSlice.actions

export const assetUiReducer = assetUiSlice.reducer

const selectAssetUi = (state: { assetUi: AssetUiState }) => state.assetUi

export const selectAssetsQuery = createSelector(
  [selectAssetUi],
  (assetUi): GetAssetsQuery => ({
    search: assetUi.search || undefined,
    type: assetUi.type === 'all' ? undefined : assetUi.type,
    status: assetUi.status === 'all' ? undefined : assetUi.status,
    bbox:
      assetUi.limitToVisibleMapArea && assetUi.committedMapBounds
        ? assetUi.committedMapBounds
        : undefined,
  }),
)
