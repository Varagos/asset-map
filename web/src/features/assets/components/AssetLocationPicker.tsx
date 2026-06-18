import { useEffect, useMemo } from 'react'
import {
  divIcon,
  Marker as LeafletMarker,
  type LeafletEvent,
} from 'leaflet'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'

type AssetLocationPickerProps = {
  lat: number
  lng: number
  onLocationChange: (lat: number, lng: number) => void
}

const locationMarkerIcon = divIcon({
  className: '',
  html: '<span class="asset-location-picker-marker"></span>',
  iconAnchor: [14, 14],
  iconSize: [28, 28],
})

function roundCoordinate(value: number): number {
  return Number(value.toFixed(6))
}

function LocationPickerController({
  lat,
  lng,
  onLocationChange,
}: AssetLocationPickerProps) {
  const map = useMap()
  const position = useMemo<[number, number]>(() => [lat, lng], [lat, lng])

  useMapEvents({
    click(event) {
      onLocationChange(
        roundCoordinate(event.latlng.lat),
        roundCoordinate(event.latlng.lng),
      )
    },
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [map])

  useEffect(() => {
    if (!map.getBounds().contains(position)) {
      map.panTo(position, { animate: false })
    }
  }, [map, position])

  return null
}

export function AssetLocationPicker({
  lat,
  lng,
  onLocationChange,
}: AssetLocationPickerProps) {
  const position = useMemo<[number, number]>(() => [lat, lng], [lat, lng])

  function handleMarkerDragEnd(event: LeafletEvent) {
    const marker = event.target as LeafletMarker
    const nextPosition = marker.getLatLng()

    onLocationChange(
      roundCoordinate(nextPosition.lat),
      roundCoordinate(nextPosition.lng),
    )
  }

  return (
    <div className="relative min-h-[240px] overflow-hidden rounded-lg border border-outline-variant bg-surface md:col-span-8">
      <MapContainer
        center={position}
        className="h-[240px] w-full"
        scrollWheelZoom
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPickerController
          lat={lat}
          lng={lng}
          onLocationChange={onLocationChange}
        />
        <Marker
          draggable
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
          icon={locationMarkerIcon}
          position={position}
        />
      </MapContainer>
    </div>
  )
}
