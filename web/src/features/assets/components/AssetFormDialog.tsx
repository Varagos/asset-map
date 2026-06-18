import { useCallback, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { skipToken } from '@reduxjs/toolkit/query'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
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
import type { BBox } from '../model/asset.types'
import type { AssetFormInput, AssetFormValues } from '../model/asset.schema'

const fallbackLocation = {
  lat: 42.3601,
  lng: -71.0589,
}

function getBoundsCenter(bounds: BBox | null): Pick<AssetFormInput, 'lat' | 'lng'> {
  if (!bounds) {
    return fallbackLocation
  }

  return {
    lat: Number(((bounds.minLat + bounds.maxLat) / 2).toFixed(6)),
    lng: Number(((bounds.minLng + bounds.maxLng) / 2).toFixed(6)),
  }
}

function createDefaultValues(bounds: BBox | null): AssetFormInput {
  return {
    name: '',
    type: 'pipe',
    status: 'ok',
    ...getBoundsCenter(bounds),
    installed_at: new Date().toISOString().slice(0, 10),
    last_inspected_at: '',
    notes: '',
  }
}

export function AssetFormDialog() {
  const dispatch = useAppDispatch()
  const { draftMapBounds, editingAssetId, formMode } = useAppSelector(
    (state) => state.assetUi,
  )
  const isOpen = formMode !== null
  const isEditMode = formMode === 'edit'
  const defaultValues = useMemo(
    () => createDefaultValues(draftMapBounds),
    [draftMapBounds],
  )
  const { data: editingAsset } = useGetAssetByIdQuery(
    isEditMode && editingAssetId ? editingAssetId : skipToken,
  )
  const [createAsset, createState] = useCreateAssetMutation()
  const [updateAsset, updateState] = useUpdateAssetMutation()

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<AssetFormInput, unknown, AssetFormValues>({
    defaultValues,
    resolver: zodResolver(assetFormSchema),
  })
  const watchedLat = useWatch({ control, name: 'lat' })
  const watchedLng = useWatch({ control, name: 'lng' })
  const lat = Number.isFinite(Number(watchedLat))
    ? Number(watchedLat)
    : fallbackLocation.lat
  const lng = Number.isFinite(Number(watchedLng))
    ? Number(watchedLng)
    : fallbackLocation.lng

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
  }, [defaultValues, editingAsset, isEditMode, isOpen, reset])

  const isSaving = createState.isLoading || updateState.isLoading

  const onSubmit: SubmitHandler<AssetFormValues> = async (values) => {
    const input = toCreateAssetInput(values)

    if (isEditMode) {
      if (!editingAsset) {
        return
      }

      const updatedAsset = await updateAsset({
        id: editingAsset.id,
        version: editingAsset.version,
        changes: input,
      }).unwrap()

      dispatch(selectAsset(updatedAsset.id))
    } else {
      const createdAsset = await createAsset(input).unwrap()

      dispatch(selectAsset(createdAsset.id))
    }

    dispatch(closeForm())
  }
  const handleLocationChange = useCallback(
    (nextLat: number, nextLng: number) => {
      setValue('lat', nextLat, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue('lng', nextLng, {
        shouldDirty: true,
        shouldValidate: true,
      })
    },
    [setValue],
  )
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setValue('lat', Number(position.coords.latitude.toFixed(6)), {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue('lng', Number(position.coords.longitude.toFixed(6)), {
        shouldDirty: true,
        shouldValidate: true,
      })
    })
  }, [setValue])

  return (
    <AssetFormDialogView
      assetName={editingAsset?.name}
      errors={errors}
      isEditMode={isEditMode}
      isOpen={isOpen}
      isSaving={isSaving}
      lat={lat}
      lng={lng}
      onCancel={() => dispatch(closeForm())}
      onLocationChange={handleLocationChange}
      onSubmit={handleSubmit(onSubmit)}
      onUseCurrentLocation={handleUseCurrentLocation}
      register={register}
    />
  )
}
