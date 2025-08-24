import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { FloodData, DisasterSeverity } from '@/types/disaster.type'

interface DisasterMapProps {
  disasters: FloodData[]
  center?: [number, number]
  zoom?: number
  className?: string
}

const getSeverityColor = (severity: DisasterSeverity): string => {
  switch (severity) {
    case 'critical': return '#dc2626' // red-600
    case 'high': return '#ea580c' // orange-600
    case 'medium': return '#d97706' // amber-600
    case 'low': return '#16a34a' // green-600
    default: return '#6b7280' // gray-500
  }
}

const createDisasterIcon = (severity: DisasterSeverity, status: string) => {
  const color = getSeverityColor(severity)
  const opacity = status === 'resolved' ? '0.6' : '1'
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2" opacity="${opacity}"/>
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.8"/>
        <text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="${color}">!</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  disasters,
  center = [10.8231, 106.6297], // Ho Chi Minh City center
  zoom = 11,
  className = ''
}) => {
  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={[disaster.location.latitude, disaster.location.longitude]}
            icon={createDisasterIcon(disaster.severity, disaster.status)}
          >
            <Popup className="max-w-sm">
              <div className="space-y-2 p-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{disaster.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    disaster.status === 'active' ? 'bg-red-500' :
                    disaster.status === 'monitoring' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {disaster.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><strong>Type:</strong> {disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}</p>
                  <p><strong>Severity:</strong> 
                    <span className={`ml-1 font-medium ${
                      disaster.severity === 'critical' ? 'text-red-600' :
                      disaster.severity === 'high' ? 'text-orange-600' :
                      disaster.severity === 'medium' ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {disaster.severity.toUpperCase()}
                    </span>
                  </p>
                  <p><strong>Affected People:</strong> {disaster.affectedPeople.toLocaleString()}</p>
                  <p><strong>Water Level:</strong> {disaster.waterLevel}m</p>
                  <p><strong>Affected Area:</strong> {disaster.affectedArea}km²</p>
                </div>
                
                <div className="text-xs text-gray-600 border-t pt-2">
                  <p><strong>Location:</strong> {disaster.location.address}</p>
                  <p><strong>Reported:</strong> {formatDate(disaster.reportedAt)}</p>
                  <p><strong>Updated:</strong> {formatDate(disaster.updatedAt)}</p>
                  <p><strong>Reporter:</strong> {disaster.reportedBy}</p>
                </div>
                
                <div className="text-sm mt-2">
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-700">{disaster.description}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}