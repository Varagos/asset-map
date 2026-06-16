import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  refreshMapBounds,
  setLimitToVisibleMapArea,
  setSearch,
  setStatus,
  setType,
} from '../state/assetUiSlice'
import { AssetFiltersView } from './AssetFiltersView'

export function AssetFilters() {
  const dispatch = useAppDispatch()
  const {
    hasUnappliedMapBoundsChange,
    limitToVisibleMapArea,
    search,
    status,
    type,
  } = useAppSelector((state) => state.assetUi)

  return (
    <AssetFiltersView
      hasUnappliedMapBoundsChange={hasUnappliedMapBoundsChange}
      limitToVisibleMapArea={limitToVisibleMapArea}
      onLimitToVisibleMapAreaChange={(enabled) =>
        dispatch(setLimitToVisibleMapArea(enabled))
      }
      onRefreshMapArea={() => dispatch(refreshMapBounds())}
      onSearchChange={(value) => dispatch(setSearch(value))}
      onStatusChange={(value) => dispatch(setStatus(value))}
      onTypeChange={(value) => dispatch(setType(value))}
      search={search}
      status={status}
      type={type}
    />
  )
}
