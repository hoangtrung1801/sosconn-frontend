import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { Icon, Map as LeafletMap } from 'leaflet'
import { motion } from 'framer-motion'
import { MapPin, Navigation, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import 'leaflet/dist/leaflet.css'

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

// Fix size when in dialog
const MapInvalidator = () => {
  const map = useMap()

  useEffect(() => {
    const intervals = [100, 300, 500, 1000].map(delay =>
      setTimeout(() => map.invalidateSize(), delay)
    )

    const resizeHandler = () => map.invalidateSize()
    window.addEventListener('resize', resizeHandler)

    return () => {
      intervals.forEach(clearTimeout)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [map])

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
      const timers = [100, 300, 500].map(delay =>
        setTimeout(() => {
          mapRef.current?.invalidateSize()
        }, delay)
      )
      return () => timers.forEach(clearTimeout)
    }
  }, [isVisible])

  return (
    <div className="relative">
      <div style={{ height }} className="w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
          ref={mapRef}
          key={isVisible ? 'visible' : 'hidden'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapInvalidator />
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
            className="h-10 w-10 bg-white text-gray-700 border border-gray-300 shadow-lg hover:bg-gray-50"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Hướng dẫn */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Nhấn vào bản đồ để chọn vị trí hoặc dùng nút định vị</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popup xác nhận */}
      {showConfirmation && selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-[2000] rounded-lg"
        >
          <Card className="w-80 max-w-[90%]">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Xác nhận vị trí
                </h3>
                <p className="text-gray-600 mb-1">Bạn ở đây phải không?</p>
                <p className="text-sm text-gray-500">{currentAddress}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50"
                  onClick={cancelSelection}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={confirmLocation}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default MapSelector
