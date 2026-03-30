'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface OrderMapProps {
  destination: any
  status: string
}

export default function OrderMap({ destination, status }: OrderMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>([37.7749, -122.4194])
  const warehouseLocation: [number, number] = [40.7128, -74.0060]

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const address = `${destination?.address_line1}, ${destination?.city}, ${destination?.state}`
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        )
        const data = await response.json()
        
        if (data && data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    if (destination) {
      geocodeAddress()
    }
  }, [destination])

  const midpoint: [number, number] = [
    (warehouseLocation[0] + coordinates[0]) / 2,
    (warehouseLocation[1] + coordinates[1]) / 2,
  ]

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer center={midpoint} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={warehouseLocation}>
          <Popup>Warehouse</Popup>
        </Marker>
        <Marker position={coordinates}>
          <Popup>Delivery Address</Popup>
        </Marker>
        <Polyline positions={[warehouseLocation, coordinates]} color="#8B5CF6" />
      </MapContainer>
    </div>
  )
}
