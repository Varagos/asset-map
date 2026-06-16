import { skipToken } from '@reduxjs/toolkit/query'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  useDeleteAssetMutation,
  useGetAssetByIdQuery,
} from '../api/assetsApi'
import {
  closeDeleteDialog,
  selectAsset,
} from '../state/assetUiSlice'
import { DeleteAssetDialogView } from './DeleteAssetDialogView'

export function DeleteAssetDialog() {
  const dispatch = useAppDispatch()
  const { deletingAssetId, selectedAssetId } = useAppSelector(
    (state) => state.assetUi,
  )
  const { data: asset } = useGetAssetByIdQuery(deletingAssetId ?? skipToken)
  const [deleteAsset, deleteState] = useDeleteAssetMutation()

  async function confirmDelete() {
    if (!deletingAssetId) {
      return
    }

    await deleteAsset(deletingAssetId).unwrap()

    if (selectedAssetId === deletingAssetId) {
      dispatch(selectAsset(null))
    }

    dispatch(closeDeleteDialog())
  }

  return (
    <DeleteAssetDialogView
      assetName={asset?.name}
      isDeleting={deleteState.isLoading}
      onCancel={() => dispatch(closeDeleteDialog())}
      onConfirmDelete={confirmDelete}
      open={Boolean(deletingAssetId)}
    />
  )
}
