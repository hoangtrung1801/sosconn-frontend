import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Users } from "lucide-react"

type AreaInfo = {
  id: string
  name: string
  description: string
  population: string
  riskLevel: "high" | "medium" | "low"
  emergencyType: string
  coordinates?: string
}

const DANANG_AREAS: AreaInfo[] = [
  {
    id: "hai-chau",
    name: "Hải Châu District",
    description: "Central business district with high population density",
    population: "206,000",
    riskLevel: "high",
    emergencyType: "Urban Flooding",
    coordinates: "16.0544° N, 108.2022° E"
  },
  {
    id: "son-tra",
    name: "Sơn Trà District", 
    description: "Peninsula area with beaches and resorts",
    population: "152,000",
    riskLevel: "medium",
    emergencyType: "Storm Surge",
    coordinates: "16.1012° N, 108.2652° E"
  },
  {
    id: "thanh-khe",
    name: "Thanh Khê District",
    description: "Educational and residential hub",
    population: "190,000",
    riskLevel: "high",
    emergencyType: "Flash Flooding",
    coordinates: "16.0755° N, 108.1598° E"
  },
  {
    id: "cam-le",
    name: "Cẩm Lệ District",
    description: "Industrial and agricultural area",
    population: "95,000",
    riskLevel: "medium",
    emergencyType: "River Flooding",
    coordinates: "16.0277° N, 108.1511° E"
  },
  {
    id: "lien-chieu",
    name: "Liên Chiểu District",
    description: "Expanding urban area with new developments",
    population: "178,000", 
    riskLevel: "medium",
    emergencyType: "Urban Flooding",
    coordinates: "16.0864° N, 108.1436° E"
  },
  {
    id: "ngu-hanh-son",
    name: "Ngũ Hành Sơn District",
    description: "Tourist area with marble mountains",
    population: "73,000",
    riskLevel: "low",
    emergencyType: "Landslide Risk",
    coordinates: "15.9925° N, 108.2519° E"
  }
]

const getRiskColor = (level: string) => {
  switch (level) {
    case "high": return "bg-red-100 text-red-800 border-red-200"
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200" 
    case "low": return "bg-green-100 text-green-800 border-green-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function AreaSelector() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId)
  }

  const handleProceed = () => {
    if (selectedArea) {
      navigate({
        to: "/emergency-management",
        search: { area: selectedArea }
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Area Selection</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the Da Nang district where you need to manage emergency operations. 
            Each area has specific emergency response plans and resources.
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">
              ⚠️ ACTIVE EMERGENCY: Severe Flooding in Da Nang City
            </p>
          </div>
        </div>

        {/* Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DANANG_AREAS.map((area) => (
            <Card 
              key={area.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedArea === area.id 
                  ? "ring-2 ring-red-500 shadow-lg" 
                  : "hover:shadow-md"
              }`}
              onClick={() => handleAreaSelect(area.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {area.name}
                  </CardTitle>
                  <Badge className={`${getRiskColor(area.riskLevel)} text-xs font-medium`}>
                    {area.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  {area.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4" />
                  <span>Population: {area.population}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>{area.coordinates}</span>
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Current Emergency:</p>
                  <p className="text-sm text-red-700">{area.emergencyType}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedArea && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Selected Area</h3>
            <p className="text-blue-800">
              You have selected <strong>{DANANG_AREAS.find(a => a.id === selectedArea)?.name}</strong> for emergency management operations.
            </p>
            <p className="text-sm text-blue-700 mt-1">
              You will access the specific Emergency Operations Plan (EOP) for this area.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="px-6 py-3"
          >
            Go Back
          </Button>
          <Button
            onClick={handleProceed}
            disabled={!selectedArea}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Proceed to Emergency Management
          </Button>
        </div>
      </div>
    </div>
  )
}