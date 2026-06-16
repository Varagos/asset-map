import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken } from '@reduxjs/toolkit/query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  useCreateAssetMutation,
  useGetAssetByIdQuery,
  useUpdateAssetMutation,
} from '../api/assetsApi'
import {
  assetFormSchema,
  assetToFormValues,
  toCreateAssetInput,
} from '../model/asset.schema'
import {
  closeForm,
  selectAsset,
} from '../state/assetUiSlice'
import { AssetFormDialogView } from './AssetFormDialogView'
import type { AssetFormInput, AssetFormValues } from '../model/asset.schema'

const defaultValues: AssetFormInput = {
  name: '',
  type: 'pipe',
  status: 'ok',
  lat: 42.3601,
  lng: -71.0589,
  installed_at: new Date().toISOString().slice(0, 10),
  last_inspected_at: '',
  notes: '',
}

export function AssetFormDialog() {
  const dispatch = useAppDispatch()
  const { editingAssetId, formMode } = useAppSelector((state) => state.assetUi)
  const isOpen = formMode !== null
  const isEditMode = formMode === 'edit'
  const { data: editingAsset } = useGetAssetByIdQuery(
    isEditMode && editingAssetId ? editingAssetId : skipToken,
  )
  const [createAsset, createState] = useCreateAssetMutation()
  const [updateAsset, updateState] = useUpdateAssetMutation()

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<AssetFormInput, unknown, AssetFormValues>({
    defaultValues,
    resolver: zodResolver(assetFormSchema),
  })

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues)
      return
    }

    if (isEditMode && editingAsset) {
      reset(assetToFormValues(editingAsset))
      return
    }

    if (!isEditMode) {
      reset(defaultValues)
    }
  }, [editingAsset, isEditMode, isOpen, reset])

  const isSaving = createState.isLoading || updateState.isLoading

  const onSubmit: SubmitHandler<AssetFormValues> = async (values) => {
    const input = toCreateAssetInput(values)

    if (isEditMode && editingAssetId) {
      const updatedAsset = await updateAsset({
        id: editingAssetId,
        changes: input,
      }).unwrap()

      dispatch(selectAsset(updatedAsset.id))
    } else {
      const createdAsset = await createAsset(input).unwrap()

      dispatch(selectAsset(createdAsset.id))
    }

    dispatch(closeForm())
  }

  return (
    <AssetFormDialogView
      errors={errors}
      isEditMode={isEditMode}
      isOpen={isOpen}
      isSaving={isSaving}
      onCancel={() => dispatch(closeForm())}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
    />
  )
}
