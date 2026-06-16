import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  setStatus,
  setType,
} from '../state/assetUiSlice'
import { AssetFiltersView } from './AssetFiltersView'

export function AssetFilters() {
  const dispatch = useAppDispatch()
  const { status, type } = useAppSelector((state) => state.assetUi)

  return (
    <AssetFiltersView
      onStatusChange={(value) => dispatch(setStatus(value))}
      onTypeChange={(value) => dispatch(setType(value))}
      status={status}
      type={type}
    />
  )
}
