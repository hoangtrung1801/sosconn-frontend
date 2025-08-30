import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  CloudRain, 
  Zap, 
  Wind, 
  Thermometer, 
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Waves,
  Mountain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  visibility: number
  pressure: number
  uvIndex: number
}

interface HazardForecast {
  id: string
  type: 'flood' | 'landslide' | 'storm' | 'drought' | 'earthquake'
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number
  timeframe: string
  location: string
  description: string
  lastUpdated: string
  trend: 'increasing' | 'decreasing' | 'stable'
}

interface VulnerabilityData {
  population: {
    total: number
    vulnerable: number
    children: number
    elderly: number
    disabled: number
  }
  infrastructure: {
    hospitals: number
    schools: number
    bridges: number
    shelters: number
    evacuation_routes: number
  }
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface SensorData {
  id: string
  type: 'water_level' | 'rainfall' | 'seismic' | 'weather'
  location: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  lastUpdate: string
}

interface RiskDashboardProps {
  selectedArea: string
  isLoading?: boolean
}

const getHazardIcon = (type: HazardForecast['type']) => {
  switch (type) {
    case 'flood': return <Waves className="h-5 w-5" />
    case 'landslide': return <Mountain className="h-5 w-5" />
    case 'storm': return <Wind className="h-5 w-5" />
    case 'drought': return <Thermometer className="h-5 w-5" />
    case 'earthquake': return <Zap className="h-5 w-5" />
    default: return <AlertTriangle className="h-5 w-5" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-300'
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low': return 'bg-green-100 text-green-800 border-green-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getTrendIcon = (trend: HazardForecast['trend']) => {
  switch (trend) {
    case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />
    case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-600" />
    default: return <div className="h-4 w-4" />
  }
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ 
  selectedArea, 
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('forecasts')
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    windDirection: 'NE',
    precipitation: 0,
    visibility: 10,
    pressure: 1013,
    uvIndex: 6
  })

  const [hazardForecasts] = useState<HazardForecast[]>([
    {
      id: '1',
      type: 'flood',
      severity: 'high',
      probability: 75,
      timeframe: '6-12 hours',
      location: 'Hai Chau District',
      description: 'Heavy rainfall expected, potential flash flooding in low-lying areas',
      lastUpdated: new Date().toISOString(),
      trend: 'increasing'
    },
    {
      id: '2',
      type: 'landslide',
      severity: 'medium',
      probability: 45,
      timeframe: '24-48 hours',
      location: 'Son Tra Peninsula',
      description: 'Saturated soil conditions increase landslide risk on steep slopes',
      lastUpdated: new Date().toISOString(),
      trend: 'stable'
    },
    {
      id: '3',
      type: 'storm',
      severity: 'critical',
      probability: 90,
      timeframe: '2-4 hours',
      location: 'Coastal areas',
      description: 'Severe thunderstorm with high winds and heavy precipitation approaching',
      lastUpdated: new Date().toISOString(),
      trend: 'increasing'
    }
  ])

  const [vulnerabilityData] = useState<VulnerabilityData>({
    population: {
      total: 1230000,
      vulnerable: 185000,
      children: 225000,
      elderly: 98000,
      disabled: 62000
    },
    infrastructure: {
      hospitals: 45,
      schools: 312,
      bridges: 128,
      shelters: 67,
      evacuation_routes: 89
    },
    riskLevel: 'high'
  })

  const [sensorData] = useState<SensorData[]>([
    {
      id: '1',
      type: 'water_level',
      location: 'Han River Bridge',
      value: 2.8,
      unit: 'm',
      status: 'warning',
      lastUpdate: new Date().toISOString()
    },
    {
      id: '2',
      type: 'rainfall',
      location: 'City Center',
      value: 45.2,
      unit: 'mm/h',
      status: 'critical',
      lastUpdate: new Date().toISOString()
    },
    {
      id: '3',
      type: 'seismic',
      location: 'Son Tra Peninsula',
      value: 2.1,
      unit: 'Richter',
      status: 'normal',
      lastUpdate: new Date().toISOString()
    },
    {
      id: '4',
      type: 'weather',
      location: 'Airport Station',
      value: 85,
      unit: 'km/h',
      status: 'warning',
      lastUpdate: new Date().toISOString()
    }
  ])

  const refreshData = async () => {
    // Simulate data refresh
    setWeatherData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString()
    }))
  }

  const criticalHazards = hazardForecasts.filter(h => h.severity === 'critical')
  const highRiskSensors = sensorData.filter(s => s.status === 'critical' || s.status === 'warning')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Risk Monitoring Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time hazard forecasting and vulnerability assessment for {selectedArea}
          </p>
        </div>
        <Button onClick={refreshData} disabled={isLoading}>
          <Clock className="h-4 w-4 mr-2" />
          {isLoading ? 'Updating...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Critical Alerts */}
      {criticalHazards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Critical Risk Alerts
            </h3>
          </div>
          <div className="space-y-2">
            {criticalHazards.map(hazard => (
              <div key={hazard.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getHazardIcon(hazard.type)}
                  <span className="font-medium text-red-700 dark:text-red-300">
                    {hazard.type.toUpperCase()}: {hazard.description}
                  </span>
                </div>
                <Badge variant="destructive">
                  {hazard.probability}% in {hazard.timeframe}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Hazards
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {hazardForecasts.filter(h => h.severity === 'high' || h.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Risk Level
                </p>
                <Badge className={getSeverityColor(vulnerabilityData.riskLevel)}>
                  {vulnerabilityData.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Vulnerable Pop.
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(vulnerabilityData.population.vulnerable / 1000)}k
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sensor Alerts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {highRiskSensors.length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="forecasts">Hazard Forecasts</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Network</TabsTrigger>
          <TabsTrigger value="vulnerability">Vulnerability</TabsTrigger>
          <TabsTrigger value="weather">Weather Data</TabsTrigger>
        </TabsList>

        {/* Hazard Forecasts Tab */}
        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid gap-4">
            {hazardForecasts.map(hazard => (
              <motion.div
                key={hazard.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className={`border-l-4 ${
                  hazard.severity === 'critical' ? 'border-l-red-500' :
                  hazard.severity === 'high' ? 'border-l-orange-500' :
                  hazard.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-green-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getHazardIcon(hazard.type)}
                        <div>
                          <h3 className="font-semibold text-lg capitalize">
                            {hazard.type} Risk
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hazard.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(hazard.trend)}
                        <Badge className={getSeverityColor(hazard.severity)}>
                          {hazard.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {hazard.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Probability
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={hazard.probability} className="flex-1" />
                          <span className="font-medium">{hazard.probability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Time Frame
                        </p>
                        <p className="font-medium">{hazard.timeframe}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Sensor Network Tab */}
        <TabsContent value="sensors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensorData.map(sensor => (
              <Card key={sensor.id} className={`${
                sensor.status === 'critical' ? 'border-red-300 bg-red-50/50' :
                sensor.status === 'warning' ? 'border-yellow-300 bg-yellow-50/50' :
                'border-green-300 bg-green-50/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">
                      {sensor.type.replace('_', ' ')} Sensor
                    </h3>
                    <Badge variant={
                      sensor.status === 'critical' ? 'destructive' :
                      sensor.status === 'warning' ? 'secondary' : 'outline'
                    }>
                      {sensor.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {sensor.location}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{sensor.value}</span>
                    <span className="text-sm text-gray-600">{sensor.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vulnerability Tab */}
        <TabsContent value="vulnerability" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Population Vulnerability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Population</span>
                    <span className="font-medium">
                      {vulnerabilityData.population.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerable Groups</span>
                    <span className="font-medium text-orange-600">
                      {vulnerabilityData.population.vulnerable.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children (0-17)</span>
                    <span className="font-medium">
                      {vulnerabilityData.population.children.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elderly (65+)</span>
                    <span className="font-medium">
                      {vulnerabilityData.population.elderly.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disabled</span>
                    <span className="font-medium">
                      {vulnerabilityData.population.disabled.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hospitals</span>
                    <span className="font-medium">
                      {vulnerabilityData.infrastructure.hospitals}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schools</span>
                    <span className="font-medium">
                      {vulnerabilityData.infrastructure.schools}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bridges</span>
                    <span className="font-medium">
                      {vulnerabilityData.infrastructure.bridges}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Shelters</span>
                    <span className="font-medium">
                      {vulnerabilityData.infrastructure.shelters}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evacuation Routes</span>
                    <span className="font-medium">
                      {vulnerabilityData.infrastructure.evacuation_routes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weather Data Tab */}
        <TabsContent value="weather" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
                <p className="text-2xl font-bold">{weatherData.humidity}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Wind className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
                <p className="text-2xl font-bold">{weatherData.windSpeed} km/h</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <CloudRain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Precipitation</p>
                <p className="text-2xl font-bold">{weatherData.precipitation} mm</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}