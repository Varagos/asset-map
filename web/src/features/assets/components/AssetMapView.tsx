import { useEffect, useMemo, useRef } from 'react'
import { divIcon, latLngBounds, type LatLngBounds } from 'leaflet'
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { Button } from '../../../shared/components/Button'
import type { Asset, AssetStatus, BBox } from '../model/asset.types'

type AssetMapViewProps = {
  assets: Asset[]
  center: [number, number]
  hasUnappliedMapBoundsChange: boolean
  isAreaFilterActive: boolean
  onApplyAreaFilter: () => void
  onClearAreaFilter: () => void
  onMapBoundsChanged: (bbox: BBox) => void
  onMapBoundsSynced: (bbox: BBox) => void
  onSelectAsset: (assetId: string) => void
  selectedAssetId: string | null
  shouldFitAssets: boolean
}

const markerColors: Record<AssetStatus, string> = {
  ok: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
}

function createMarkerIcon(status: AssetStatus, isSelected: boolean) {
  return divIcon({
    className: '',
    html: `<span class="asset-marker ${isSelected ? 'asset-marker-selected' : ''}" style="background:${markerColors[status]}"></span>`,
    iconAnchor: isSelected ? [12, 12] : [9, 9],
    iconSize: isSelected ? [24, 24] : [18, 18],
  })
}

function mapBoundsToBBox(bounds: LatLngBounds): BBox {
  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  return {
    minLng: southWest.lng,
    minLat: southWest.lat,
    maxLng: northEast.lng,
    maxLat: northEast.lat,
  }
}

function createAssetsBounds(assets: readonly Asset[]) {
  if (assets.length === 0) {
    return null
  }

  return latLngBounds(assets.map((asset) => [asset.lat, asset.lng]))
}

function MapController({
  assets,
  assetsBoundsKey,
  onMapBoundsChanged,
  onMapBoundsSynced,
  shouldFitAssets,
}: Pick<
  AssetMapViewProps,
  'assets' | 'onMapBoundsChanged' | 'onMapBoundsSynced' | 'shouldFitAssets'
> & {
  assetsBoundsKey: string
}) {
  const map = useMap()
  const lastFitKeyRef = useRef<string | null>(null)
  const ignoreMoveUntilRef = useRef(0)

  function reportInteractiveBoundsChange() {
    const bbox = mapBoundsToBBox(map.getBounds())

    if (Date.now() < ignoreMoveUntilRef.current) {
      onMapBoundsSynced(bbox)
      return
    }

    onMapBoundsChanged(bbox)
  }

  useMapEvents({
    dragend: reportInteractiveBoundsChange,
    moveend() {
      const bbox = mapBoundsToBBox(map.getBounds())

      if (Date.now() < ignoreMoveUntilRef.current) {
        onMapBoundsSynced(bbox)
        return
      }

      onMapBoundsChanged(bbox)
    },
    zoomend: reportInteractiveBoundsChange,
  })

  useEffect(() => {
    onMapBoundsSynced(mapBoundsToBBox(map.getBounds()))
  }, [map, onMapBoundsSynced])

  useEffect(() => {
    if (!shouldFitAssets || assets.length === 0) {
      return
    }

    if (lastFitKeyRef.current === assetsBoundsKey) {
      return
    }

    const bounds = createAssetsBounds(assets)

    if (!bounds) {
      return
    }

    lastFitKeyRef.current = assetsBoundsKey
    ignoreMoveUntilRef.current = Date.now() + 500

    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      map.setView(bounds.getCenter(), 13, {
        animate: false,
      })
      return
    }

    map.fitBounds(bounds, {
      animate: false,
      maxZoom: 13,
      padding: [32, 32],
    })
  }, [assets, assetsBoundsKey, map, shouldFitAssets])

  return null
}

export function AssetMapView({
  assets,
  center,
  hasUnappliedMapBoundsChange,
  isAreaFilterActive,
  onApplyAreaFilter,
  onClearAreaFilter,
  onMapBoundsChanged,
  onMapBoundsSynced,
  onSelectAsset,
  selectedAssetId,
  shouldFitAssets,
}: AssetMapViewProps) {
  const assetsBoundsKey = useMemo(
    () =>
      assets
        .map((asset) => `${asset.id}:${asset.lat}:${asset.lng}`)
        .join('|'),
    [assets],
  )

  return (
    <section className="relative min-h-[420px] flex-1 overflow-hidden bg-surface-container">
      <MapContainer
        center={center}
        className="h-full min-h-[420px] w-full"
        scrollWheelZoom
        zoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          assets={assets}
          assetsBoundsKey={assetsBoundsKey}
          onMapBoundsChanged={onMapBoundsChanged}
          onMapBoundsSynced={onMapBoundsSynced}
          shouldFitAssets={shouldFitAssets}
        />
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAssetId

          return (
            <Marker
              eventHandlers={{
                click: () => onSelectAsset(asset.id),
              }}
              icon={createMarkerIcon(asset.status, isSelected)}
              key={asset.id}
              position={[asset.lat, asset.lng]}
            >
              <Tooltip>{asset.name}</Tooltip>
            </Marker>
          )
        })}
      </MapContainer>

      {hasUnappliedMapBoundsChange ? (
        <div className="absolute left-4 top-4 z-[500] rounded-md border border-outline-variant bg-surface-container-lowest p-2 shadow">
          <Button onClick={onApplyAreaFilter} variant="primary">
            Search this area
          </Button>
        </div>
      ) : null}

      {isAreaFilterActive ? (
        <div className="absolute left-4 top-20 z-[500] rounded-md border border-outline-variant bg-surface-container-lowest p-2 shadow">
          <Button onClick={onClearAreaFilter}>Clear area filter</Button>
        </div>
      ) : null}

      <div className="absolute bottom-4 right-4 z-[500] grid gap-2 rounded-md border border-outline-variant bg-surface-container-lowest p-3 text-xs shadow">
        {Object.entries(markerColors).map(([status, color]) => (
          <span className="flex items-center gap-2 capitalize" key={status}>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {status}
          </span>
        ))}
      </div>
    </section>
  )
}
