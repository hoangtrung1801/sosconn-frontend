import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { Icon, Map as LeafletMap } from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, Navigation, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import 'leaflet/dist/leaflet.css'

// Fix for Leaflet default marker icons in webpack
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LatLng {
  lat: number
  lng: number
}

interface MapSelectorProps {
  onLocationSelect: (location: LatLng & { address: string }) => void
  initialLocation?: LatLng
  height?: string
  isVisible?: boolean
}

// Custom marker icon
const createLocationIcon = () => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#3B82F6"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#3B82F6"/>
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40]
  })
}

// Handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (location: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}

// Fix size when in dialog with enhanced timing
const MapInvalidator = ({ isVisible }: { isVisible?: boolean }) => {
  const map = useMap()

  useEffect(() => {
    // Multiple invalidation attempts with extended timeouts for dialog rendering
    const intervals = [50, 100, 200, 300, 500, 1000, 1500].map(delay =>
      setTimeout(() => {
        try {
          map.invalidateSize(true) // Force pan and zoom reset
        } catch (error) {
          console.warn('Map invalidation failed:', error)
        }
      }, delay)
    )

    // Enhanced resize handler
    const resizeHandler = () => {
      try {
        map.invalidateSize(true)
      } catch (error) {
        console.warn('Map resize handler failed:', error)
      }
    }

    window.addEventListener('resize', resizeHandler)

    return () => {
      intervals.forEach(clearTimeout)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [map, isVisible])

  return null
}

export const MapSelector = ({
  onLocationSelect,
  initialLocation,
  height = "300px",
  isVisible = true
}: MapSelectorProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(initialLocation || null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string>('')
  const mapRef = useRef<LeafletMap | null>(null)

  // Default center (Đà Nẵng)
  const defaultCenter: [number, number] = [16.0471, 108.2068]
  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : defaultCenter



  // Lấy vị trí hiện tại
  const getCurrentLocation = () => {
    setIsGettingLocation(true)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setSelectedLocation(location)
          setIsGettingLocation(false)

          if (mapRef.current) {
            mapRef.current.setView([location.lat, location.lng], 15)
          }

          setShowConfirmation(true)
          setCurrentAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsGettingLocation(false)
          toast({
            title: "Không thể lấy vị trí",
            description: "Vui lòng cho phép truy cập vị trí hoặc chọn thủ công trên bản đồ.",
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    } else {
      setIsGettingLocation(false)
      toast({
        title: "Trình duyệt không hỗ trợ định vị",
        description: "Vui lòng chọn vị trí thủ công trên bản đồ.",
        variant: "destructive",
      })
    }
  }

  // Khi click trên bản đồ
  const handleMapClick = (location: LatLng) => {
    setSelectedLocation(location)
    setShowConfirmation(true)
    setCurrentAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`)
  }

  // Xác nhận chọn
  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        address: currentAddress,
      })
      setShowConfirmation(false)
    }
  }

  // Hủy chọn
  const cancelSelection = () => {
    setShowConfirmation(false)
    setSelectedLocation(null)
  }

  useEffect(() => {
    if (isVisible && mapRef.current) {
      // Enhanced invalidation timing for dialog rendering
      const timers = [100, 300, 500].map(delay =>
        setTimeout(() => {
          try {
            if (mapRef.current) {
              mapRef.current.invalidateSize(true)
            }
          } catch (error) {
            console.warn('Map invalidation failed:', error)
          }
        }, delay)
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [isVisible])

  // Simple return without complex logic
  return (
    <div className="relative" style={{ height }}>
      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapInvalidator isVisible={isVisible} />
          <MapClickHandler onLocationSelect={handleMapClick} />

          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createLocationIcon()}
            />
          )}
        </MapContainer>

        {/* Nút lấy vị trí */}
        <div className="absolute top-4 right-4 z-[1000]">
          <Button
            size="sm"
            className="h-9 w-9 bg-white text-gray-700 border border-gray-300 shadow-lg hover:bg-gray-50 hover:border-blue-300"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            title="Lấy vị trí hiện tại"
          >
            {isGettingLocation ? (
              <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <Navigation className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Hướng dẫn - floating ở góc trái dưới, không che bản đồ */}
        {!selectedLocation && (
          <div className="absolute bottom-4 left-4 z-[1000] max-w-[200px]">
            <Card className="bg-blue-50/95 backdrop-blur-sm border border-blue-300 shadow-lg">
              <CardContent className="p-2">
                <div className="flex items-center space-x-2 text-xs text-blue-800">
                  <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  <span className="font-medium leading-tight">Click để chọn vị trí</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Popup xác nhận - positioned to not block content below */}
      {showConfirmation && selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 z-[2000] rounded-lg"
        >
          <Card className="w-full bg-white shadow-xl border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Xác nhận vị trí này?
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 truncate">
                    {currentAddress}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-7"
                      onClick={cancelSelection}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-7"
                      onClick={confirmLocation}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Chọn
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default MapSelector
