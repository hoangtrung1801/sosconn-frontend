import React, { useState } from 'react'
import { 
  Bot,
  Truck,
  Users,
  Shield,
  Clock,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Car,
  Home,
  Package
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ResourceUnit {
  id: string
  type: 'ambulance' | 'fire_truck' | 'police' | 'rescue_team' | 'shelter' | 'medical_supplies' | 'food_supplies'
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  status: 'available' | 'deployed' | 'maintenance' | 'returning'
  capacity: number
  currentLoad: number
  estimatedAvailable: string
  specializations?: string[]
  equipment?: string[]
}

interface EmergencyRequest {
  id: string
  type: 'rescue' | 'medical' | 'evacuation' | 'fire' | 'shelter' | 'supplies'
  priority: 'low' | 'medium' | 'high' | 'critical'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  description: string
  requiredResources: {
    type: string
    quantity: number
    urgency: 'immediate' | 'urgent' | 'standard'
  }[]
  peopleCount: number
  timeReported: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed'
}

interface AIRecommendation {
  requestId: string
  confidence: number
  recommendations: {
    resourceId: string
    resourceName: string
    reason: string
    eta: string
    efficiency: number
    alternativeOptions?: {
      resourceId: string
      resourceName: string
      eta: string
      note: string
    }[]
  }[]
  warnings?: string[]
  optimizationNotes: string[]
}

interface AIResourceConsoleProps {
  selectedArea: string
  isEmergency?: boolean
}

export const AIResourceConsole: React.FC<AIResourceConsoleProps> = ({
  selectedArea,
  isEmergency = true
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  const [resources] = useState<ResourceUnit[]>([
    {
      id: '1',
      type: 'ambulance',
      name: 'Ambulance Unit A1',
      location: { latitude: 16.0644, longitude: 108.2222, address: 'Da Nang General Hospital' },
      status: 'available',
      capacity: 2,
      currentLoad: 0,
      estimatedAvailable: 'Now',
      specializations: ['ICU Transport', 'Trauma Care'],
      equipment: ['Ventilator', 'Defibrillator', 'IV Supplies']
    },
    {
      id: '2',
      type: 'fire_truck',
      name: 'Fire Engine 2',
      location: { latitude: 16.0544, longitude: 108.2122, address: 'Fire Station Central' },
      status: 'deployed',
      capacity: 8,
      currentLoad: 6,
      estimatedAvailable: '45 minutes',
      specializations: ['Water Rescue', 'High Rise'],
      equipment: ['Water Pumps', 'Rescue Ladders', 'Breathing Apparatus']
    },
    {
      id: '3',
      type: 'rescue_team',
      name: 'Swift Water Rescue Team',
      location: { latitude: 16.0444, longitude: 108.1922, address: 'Emergency Command Center' },
      status: 'available',
      capacity: 6,
      currentLoad: 0,
      estimatedAvailable: 'Now',
      specializations: ['Water Rescue', 'Technical Rescue'],
      equipment: ['Boats', 'Ropes', 'Life Vests']
    },
    {
      id: '4',
      type: 'police',
      name: 'Police Patrol Unit 5',
      location: { latitude: 16.0744, longitude: 108.2322, address: 'Hai Chau Police Station' },
      status: 'available',
      capacity: 4,
      currentLoad: 2,
      estimatedAvailable: 'Now',
      specializations: ['Traffic Control', 'Crowd Management'],
      equipment: ['Traffic Cones', 'Barriers', 'Communication Radio']
    }
  ])

  const [requests] = useState<EmergencyRequest[]>([
    {
      id: '1',
      type: 'rescue',
      priority: 'critical',
      location: { latitude: 16.0544, longitude: 108.2022, address: '123 Tran Phu St, Hai Chau' },
      description: 'Family of 4 trapped in flooding building, water level rising',
      requiredResources: [
        { type: 'rescue_team', quantity: 1, urgency: 'immediate' },
        { type: 'ambulance', quantity: 1, urgency: 'urgent' }
      ],
      peopleCount: 4,
      timeReported: new Date(Date.now() - 300000).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      type: 'medical',
      priority: 'high',
      location: { latitude: 16.0624, longitude: 108.2122, address: '456 Bach Dang St, Son Tra' },
      description: 'Elderly person, cardiac emergency, needs immediate medical attention',
      requiredResources: [
        { type: 'ambulance', quantity: 1, urgency: 'immediate' }
      ],
      peopleCount: 1,
      timeReported: new Date(Date.now() - 180000).toISOString(),
      status: 'pending'
    },
    {
      id: '3',
      type: 'evacuation',
      priority: 'medium',
      location: { latitude: 16.0444, longitude: 108.1922, address: '789 Nguyen Van Linh, Thanh Khe' },
      description: 'Apartment building evacuation needed, 15 residents',
      requiredResources: [
        { type: 'police', quantity: 1, urgency: 'standard' },
        { type: 'shelter', quantity: 1, urgency: 'urgent' }
      ],
      peopleCount: 15,
      timeReported: new Date(Date.now() - 120000).toISOString(),
      status: 'pending'
    }
  ])

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])

  const generateAIRecommendations = async (request: EmergencyRequest) => {
    setIsGeneratingRecommendations(true)
    setSelectedRequest(request)

    // Simulate AI processing
    setTimeout(() => {
      const recommendation: AIRecommendation = {
        requestId: request.id,
        confidence: 92,
        recommendations: [
          {
            resourceId: '3',
            resourceName: 'Swift Water Rescue Team',
            reason: 'Specialized in water rescue, immediately available, closest to location',
            eta: '8 minutes',
            efficiency: 95,
            alternativeOptions: [
              {
                resourceId: '2',
                resourceName: 'Fire Engine 2',
                eta: '45 minutes',
                note: 'Currently deployed but has water rescue capability'
              }
            ]
          },
          {
            resourceId: '1',
            resourceName: 'Ambulance Unit A1',
            reason: 'ICU-equipped, available, trauma care specialization',
            eta: '12 minutes',
            efficiency: 88
          }
        ],
        warnings: ['Weather conditions may affect response time', 'Traffic congestion reported on main routes'],
        optimizationNotes: [
          'Rescue team should depart immediately for best outcome',
          'Ambulance should stage near rescue location',
          'Consider helicopter evacuation if conditions worsen'
        ]
      }

      setAiRecommendations(prev => [...prev.filter(r => r.requestId !== request.id), recommendation])
      setIsGeneratingRecommendations(false)
    }, 3000)
  }

  const deployRecommendation = (requestId: string, resourceIds: string[]) => {
    console.log(`Deploying resources ${resourceIds.join(', ')} for request ${requestId}`)
    // Here you would integrate with the actual resource management system
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Shield className="h-4 w-4" />
      case 'fire_truck': return <Truck className="h-4 w-4" />
      case 'police': return <Car className="h-4 w-4" />
      case 'rescue_team': return <Users className="h-4 w-4" />
      case 'shelter': return <Home className="h-4 w-4" />
      case 'medical_supplies': return <Package className="h-4 w-4" />
      case 'food_supplies': return <Package className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600'
      case 'deployed': return 'text-orange-600'
      case 'maintenance': return 'text-red-600'
      case 'returning': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending').length
  const criticalRequests = requests.filter(r => r.priority === 'critical').length
  const availableResources = resources.filter(r => r.status === 'available').length
  const deployedResources = resources.filter(r => r.status === 'deployed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            AI Resource Allocation Console
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered resource optimization and deployment for {selectedArea}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isEmergency ? "destructive" : "outline"} className="animate-pulse">
            {isEmergency ? "EMERGENCY MODE" : "MONITORING"}
          </Badge>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh AI
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={criticalRequests > 0 ? "border-red-300 bg-red-50/50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Critical Requests
                </p>
                <p className="text-2xl font-bold text-red-600">{criticalRequests}</p>
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
                  Pending Requests
                </p>
                <p className="text-2xl font-bold text-orange-600">{pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Deployed Resources
                </p>
                <p className="text-2xl font-bold text-blue-600">{deployedResources}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests & AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Emergency Requests</span>
                <Badge variant="outline">AI Analysis Ready</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.filter(r => r.status === 'pending').map(request => (
                  <div key={request.id} 
                       className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                       onClick={() => generateAIRecommendations(request)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(request.type)}
                        <span className="font-medium capitalize">{request.type} Request</span>
                      </div>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {request.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{request.location.address}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">People:</span>
                        <p className="font-medium">{request.peopleCount}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Reported: {new Date(request.timeReported).toLocaleTimeString()}
                      </span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Bot className="h-3 w-3 mr-1" />
                        Get AI Suggestions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          {selectedRequest && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  AI Recommendations
                  {isGeneratingRecommendations && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGeneratingRecommendations ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" />
                    <p className="text-lg font-medium mb-2">AI Analyzing Request...</p>
                    <p className="text-sm text-gray-600">
                      Processing resource availability, locations, and optimal deployment
                    </p>
                    <Progress value={66} className="mt-4 max-w-md mx-auto" />
                  </div>
                ) : (
                  (() => {
                    const recommendation = aiRecommendations.find(r => r.requestId === selectedRequest.id)
                    if (!recommendation) return null

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              AI Confidence: {recommendation.confidence}%
                            </span>
                          </div>
                          <Button 
                            onClick={() => deployRecommendation(
                              recommendation.requestId, 
                              recommendation.recommendations.map(r => r.resourceId)
                            )}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Deploy All
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {recommendation.recommendations.map((rec, idx) => (
                            <div key={idx} className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                                  {rec.resourceName}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-green-100">
                                    ETA: {rec.eta}
                                  </Badge>
                                  <Badge variant="outline">
                                    {rec.efficiency}% Match
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                                {rec.reason}
                              </p>

                              {rec.alternativeOptions && rec.alternativeOptions.length > 0 && (
                                <div className="text-xs">
                                  <span className="font-medium">Alternatives: </span>
                                  {rec.alternativeOptions.map((alt, altIdx) => (
                                    <span key={altIdx} className="text-gray-600">
                                      {alt.resourceName} (ETA: {alt.eta})
                                      {altIdx < rec.alternativeOptions!.length - 1 ? ', ' : ''}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {recommendation.warnings && recommendation.warnings.length > 0 && (
                          <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Warnings
                            </h4>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                              {recommendation.warnings.map((warning, idx) => (
                                <li key={idx}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                            Optimization Notes
                          </h4>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            {recommendation.optimizationNotes.map((note, idx) => (
                              <li key={idx}>• {note}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })()
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resource Status Panel */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>AI Engine</span>
                    <Badge variant="outline" className="bg-green-100">Online</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resource Sync</span>
                    <Badge variant="outline" className="bg-green-100">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <Badge variant="outline">Avg 2.3s</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Deployment Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Last 24h</span>
                      <span>47 deployments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-3">
              {resources.slice(0, 4).map(resource => (
                <Card key={resource.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <span className="font-medium text-sm">{resource.name}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs mb-2">
                      <div className="flex justify-between">
                        <span>Capacity</span>
                        <span>{resource.currentLoad}/{resource.capacity}</span>
                      </div>
                      <Progress 
                        value={(resource.currentLoad / resource.capacity) * 100} 
                        className="h-1" 
                      />
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <p>ETA: {resource.estimatedAvailable}</p>
                      <p>{resource.location.address}</p>
                    </div>

                    {resource.specializations && resource.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.specializations.slice(0, 2).map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}