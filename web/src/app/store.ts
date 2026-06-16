import { configureStore } from '@reduxjs/toolkit'
import { assetsApi } from '../features/assets/api/assetsApi'
import { assetUiReducer } from '../features/assets/state/assetUiSlice'

export const store = configureStore({
  reducer: {
    assetUi: assetUiReducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(assetsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
