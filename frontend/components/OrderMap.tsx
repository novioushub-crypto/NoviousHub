'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapPin, Loader2, AlertCircle } from 'lucide-react'

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
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Default warehouse location (New York)
  const warehouseLocation: [number, number] = [40.7128, -74.0060]

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!destination) {
        setError('No destination address provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const address = `${destination?.address_line1}, ${destination?.city}, ${destination?.state}, ${destination?.country}`
        console.log('Geocoding address:', address)
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
          {
            headers: {
              'User-Agent': 'Noviious-Ecommerce/1.0'
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('Geocoding service unavailable')
        }
        
        const data = await response.json()
        console.log('Geocoding result:', data)
        
        if (data && data.length > 0) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          setCoordinates(coords)
          console.log('Coordinates set:', coords)
        } else {
          // Fallback to default location if geocoding fails
          console.log('No geocoding results, using default')
          setCoordinates([37.7749, -122.4194]) // San Francisco
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Geocoding error:', error)
        setError('Unable to load map location')
        // Use default coordinates on error
        setCoordinates([37.7749, -122.4194])
        setLoading(false)
      }
    }

    geocodeAddress()
  }, [destination])

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-96 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Loading map...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !coordinates) {
    return (
      <div className="w-full h-96 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-text-secondary">{error}</p>
        </div>
      </div>
    )
  }

  // Calculate midpoint for map center
  const midpoint: [number, number] = coordinates
    ? [
        (warehouseLocation[0] + coordinates[0]) / 2,
        (warehouseLocation[1] + coordinates[1]) / 2,
      ]
    : warehouseLocation

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer 
        center={midpoint} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Warehouse Marker */}
        <Marker position={warehouseLocation}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">📦 Warehouse</p>
              <p className="text-xs">New York, NY</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Delivery Address Marker */}
        {coordinates && (
          <>
            <Marker position={coordinates}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold">🏠 Delivery Address</p>
                  <p className="text-xs">{destination?.city}, {destination?.state}</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Route Line */}
            <Polyline 
              positions={[warehouseLocation, coordinates]} 
              color="#8B5CF6" 
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          </>
        )}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000]">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Warehouse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Delivery Address</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-500" style={{ borderTop: '2px dashed #8B5CF6' }}></div>
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  )
}
