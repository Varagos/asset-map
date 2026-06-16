import { skipToken } from '@reduxjs/toolkit/query'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { useGetAssetByIdQuery } from '../api/assetsApi'
import {
  openDeleteDialog,
  openEditForm,
  selectAsset,
} from '../state/assetUiSlice'
import { AssetDetailDrawerView } from './AssetDetailDrawerView'

export function AssetDetailDrawer() {
  const dispatch = useAppDispatch()
  const selectedAssetId = useAppSelector(
    (state) => state.assetUi.selectedAssetId,
  )
  const { data: asset } = useGetAssetByIdQuery(selectedAssetId ?? skipToken)

  return (
    <AssetDetailDrawerView
      asset={asset}
      onClose={() => dispatch(selectAsset(null))}
      onDeleteAsset={(assetId) => dispatch(openDeleteDialog(assetId))}
      onEditAsset={(assetId) => dispatch(openEditForm(assetId))}
      open={Boolean(selectedAssetId)}
    />
  )
}
