import { useEffect } from 'react'
import { divIcon, type LatLngBounds } from 'leaflet'
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMapEvents,
} from 'react-leaflet'
import { Button } from '../../../shared/components/Button'
import type { Asset, AssetStatus, BBox } from '../model/asset.types'

type AssetMapViewProps = {
  assets: Asset[]
  center: [number, number]
  hasUnappliedMapBoundsChange: boolean
  isLimitedToVisibleMapArea: boolean
  onCommitMapBounds: (bbox: BBox) => void
  onRefreshResults: () => void
  onSelectAsset: (assetId: string) => void
  onUpdateDraftMapBounds: (bbox: BBox) => void
  selectedAssetId: string | null
}

const markerColors: Record<AssetStatus, string> = {
  ok: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
}

function boundsToBBox(bounds: LatLngBounds): BBox {
  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  return {
    minLng: southWest.lng,
    minLat: southWest.lat,
    maxLng: northEast.lng,
    maxLat: northEast.lat,
  }
}

function createMarkerIcon(status: AssetStatus, isSelected: boolean) {
  return divIcon({
    className: '',
    html: `<span class="asset-marker ${isSelected ? 'asset-marker-selected' : ''}" style="background:${markerColors[status]}"></span>`,
    iconAnchor: isSelected ? [12, 12] : [9, 9],
    iconSize: isSelected ? [24, 24] : [18, 18],
  })
}

function MapBoundsReporter({
  onCommitMapBounds,
  onUpdateDraftMapBounds,
}: Pick<
  AssetMapViewProps,
  'onCommitMapBounds' | 'onUpdateDraftMapBounds'
>) {
  const map = useMapEvents({
    moveend() {
      onUpdateDraftMapBounds(boundsToBBox(map.getBounds()))
    },
    zoomend() {
      onUpdateDraftMapBounds(boundsToBBox(map.getBounds()))
    },
  })

  useEffect(() => {
    onCommitMapBounds(boundsToBBox(map.getBounds()))
  }, [map, onCommitMapBounds])

  return null
}

export function AssetMapView({
  assets,
  center,
  hasUnappliedMapBoundsChange,
  isLimitedToVisibleMapArea,
  onCommitMapBounds,
  onRefreshResults,
  onSelectAsset,
  onUpdateDraftMapBounds,
  selectedAssetId,
}: AssetMapViewProps) {
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
        <MapBoundsReporter
          onCommitMapBounds={onCommitMapBounds}
          onUpdateDraftMapBounds={onUpdateDraftMapBounds}
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

      {isLimitedToVisibleMapArea && hasUnappliedMapBoundsChange ? (
        <div className="absolute left-4 top-4 z-[500] flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 shadow">
          <span className="text-sm font-medium text-on-surface">
            Map area changed.
          </span>
          <Button onClick={onRefreshResults}>Refresh results</Button>
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
