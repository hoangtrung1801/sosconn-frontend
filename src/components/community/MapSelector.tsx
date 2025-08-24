'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LatLng {
  lat: number;
  lng: number;
}

interface MapSelectorProps {
  onLocationSelect: (location: LatLng & { address: string }) => void;
  initialLocation?: LatLng;
  height?: string;
}

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (location: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

export const MapSelector = ({ 
  onLocationSelect, 
  initialLocation,
  height = "300px" 
}: MapSelectorProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    initialLocation || null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const mapRef = useRef<L.Map | null>(null);

  // Default location (Da Nang, Vietnam)
  const defaultCenter: LatLng = { lat: 16.0471, lng: 108.2068 };
  const center = selectedLocation || initialLocation || defaultCenter;

  // Get current location using geolocation
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(location);
          setIsGettingLocation(false);
          
          // Move map to current location
          if (mapRef.current) {
            mapRef.current.setView([location.lat, location.lng], 15);
          }
          
          // Show confirmation dialog
          setShowConfirmation(true);
          setCurrentAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí hoặc chọn thủ công trên bản đồ.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Trình duyệt không hỗ trợ định vị.');
    }
  };

  // Handle map click
  const handleMapClick = (location: LatLng) => {
    setSelectedLocation(location);
    setShowConfirmation(true);
    setCurrentAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  };

  // Confirm location selection
  const confirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        address: currentAddress,
      });
      setShowConfirmation(false);
    }
  };

  // Cancel location selection
  const cancelSelection = () => {
    setShowConfirmation(false);
    setSelectedLocation(null);
  };

  useEffect(() => {
    // Invalidate map size when component mounts
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
  }, []);

  return (
    <div className="relative">
      {/* Map Container */}
      <div style={{ height }} className="relative rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Click handler */}
          <MapClickHandler onLocationSelect={handleMapClick} />
          
          {/* Marker for selected location */}
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          )}
        </MapContainer>

        {/* Get Current Location Button */}
        <div className="absolute top-4 right-4 z-[1000]">
          <Button
            size="icon"
            className="bg-white text-gray-700 border border-gray-300 shadow-lg hover:bg-gray-50"
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

        {/* Instructions */}
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

      {/* Confirmation Dialog */}
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
                  variant="outline"
                  className="flex-1"
                  onClick={cancelSelection}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
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
  );
};

export default MapSelector;
