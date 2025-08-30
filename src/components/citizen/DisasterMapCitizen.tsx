import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hospital, Shield, AlertTriangle, MapPin } from "lucide-react";
import type { DisasterSeverity } from "@/types/disaster.type";
import { mockFloodData } from "@/lib/mock-data/flood-data";
import { mockRainData, type RainStation } from "@/lib/mock-data/rain-data";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

type DisasterPhase = "before" | "during" | "after";

interface Shelter {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  status: "available" | "full" | "closed";
}

interface Hospital {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  emergencyCapacity: number;
  specialties: string[];
  status: "operational" | "limited" | "closed";
}

interface RiskZone {
  id: string;
  type: "flood" | "landslide" | "fire" | "storm";
  severity: "low" | "medium" | "high" | "critical";
  coordinates: [number, number][];
  description: string;
  name: string;
}

interface SafeRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: "safe" | "dangerous" | "blocked";
  type: "evacuation" | "emergency_access" | "supply_route";
}

interface MarkerFilters {
  disasters: {
    showAll: boolean;
    severities: DisasterSeverity[];
    statuses: string[];
    types: string[];
  };
  rainStations: {
    showAll: boolean;
    intensities: RainStation["intensity"][];
  };
  shelters: {
    showAll: boolean;
    statuses: Shelter["status"][];
  };
  hospitals: {
    showAll: boolean;
    statuses: Hospital["status"][];
  };
  riskZones: {
    showAll: boolean;
    severities: RiskZone["severity"][];
    types: RiskZone["type"][];
  };
  safeRoutes: {
    showAll: boolean;
    statuses: SafeRoute["status"][];
    types: SafeRoute["type"][];
  };
}

interface DisasterMapCitizenProps {
  currentPhase: DisasterPhase;
  emergencyLevel: "low" | "medium" | "high" | "critical";
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Mock data for demonstration - Enhanced with more data
const mockShelters: Shelter[] = [
  {
    id: "shelter-1",
    name: "Da Nang Community Center",
    location: {
      latitude: 16.0544,
      longitude: 108.2022,
      address: "123 Tran Phu St, Da Nang",
    },
    capacity: 500,
    currentOccupancy: 150,
    facilities: ["Food", "Medical", "WiFi", "Childcare"],
    status: "available",
  },
  {
    id: "shelter-2",
    name: "Hai Chau Sports Complex",
    location: {
      latitude: 16.0644,
      longitude: 108.2122,
      address: "456 Bach Dang St, Da Nang",
    },
    capacity: 800,
    currentOccupancy: 600,
    facilities: ["Food", "Medical", "WiFi"],
    status: "available",
  },
  {
    id: "shelter-3",
    name: "Son Tra Emergency Shelter",
    location: {
      latitude: 16.0744,
      longitude: 108.2222,
      address: "789 Vo Nguyen Giap St, Da Nang",
    },
    capacity: 300,
    currentOccupancy: 300,
    facilities: ["Food", "Medical"],
    status: "full",
  },
  {
    id: "shelter-4",
    name: "Thanh Khe Community Hall",
    location: {
      latitude: 16.0471,
      longitude: 108.2068,
      address: "321 Dien Bien Phu St, Da Nang",
    },
    capacity: 400,
    currentOccupancy: 120,
    facilities: ["Food", "Medical", "WiFi", "Childcare", "Pet Care"],
    status: "available",
  },
];

const mockHospitals: Hospital[] = [
  {
    id: "hospital-1",
    name: "Da Nang General Hospital",
    location: {
      latitude: 16.0544,
      longitude: 108.1922,
      address: "124 Hai Phong St, Da Nang",
    },
    emergencyCapacity: 200,
    specialties: ["Emergency", "Surgery", "Pediatrics", "Cardiology"],
    status: "operational",
  },
  {
    id: "hospital-2",
    name: "Hoan My Da Nang Hospital",
    location: {
      latitude: 16.0444,
      longitude: 108.1822,
      address: "161 Nguyen Van Linh St, Da Nang",
    },
    emergencyCapacity: 150,
    specialties: ["Emergency", "Surgery", "ICU"],
    status: "operational",
  },
  {
    id: "hospital-3",
    name: "Vinmec Da Nang Hospital",
    location: {
      latitude: 16.0612,
      longitude: 108.2105,
      address: "458 Minh Khai St, Da Nang",
    },
    emergencyCapacity: 180,
    specialties: ["Emergency", "Trauma", "Pediatrics", "Neurology"],
    status: "operational",
  },
];

// Icon creation functions
const createDisasterIcon = (severity: DisasterSeverity): L.DivIcon => {
  const colors = {
    low: '#10B981',     // Green
    medium: '#F59E0B',  // Yellow  
    high: '#EF4444',    // Red
    critical: '#DC2626' // Dark Red
  };
  
  return L.divIcon({
    html: `<div style="
      background-color: ${colors[severity]};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: 'disaster-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const createRainIcon = (intensity: string): L.DivIcon => {
  const getColor = (intensity: string) => {
    if (intensity === 'extreme') return '#DC2626'; // Red - Extreme rain
    if (intensity === 'heavy') return '#EF4444';   // Red - Heavy rain
    if (intensity === 'moderate') return '#F59E0B'; // Yellow - Moderate rain  
    return '#3B82F6'; // Blue - Light rain
  };
  
  return L.divIcon({
    html: `<div style="
      background-color: ${getColor(intensity)};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    className: 'rain-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const createShelterIcon = (): L.DivIcon => {
  return L.divIcon({
    html: `<div style="
      background-color: #10B981;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
    ">🏠</div>`,
    className: 'shelter-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createHospitalIcon = (): L.DivIcon => {
  return L.divIcon({
    html: `<div style="
      background-color: #DC2626;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
    ">🏥</div>`,
    className: 'hospital-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Helper functions
const shouldShowDisaster = (_disaster: any, filters: any) => {
  return filters.disasters.showAll;
};

const shouldShowRainStation = (_station: RainStation, filters: any) => {
  return filters.rainStations.showAll;
};

const shouldShowShelter = (_shelter: Shelter, filters: any) => {
  return filters.shelters.showAll;
};

const shouldShowHospital = (_hospital: Hospital, filters: any) => {
  return filters.hospitals.showAll;
};

const shouldShowRiskZone = (_zone: RiskZone, filters: any) => {
  return filters.riskZones.showAll;
};

const shouldShowSafeRoute = (_route: SafeRoute, filters: any) => {
  return filters.safeRoutes.showAll;
};


const mockRiskZones: RiskZone[] = [
  {
    id: "risk-1",
    name: "Han River Flood Zone",
    type: "flood",
    severity: "high",
    coordinates: [
      [16.04, 108.19],
      [16.05, 108.19],
      [16.05, 108.2],
      [16.04, 108.2],
    ],
    description: "High flood risk zone near Han River",
  },
  {
    id: "risk-2",
    name: "Son Tra Landslide Zone",
    type: "landslide",
    severity: "medium",
    coordinates: [
      [16.07, 108.22],
      [16.08, 108.22],
      [16.08, 108.23],
      [16.07, 108.23],
    ],
    description: "Landslide risk zone in Son Tra area",
  },
  {
    id: "risk-3",
    name: "Downtown Critical Flood Zone",
    type: "flood",
    severity: "critical",
    coordinates: [
      [16.02, 108.15],
      [16.03, 108.15],
      [16.03, 108.165],
      [16.02, 108.165],
    ],
    description: "Critical flood zone near Han River overflow",
  },
];

const mockSafeRoutes: SafeRoute[] = [
  {
    id: "route-1",
    name: "Emergency Evacuation Route A",
    coordinates: [
      [16.0544, 108.2022],
      [16.06, 108.21],
      [16.065, 108.215],
      [16.07, 108.22],
    ],
    status: "safe",
    type: "evacuation",
  },
  {
    id: "route-2",
    name: "Hospital Access Route",
    coordinates: [
      [16.0444, 108.1922],
      [16.05, 108.195],
      [16.0544, 108.2022],
    ],
    status: "safe",
    type: "emergency_access",
  },
  {
    id: "route-3",
    name: "Blocked Route to City Center",
    coordinates: [
      [16.04, 108.19],
      [16.045, 108.195],
      [16.05, 108.2],
    ],
    status: "blocked",
    type: "evacuation",
  },
  {
    id: "route-4",
    name: "Supply Route - West Side",
    coordinates: [
      [16.0755, 108.1568],
      [16.07, 108.165],
      [16.065, 108.175],
      [16.06, 108.185],
    ],
    status: "safe",
    type: "supply_route",
  },
];



export const DisasterMapCitizen: React.FC<DisasterMapCitizenProps> = ({
  currentPhase,
  emergencyLevel,
  center = [16.0544, 108.2022], // Da Nang center
  zoom = 12,
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(false);

  // Filter state  
  const [filters, setFilters] = useState<MarkerFilters>({
    disasters: {
      showAll: true,
      severities: ["critical", "high", "medium", "low"],
      statuses: ["active", "monitoring", "resolved"],
      types: [],
    },
    rainStations: {
      showAll: true,
      intensities: ["extreme", "heavy", "moderate", "light"],
    },
    shelters: {
      showAll: true,
      statuses: ["available", "full", "closed"],
    },
    hospitals: {
      showAll: true,
      statuses: ["operational", "limited", "closed"],
    },
    riskZones: {
      showAll: true,
      severities: ["critical", "high", "medium", "low"],
      types: ["flood", "landslide", "fire", "storm"],
    },
    safeRoutes: {
      showAll: true,
      statuses: ["safe", "dangerous", "blocked"],
      types: ["evacuation", "emergency_access", "supply_route"],
    },
  });

  // Toggle functions for filters
  const toggleLayerVisibility = (layer: keyof MarkerFilters) => {
    setFilters((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], showAll: !prev[layer].showAll },
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err: Error) => console.error("Error entering fullscreen:", err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase-specific information cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Evacuation Shelters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available Shelters</span>
                <span className="font-medium text-green-600">
                  {mockShelters.filter((s) => s.status === "available").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Capacity</span>
                <span className="font-medium">
                  {mockShelters.reduce((sum, s) => sum + s.capacity, 0)} people
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Occupancy</span>
                <span className="font-medium">
                  {mockShelters.reduce((sum, s) => sum + s.currentOccupancy, 0)}{" "}
                  people
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Emergency Hospitals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Operational</span>
                <span className="font-medium text-green-600">
                  {
                    mockHospitals.filter((h) => h.status === "operational")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Emergency Capacity</span>
                <span className="font-medium">
                  {mockHospitals.reduce(
                    (sum, h) => sum + h.emergencyCapacity,
                    0
                  )}{" "}
                  patients
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>High Risk Zones</span>
                <span className="font-medium text-red-600">
                  {
                    mockRiskZones.filter(
                      (z) => z.severity === "high" || z.severity === "critical"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current Phase</span>
                <Badge
                  className={`text-xs ${
                    currentPhase === "before"
                      ? "bg-blue-500"
                      : currentPhase === "during"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {currentPhase.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div
        className={`w-full h-[80vh] rounded-lg overflow-hidden border relative ${className} ${
          isFullscreen
            ? "fixed inset-0 z-50 h-screen w-screen rounded-none"
            : ""
        }`}
      >
        {/* Advanced Filters Panel */}
        <div className="absolute top-2 left-2 z-[9999] bg-white/90 rounded shadow-lg">
          <div className="flex items-center justify-between p-2">
            <div className="text-xs font-semibold">Data Layers</div>
            <Button
              onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              {isFilterCollapsed ? "+" : "−"}
            </Button>
          </div>

          {!isFilterCollapsed && (
            <div className="px-2 pb-2 space-y-2 max-w-sm">
              {/* Data Layer Toggles */}
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Button
                  onClick={() => toggleLayerVisibility("disasters")}
                  variant={filters.disasters.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Disasters
                </Button>
                <Button
                  onClick={() => toggleLayerVisibility("rainStations")}
                  variant={filters.rainStations.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Rain Data
                </Button>
                <Button
                  onClick={() => toggleLayerVisibility("shelters")}
                  variant={filters.shelters.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Shelters
                </Button>
                <Button
                  onClick={() => toggleLayerVisibility("hospitals")}
                  variant={filters.hospitals.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Hospitals
                </Button>
                <Button
                  onClick={() => toggleLayerVisibility("riskZones")}
                  variant={filters.riskZones.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Risk Zones
                </Button>
                <Button
                  onClick={() => toggleLayerVisibility("safeRoutes")}
                  variant={filters.safeRoutes.showAll ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-6"
                >
                  Safe Routes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-2 right-2 z-[9999] flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium shadow-lg transition-colors duration-200"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>

        {/* React Leaflet Map */}
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Disaster Markers */}
          {filters.disasters.showAll && mockFloodData.map((disaster) => (
            shouldShowDisaster(disaster, filters) && (
              <Marker
                key={disaster.id}
                position={[disaster.location.latitude, disaster.location.longitude]}
                icon={createDisasterIcon(disaster.severity)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{disaster.type}</h3>
                    <p className="text-sm text-gray-600">{disaster.location.address}</p>
                    <div className="mt-2">
                      <Badge variant={disaster.severity === 'critical' ? 'destructive' : 'default'}>
                        {disaster.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">{disaster.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Affected: {disaster.affectedPeople} people
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Rain Station Markers */}
          {filters.rainStations.showAll && mockRainData.map((station) => (
            shouldShowRainStation(station, filters) && (
              <Marker
                key={station.id}
                position={[station.location.latitude, station.location.longitude]}
                icon={createRainIcon(station.intensity)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Rain Station {station.id}</h3>
                    <p className="text-sm text-gray-600">{station.location.address}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Rain Accumulation: {station.rainAccumulation}mm</p>
                      <p className="text-sm">Intensity: <span className="font-medium">{station.intensity}</span></p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Shelter Markers */}
          {filters.shelters.showAll && mockShelters.map((shelter) => (
            shouldShowShelter(shelter, filters) && (
              <Marker
                key={shelter.id}
                position={[shelter.location.latitude, shelter.location.longitude]}
                icon={createShelterIcon()}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{shelter.name}</h3>
                    <p className="text-sm text-gray-600">{shelter.location.address}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Capacity: {shelter.capacity} people</p>
                      <p className="text-sm">Current: {shelter.currentOccupancy} people</p>
                      <Badge variant={shelter.status === 'available' ? 'default' : 'secondary'}>
                        {shelter.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Facilities: {shelter.facilities.join(', ')}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Hospital Markers */}
          {filters.hospitals.showAll && mockHospitals.map((hospital) => (
            shouldShowHospital(hospital, filters) && (
              <Marker
                key={hospital.id}
                position={[hospital.location.latitude, hospital.location.longitude]}
                icon={createHospitalIcon()}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{hospital.name}</h3>
                    <p className="text-sm text-gray-600">{hospital.location.address}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Emergency Capacity: {hospital.emergencyCapacity}</p>
                      <Badge variant={hospital.status === 'operational' ? 'default' : 'secondary'}>
                        {hospital.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Specialties: {hospital.specialties.join(', ')}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Risk Zone Polygons */}
          {filters.riskZones.showAll && mockRiskZones.map((zone) => (
            shouldShowRiskZone(zone, filters) && (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: zone.severity === 'critical' ? '#DC2626' : 
                         zone.severity === 'high' ? '#EF4444' :
                         zone.severity === 'medium' ? '#F59E0B' : '#10B981',
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.3
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{zone.name}</h3>
                    <p className="text-sm text-gray-600">{zone.description}</p>
                    <div className="mt-2">
                      <Badge variant={zone.severity === 'critical' || zone.severity === 'high' ? 'destructive' : 'default'}>
                        {zone.severity.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            )
          ))}

          {/* Safe Route Polylines */}
          {filters.safeRoutes.showAll && mockSafeRoutes.map((route) => (
            shouldShowSafeRoute(route, filters) && (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                pathOptions={{
                  color: route.status === 'safe' ? '#10B981' : 
                         route.status === 'blocked' ? '#EF4444' : '#F59E0B',
                  weight: 4,
                  opacity: 0.8
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{route.name}</h3>
                    <div className="mt-2">
                      <Badge variant={route.status === 'safe' ? 'default' : 'destructive'}>
                        {route.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">Type: {route.type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </Popup>
              </Polyline>
            )
          ))}
        </MapContainer>
      </div>

      {/* Emergency Phase Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Emergency Status
          </CardTitle>
          <CardDescription>
            Phase: <strong>{currentPhase.toUpperCase()}</strong> | Emergency
            Level:{" "}
            <strong
              className={`${
                emergencyLevel === "critical"
                  ? "text-red-600"
                  : emergencyLevel === "high"
                  ? "text-orange-600"
                  : emergencyLevel === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {emergencyLevel.toUpperCase()}
            </strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Active Disasters</div>
              <div className="text-lg font-bold text-red-600">
                {mockFloodData.filter((d) => d.status === "active").length}
              </div>
            </div>
            <div>
              <div className="font-medium">Rain Stations</div>
              <div className="text-lg font-bold text-blue-600">
                {mockRainData.length}
              </div>
            </div>
            <div>
              <div className="font-medium">Safe Routes</div>
              <div className="text-lg font-bold text-green-600">
                {mockSafeRoutes.filter((r) => r.status === "safe").length}
              </div>
            </div>
            <div>
              <div className="font-medium">Blocked Routes</div>
              <div className="text-lg font-bold text-red-600">
                {mockSafeRoutes.filter((r) => r.status === "blocked").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
