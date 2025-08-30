import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin,
  AlertTriangle,
  Users,
  Shield,
  Truck,
  Activity,
  Clock,
  CheckCircle,
  X,
  Navigation,
  Car,
  Home,
  Building,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SOSReport {
  id: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  type: 'medical' | 'rescue' | 'evacuation' | 'infrastructure' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'verified' | 'dispatched' | 'resolved' | 'false_alarm'
  reporter: {
    name: string
    phone: string
    verified: boolean
  }
  description: string
  media?: string[]
  peopleCount?: number
  response?: {
    teamAssigned: string
    estimatedArrival: string
    notes: string
  }
}

interface EmergencyResource {
  id: string
  type: 'ambulance' | 'fire_truck' | 'police' | 'rescue_team' | 'shelter'
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  status: 'available' | 'deployed' | 'maintenance' | 'offline'
  capacity: number
  currentLoad: number
  lastUpdate: string
}

interface RoadStatus {
  id: string
  name: string
  status: 'open' | 'congested' | 'blocked' | 'closed'
  reason?: string
  alternativeRoute?: string
  estimatedClearTime?: string
  location: {
    startLat: number
    startLng: number
    endLat: number
    endLng: number
  }
}

interface ShelterInfo {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  capacity: number
  currentOccupancy: number
  status: 'operational' | 'full' | 'maintenance' | 'evacuating'
  facilities: string[]
  contact: string
}

interface LiveSituationMapProps {
  selectedArea: string
  isEmergency?: boolean
  onSOSResponse?: (sosId: string, action: 'verify' | 'dispatch' | 'resolve' | 'false_alarm') => void
}

export const LiveSituationMap: React.FC<LiveSituationMapProps> = ({
  selectedArea,
  isEmergency = true,
  onSOSResponse
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSOS, setSelectedSOS] = useState<SOSReport | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const [sosReports] = useState<SOSReport[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      location: { latitude: 16.0544, longitude: 108.2022, address: 'Hai Chau District, Da Nang' },
      type: 'rescue',
      severity: 'critical',
      status: 'verified',
      reporter: { name: 'Nguyen Van A', phone: '+84-905-123-456', verified: true },
      description: 'Family of 4 trapped on second floor due to rising flood water',
      peopleCount: 4,
      response: {
        teamAssigned: 'Rescue Team Alpha',
        estimatedArrival: '15 minutes',
        notes: 'Boat rescue in progress'
      }
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 180000).toISOString(),
      location: { latitude: 16.0624, longitude: 108.2122, address: 'Son Tra District, Da Nang' },
      type: 'medical',
      severity: 'high',
      status: 'dispatched',
      reporter: { name: 'Tran Thi B', phone: '+84-912-789-123', verified: true },
      description: 'Elderly person needs medical assistance, diabetic emergency',
      peopleCount: 1,
      response: {
        teamAssigned: 'Ambulance Unit 3',
        estimatedArrival: '8 minutes',
        notes: 'Medical supplies prepared'
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      location: { latitude: 16.0444, longitude: 108.1922, address: 'Thanh Khe District, Da Nang' },
      type: 'evacuation',
      severity: 'medium',
      status: 'pending',
      reporter: { name: 'Le Van C', phone: '+84-903-456-789', verified: false },
      description: 'Apartment building needs evacuation, water level rising',
      peopleCount: 12
    }
  ])

  const [emergencyResources] = useState<EmergencyResource[]>([
    {
      id: '1',
      type: 'ambulance',
      name: 'Ambulance Unit 1',
      location: { latitude: 16.0644, longitude: 108.2222, address: 'Da Nang Hospital' },
      status: 'available',
      capacity: 2,
      currentLoad: 0,
      lastUpdate: new Date().toISOString()
    },
    {
      id: '2',
      type: 'fire_truck',
      name: 'Fire Engine 5',
      location: { latitude: 16.0544, longitude: 108.2122, address: 'Fire Station 2' },
      status: 'deployed',
      capacity: 8,
      currentLoad: 6,
      lastUpdate: new Date().toISOString()
    },
    {
      id: '3',
      type: 'rescue_team',
      name: 'Rescue Team Alpha',
      location: { latitude: 16.0594, longitude: 108.2072, address: 'En Route - Hai Chau' },
      status: 'deployed',
      capacity: 12,
      currentLoad: 4,
      lastUpdate: new Date().toISOString()
    }
  ])

  const [roadStatus] = useState<RoadStatus[]>([
    {
      id: '1',
      name: 'Tran Phu Street',
      status: 'blocked',
      reason: 'Flooding - 0.8m water level',
      alternativeRoute: 'Use Nguyen Van Linh Street',
      estimatedClearTime: '4-6 hours',
      location: { startLat: 16.0544, startLng: 108.2022, endLat: 16.0644, endLng: 108.2122 }
    },
    {
      id: '2',
      name: 'Bach Dang Bridge',
      status: 'congested',
      reason: 'Heavy evacuation traffic',
      alternativeRoute: 'Dragon Bridge recommended',
      location: { startLat: 16.0724, startLng: 108.2182, endLat: 16.0784, endLng: 108.2242 }
    }
  ])

  const [shelters] = useState<ShelterInfo[]>([
    {
      id: '1',
      name: 'Community Center A',
      location: { latitude: 16.0744, longitude: 108.2342, address: 'Hai Chau Community Center' },
      capacity: 200,
      currentOccupancy: 85,
      status: 'operational',
      facilities: ['Food', 'Medical Aid', 'Children Area'],
      contact: '+84-511-123-456'
    },
    {
      id: '2',
      name: 'School Gymnasium B',
      location: { latitude: 16.0644, longitude: 108.2442, address: 'Nguyen Du School' },
      capacity: 150,
      currentOccupancy: 142,
      status: 'operational',
      facilities: ['Food', 'Basic Medical'],
      contact: '+84-511-789-123'
    }
  ])

  const handleSOSAction = (sosId: string, action: 'verify' | 'dispatch' | 'resolve' | 'false_alarm') => {
    if (onSOSResponse) {
      onSOSResponse(sosId, action)
    }
    // Update local state or trigger refresh
    console.log(`SOS ${sosId} action: ${action}`)
  }

  const refreshData = () => {
    setLastUpdate(new Date())
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified': return 'bg-blue-100 text-blue-800'
      case 'dispatched': return 'bg-purple-100 text-purple-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'false_alarm': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSOSIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Shield className="h-4 w-4" />
      case 'rescue': return <Users className="h-4 w-4" />
      case 'evacuation': return <Home className="h-4 w-4" />
      case 'infrastructure': return <Building className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Shield className="h-4 w-4" />
      case 'fire_truck': return <Truck className="h-4 w-4" />
      case 'police': return <Car className="h-4 w-4" />
      case 'rescue_team': return <Users className="h-4 w-4" />
      case 'shelter': return <Home className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const pendingSOS = sosReports.filter(s => s.status === 'pending').length
  const activeSOS = sosReports.filter(s => ['verified', 'dispatched'].includes(s.status)).length
  const availableResources = emergencyResources.filter(r => r.status === 'available').length
  const blockedRoads = roadStatus.filter(r => r.status === 'blocked').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Navigation className="h-6 w-6 text-blue-600" />
            Live Situation Map
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time emergency coordination for {selectedArea}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isEmergency ? "destructive" : "outline"} className="animate-pulse">
            {isEmergency ? "ACTIVE EMERGENCY" : "MONITORING"}
          </Badge>
          <Button onClick={refreshData} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={pendingSOS > 0 ? "border-red-300 bg-red-50/50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending SOS
                </p>
                <p className="text-2xl font-bold text-red-600">{pendingSOS}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Responses
                </p>
                <p className="text-2xl font-bold text-orange-600">{activeSOS}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Available Resources
                </p>
                <p className="text-2xl font-bold text-green-600">{availableResources}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Blocked Roads
                </p>
                <p className="text-2xl font-bold text-gray-700">{blockedRoads}</p>
              </div>
              <Car className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Real-time Situation Map</span>
                <Badge variant="outline">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={mapContainerRef} className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Interactive map with live SOS reports, resources, and road conditions
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Map integration with Windy API, SOS markers, and resource locations
                  </p>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical SOS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Available Resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Blocked Roads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Shelters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="sos" className="text-xs">SOS</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
              <TabsTrigger value="roads" className="text-xs">Roads</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Emergency Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total SOS Reports</span>
                    <Badge variant="outline">{sosReports.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Teams</span>
                    <Badge variant="outline">{emergencyResources.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shelter Capacity</span>
                    <Badge variant="outline">
                      {shelters.reduce((acc, s) => acc + (s.capacity - s.currentOccupancy), 0)} available
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>Rescue team dispatched to Hai Chau</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>Medical emergency verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>Road closure: Tran Phu Street</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SOS Tab */}
            <TabsContent value="sos" className="space-y-3">
              {sosReports.slice(0, 3).map(sos => (
                <Card key={sos.id} className="hover:shadow-md transition-all cursor-pointer"
                     onClick={() => setSelectedSOS(sos)}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSOSIcon(sos.type)}
                        <span className="font-medium text-sm capitalize">{sos.type}</span>
                      </div>
                      <Badge className={getSeverityColor(sos.severity)} variant="outline">
                        {sos.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {sos.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(sos.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge className={getStatusColor(sos.status)} variant="outline">
                        {sos.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {sos.status === 'pending' && (
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" className="h-6 text-xs" 
                               onClick={(e) => {e.stopPropagation(); handleSOSAction(sos.id, 'verify')}}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs"
                               onClick={(e) => {e.stopPropagation(); handleSOSAction(sos.id, 'false_alarm')}}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-3">
              {emergencyResources.map(resource => (
                <Card key={resource.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <span className="font-medium text-sm">{resource.name}</span>
                      </div>
                      <Badge variant={resource.status === 'available' ? 'outline' : 'secondary'}>
                        {resource.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Capacity</span>
                        <span>{resource.currentLoad}/{resource.capacity}</span>
                      </div>
                      <Progress 
                        value={(resource.currentLoad / resource.capacity) * 100} 
                        className="h-1" 
                      />
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-2">{resource.location.address}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Roads Tab */}
            <TabsContent value="roads" className="space-y-3">
              {roadStatus.map(road => (
                <Card key={road.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{road.name}</span>
                      <Badge variant={
                        road.status === 'blocked' ? 'destructive' :
                        road.status === 'congested' ? 'secondary' : 'outline'
                      }>
                        {road.status}
                      </Badge>
                    </div>
                    
                    {road.reason && (
                      <p className="text-xs text-gray-600 mb-1">{road.reason}</p>
                    )}
                    
                    {road.alternativeRoute && (
                      <p className="text-xs text-blue-600">
                        Alternative: {road.alternativeRoute}
                      </p>
                    )}
                    
                    {road.estimatedClearTime && (
                      <p className="text-xs text-orange-600 mt-1">
                        Est. clear: {road.estimatedClearTime}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* SOS Detail Modal */}
      {selectedSOS && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSOS(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">SOS Report Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSOS(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getSOSIcon(selectedSOS.type)}
                <span className="capitalize font-medium">{selectedSOS.type} Emergency</span>
                <Badge className={getSeverityColor(selectedSOS.severity)}>
                  {selectedSOS.severity.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSOS.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Reporter:</span>
                  <p className="font-medium">{selectedSOS.reporter.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">People:</span>
                  <p className="font-medium">{selectedSOS.peopleCount || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(selectedSOS.status)}>
                    {selectedSOS.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <p className="font-medium text-xs">
                    {new Date(selectedSOS.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedSOS.response && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Response Status
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Team:</strong> {selectedSOS.response.teamAssigned}</p>
                    <p><strong>ETA:</strong> {selectedSOS.response.estimatedArrival}</p>
                    <p><strong>Notes:</strong> {selectedSOS.response.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {selectedSOS.status === 'pending' && (
                  <>
                    <Button onClick={() => handleSOSAction(selectedSOS.id, 'verify')} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify & Dispatch
                    </Button>
                    <Button variant="outline" onClick={() => handleSOSAction(selectedSOS.id, 'false_alarm')}>
                      <X className="h-4 w-4 mr-2" />
                      False Alarm
                    </Button>
                  </>
                )}
                {selectedSOS.status === 'dispatched' && (
                  <Button onClick={() => handleSOSAction(selectedSOS.id, 'resolve')} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedSOS(null)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}