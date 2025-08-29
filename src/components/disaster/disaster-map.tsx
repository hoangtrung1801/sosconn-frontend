import React, { useEffect, useRef, useState } from "react";
import { Icon } from "leaflet";
import type { FloodData, DisasterSeverity } from "@/types/disaster.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

declare global {
  interface Window {
    windyInit: (options: any, callback: (windyAPI: any) => void) => void;
    L: any;
  }
}

interface RainStation {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rainAccumulation: number; // mm
  intensity: "light" | "moderate" | "heavy" | "extreme";
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
}

interface DisasterMapProps {
  disasters: FloodData[];
  rainStations?: RainStation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const getRainIntensityColor = (intensity: RainStation["intensity"]): string => {
  switch (intensity) {
    case "extreme":
      return "#7c2d12"; // red-900
    case "heavy":
      return "#dc2626"; // red-600
    case "moderate":
      return "#2563eb"; // blue-600
    case "light":
      return "#06b6d4"; // cyan-500
    default:
      return "#6b7280"; // gray-500
  }
};

const createRainIcon = (station: RainStation) => {
  const color = getRainIntensityColor(station.intensity);

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <!-- Tear (droplet) shape -->
          <path d="M12 3 C12 3, 6.5 10.5, 6.5 14.5 C6.5 18.09 9.41 21 13 21 C16.59 21 19.5 18.09 19.5 14.5 C19.5 10.5 12 3 12 3 Z" fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/>
          <!-- Small highlight -->
          <path d="M10 9.5 C10.8 8.4 11.6 7.5 12 7" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
        </g>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const getSeverityColor = (severity: DisasterSeverity): string => {
  switch (severity) {
    case "critical":
      return "#dc2626"; // red-600
    case "high":
      return "#ea580c"; // orange-600
    case "medium":
      return "#d97706"; // amber-600
    case "low":
      return "#16a34a"; // green-600
    default:
      return "#6b7280"; // gray-500
  }
};

const createDisasterIcon = (severity: DisasterSeverity, status: string) => {
  const color = getSeverityColor(severity);
  const opacity = status === "resolved" ? "0.6" : "1";

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
    popupAnchor: [0, -32],
  });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const DisasterMap: React.FC<DisasterMapProps> = ({
  disasters,
  rainStations = [],
  center = [16.0544, 108.2022], // Da Nang center
  zoom = 11,
  className = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const windyAPIRef = useRef<any>(null);
  const [currentOverlay, setCurrentOverlay] = useState<string>("wind");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(false);
  const [disasterMarkersRef, setDisasterMarkersRef] = useState<any[]>([]);
  const [rainMarkersRef, setRainMarkersRef] = useState<any[]>([]);

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
  });

  const updateDisasterFilters = (
    type: "severity" | "status" | "type",
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      disasters: {
        ...prev.disasters,
        [type === "severity"
          ? "severities"
          : type === "status"
          ? "statuses"
          : "types"]: checked
          ? [
              ...prev.disasters[
                type === "severity"
                  ? "severities"
                  : type === "status"
                  ? "statuses"
                  : "types"
              ],
              value,
            ]
          : prev.disasters[
              type === "severity"
                ? "severities"
                : type === "status"
                ? "statuses"
                : "types"
            ].filter((item) => item !== value),
      },
    }));
  };

  const updateRainFilters = (
    intensity: RainStation["intensity"],
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      rainStations: {
        ...prev.rainStations,
        intensities: checked
          ? [...prev.rainStations.intensities, intensity]
          : prev.rainStations.intensities.filter((item) => item !== intensity),
      },
    }));
  };

  const toggleDisasterVisibility = () => {
    const newShowAll = !filters.disasters.showAll;
    setFilters((prev) => ({
      ...prev,
      disasters: { ...prev.disasters, showAll: newShowAll },
    }));

    disasterMarkersRef.forEach((marker) => {
      if (newShowAll) {
        marker.addTo(mapRef.current);
      } else {
        mapRef.current.removeLayer(marker);
      }
    });
  };

  const toggleRainStationVisibility = () => {
    const newShowAll = !filters.rainStations.showAll;
    setFilters((prev) => ({
      ...prev,
      rainStations: { ...prev.rainStations, showAll: newShowAll },
    }));

    rainMarkersRef.forEach((marker) => {
      if (newShowAll) {
        marker.addTo(mapRef.current);
      } else {
        mapRef.current.removeLayer(marker);
      }
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create unique ID for this map instance
    // const mapId = `windy-map-${Date.now()}`;
    const mapId = "windy";
    mapContainerRef.current.id = mapId;

    // Add Windy API scripts if not already loaded
    if (!window.windyInit) {
      const leafletScript = document.createElement("script");
      leafletScript.src = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.js";
      leafletScript.onload = () => {
        const windyScript = document.createElement("script");
        windyScript.src =
          "https://api.windy.com/assets/map-forecast/libBoot.js";
        windyScript.onload = () => initializeWindyMap(mapId);
        document.head.appendChild(windyScript);
      };
      document.head.appendChild(leafletScript);
    } else {
      initializeWindyMap(mapId);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const initializeWindyMap = (mapId: string) => {
    const options = {
      key: "p7niXPZXQdHK9f6ZZS82XeenbGiVqrx6", // Replace with actual API key
      verbose: true,
      lat: center[0],
      lon: center[1],
      zoom: zoom,
      overlay: currentOverlay,
      // maxZoom: 20,
      // minZoom: 3,
    };

    // Set the target div for Windy
    if (mapContainerRef.current) {
      mapContainerRef.current.id = mapId;
    }

    window.windyInit(options, (windyAPI: any) => {
      const { map } = windyAPI;
      mapRef.current = map;
      windyAPIRef.current = windyAPI;

      // Add disaster markers
      const disasterMarkers: any[] = [];
      disasters.forEach((disaster) => {
        const marker = window.L.marker(
          [disaster.location.latitude, disaster.location.longitude],
          {
            icon: createDisasterIcon(disaster.severity, disaster.status),
          }
        );

        const popupContent = `
          <div class="p-3 max-w-xs">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-base">${disaster.title}</h3>
              <span class="px-2 py-1 rounded text-xs font-medium text-white ${
                disaster.status === "active"
                  ? "bg-red-500"
                  : disaster.status === "monitoring"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }">
                ${disaster.status.toUpperCase()}
              </span>
            </div>
            <div class="space-y-1 text-xs">
              <p><strong>Type:</strong> ${
                disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)
              }</p>
              <p><strong>Severity:</strong> <span class="font-medium ${
                disaster.severity === "critical"
                  ? "text-red-600"
                  : disaster.severity === "high"
                  ? "text-orange-600"
                  : disaster.severity === "medium"
                  ? "text-amber-600"
                  : "text-green-600"
              }">${disaster.severity.toUpperCase()}</span></p>
              <p><strong>Affected People:</strong> ${disaster.affectedPeople.toLocaleString()}</p>
              <p><strong>Water Level:</strong> ${disaster.waterLevel}m</p>
              <p><strong>Location:</strong> ${disaster.location.address}</p>
              <p><strong>Reported:</strong> ${formatDate(
                disaster.reportedAt
              )}</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (
          filters.disasters.showAll &&
          filters.disasters.severities.includes(disaster.severity) &&
          filters.disasters.statuses.includes(disaster.status)
        ) {
          marker.addTo(map);
        }

        disasterMarkers.push(marker);
      });

      // Add rain accumulation markers
      const rainMarkers: any[] = [];
      rainStations.forEach((station) => {
        const marker = window.L.marker(
          [station.location.latitude, station.location.longitude],
          {
            icon: createRainIcon(station),
          }
        );

        const rainPopupContent = `
          <div class="p-3 max-w-xs">
            <h3 class="font-medium text-base mb-2">Rain Station</h3>
            <div class="space-y-1 text-xs">
              <p><strong>Accumulation:</strong> ${
                station.rainAccumulation
              }mm</p>
              <p><strong>Intensity:</strong> <span class="font-medium ${
                station.intensity === "extreme"
                  ? "text-red-900"
                  : station.intensity === "heavy"
                  ? "text-red-600"
                  : station.intensity === "moderate"
                  ? "text-blue-600"
                  : "text-cyan-500"
              }">${station.intensity.toUpperCase()}</span></p>
              <p><strong>Location:</strong> ${station.location.address}</p>
            </div>
          </div>
        `;

        marker.bindPopup(rainPopupContent);

        if (
          filters.rainStations.showAll &&
          filters.rainStations.intensities.includes(station.intensity)
        ) {
          marker.addTo(map);
        }

        rainMarkers.push(marker);
      });

      setDisasterMarkersRef(disasterMarkers);
      setRainMarkersRef(rainMarkers);
    });
  };

  const changeToRainMap = () => {
    if (windyAPIRef.current) {
      const { store } = windyAPIRef.current;
      store.set("overlay", "rain");
      setCurrentOverlay("rain");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error entering fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Update markers visibility when filters change
  useEffect(() => {
    if (!mapRef.current) return;

    // Update disaster markers
    disasterMarkersRef.forEach((marker, index) => {
      const disaster = disasters[index];
      if (!disaster) return;

      const shouldShow =
        filters.disasters.showAll &&
        filters.disasters.severities.includes(disaster.severity) &&
        filters.disasters.statuses.includes(disaster.status);

      if (shouldShow && !mapRef.current.hasLayer(marker)) {
        marker.addTo(mapRef.current);
      } else if (!shouldShow && mapRef.current.hasLayer(marker)) {
        mapRef.current.removeLayer(marker);
      }
    });

    // Update rain station markers
    rainMarkersRef.forEach((marker, index) => {
      const station = rainStations[index];
      if (!station) return;

      const shouldShow =
        filters.rainStations.showAll &&
        filters.rainStations.intensities.includes(station.intensity);

      if (shouldShow && !mapRef.current.hasLayer(marker)) {
        marker.addTo(mapRef.current);
      } else if (!shouldShow && mapRef.current.hasLayer(marker)) {
        mapRef.current.removeLayer(marker);
      }
    });
  }, [filters, disasterMarkersRef, rainMarkersRef, disasters, rainStations]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={`w-full h-[80vh] rounded-lg overflow-hidden border relative ${className} ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : ""
      }`}
    >
      <div className="absolute top-2 left-2 z-[9999] bg-white/90 rounded shadow-lg">
        <div className="flex items-center justify-between p-2">
          <div className="text-xs font-semibold">Filters</div>
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
          <div className="px-2 pb-2 space-y-2">
            <div className="space-y-1">
              <Button
                onClick={toggleDisasterVisibility}
                variant={filters.disasters.showAll ? "default" : "outline"}
                size="sm"
                className="text-xs h-6"
              >
                Disasters {filters.disasters.showAll ? "ON" : "OFF"}
              </Button>

              <Button
                onClick={toggleRainStationVisibility}
                variant={filters.rainStations.showAll ? "default" : "outline"}
                size="sm"
                className="text-xs h-6"
              >
                Rain Stations {filters.rainStations.showAll ? "ON" : "OFF"}
              </Button>
            </div>

            {filters.disasters.showAll && (
              <div className="space-y-1">
                <div className="text-xs font-medium">Severity:</div>
                <div className="flex flex-wrap gap-1">
                  {["critical", "high", "medium", "low"].map((severity) => (
                    <Badge
                      key={severity}
                      variant={
                        filters.disasters.severities.includes(
                          severity as DisasterSeverity
                        )
                          ? "default"
                          : "outline"
                      }
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        updateDisasterFilters(
                          "severity",
                          severity,
                          !filters.disasters.severities.includes(
                            severity as DisasterSeverity
                          )
                        )
                      }
                    >
                      {severity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {filters.rainStations.showAll && (
              <div className="space-y-1">
                <div className="text-xs font-medium">Rain Intensity:</div>
                <div className="flex flex-wrap gap-1">
                  {["extreme", "heavy", "moderate", "light"].map(
                    (intensity) => (
                      <Badge
                        key={intensity}
                        variant={
                          filters.rainStations.intensities.includes(
                            intensity as RainStation["intensity"]
                          )
                            ? "default"
                            : "outline"
                        }
                        className="text-xs cursor-pointer"
                        onClick={() =>
                          updateRainFilters(
                            intensity as RainStation["intensity"],
                            !filters.rainStations.intensities.includes(
                              intensity as RainStation["intensity"]
                            )
                          )
                        }
                      >
                        {intensity}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 z-[9999] flex gap-2">
        <button
          onClick={changeToRainMap}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow-lg transition-colors duration-200 relative z-[10000]"
        >
          Change to Rain Map
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium shadow-lg transition-colors duration-200 relative z-[10000]"
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      <div ref={mapContainerRef} className="w-full h-full relative z-0" />
    </div>
  );
};
