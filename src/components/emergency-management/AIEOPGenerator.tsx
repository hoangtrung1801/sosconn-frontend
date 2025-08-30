import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cpu, 
  FileText, 
  Settings, 
  CheckCircle, 
  Users,
  MapPin,
  Clock,
  Target,
  Shield,
  Edit,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface EOPGenerationParams {
  disasterType: 'flood' | 'landslide' | 'storm' | 'earthquake' | 'drought' | 'wildfire'
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedArea: string
  population: number
  timeframe: 'immediate' | 'short' | 'medium' | 'long'
  resources: string[]
  priorities: string[]
  specialConsiderations: string
}

interface GeneratedEOP {
  id: string
  title: string
  status: 'generating' | 'draft' | 'review' | 'approved'
  progress: number
  generatedAt: string
  objectives: {
    primary: string[]
    secondary: string[]
  }
  evacuationRoutes: {
    id: string
    name: string
    capacity: number
    estimatedTime: string
    status: 'clear' | 'congested' | 'blocked'
  }[]
  resourceAllocation: {
    category: string
    items: {
      name: string
      quantity: number
      location: string
      assignedTo: string
    }[]
  }[]
  agencyAssignments: {
    agency: string
    role: string
    contact: string
    responsibilities: string[]
  }[]
  timeline: {
    phase: string
    duration: string
    actions: string[]
  }[]
  confidence: number
}

interface AIEOPGeneratorProps {
  selectedArea: string
  isEmergency?: boolean
  emergencyType?: string
  onEOPGenerated?: (eop: GeneratedEOP) => void
}

export const AIEOPGenerator: React.FC<AIEOPGeneratorProps> = ({
  selectedArea,
  isEmergency = false,
  emergencyType = '',
  onEOPGenerated
}) => {
  const [activeTab, setActiveTab] = useState('parameters')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEOP, setGeneratedEOP] = useState<GeneratedEOP | null>(null)
  
  const [params, setParams] = useState<EOPGenerationParams>({
    disasterType: isEmergency ? (emergencyType.toLowerCase().includes('flood') ? 'flood' : 'storm') as EOPGenerationParams['disasterType'] : 'flood',
    severity: isEmergency ? 'high' : 'medium',
    affectedArea: selectedArea,
    population: 250000,
    timeframe: isEmergency ? 'immediate' : 'short',
    resources: ['Emergency Shelters', 'Rescue Teams', 'Medical Supplies', 'Communication Equipment'],
    priorities: ['Life Safety', 'Property Protection', 'Environmental Protection'],
    specialConsiderations: ''
  })

  const handleGenerateEOP = async () => {
    setIsGenerating(true)
    setActiveTab('preview')
    
    // Simulate AI generation process
    const newEOP: GeneratedEOP = {
      id: `eop-${Date.now()}`,
      title: `Emergency Operation Plan - ${params.disasterType.toUpperCase()} Response for ${params.affectedArea}`,
      status: 'generating',
      progress: 0,
      generatedAt: new Date().toISOString(),
      objectives: {
        primary: [
          'Ensure public safety and minimize casualties',
          'Coordinate emergency response activities',
          'Maintain critical infrastructure operations'
        ],
        secondary: [
          'Minimize economic impact',
          'Protect environmental resources',
          'Support community recovery efforts'
        ]
      },
      evacuationRoutes: [
        {
          id: '1',
          name: 'Route A - Coastal Highway',
          capacity: 5000,
          estimatedTime: '45 minutes',
          status: 'clear'
        },
        {
          id: '2', 
          name: 'Route B - Inner City Roads',
          capacity: 3500,
          estimatedTime: '1 hour 15 minutes',
          status: 'congested'
        }
      ],
      resourceAllocation: [
        {
          category: 'Emergency Shelters',
          items: [
            { name: 'Community Center A', quantity: 1, location: 'District 1', assignedTo: 'Red Cross' },
            { name: 'School Gymnasium', quantity: 3, location: 'District 2', assignedTo: 'Local Government' }
          ]
        },
        {
          category: 'Rescue Teams', 
          items: [
            { name: 'Fire Department Units', quantity: 8, location: 'Station 1-4', assignedTo: 'Fire Department' },
            { name: 'Police Response Teams', quantity: 12, location: 'Various Precincts', assignedTo: 'Police Department' }
          ]
        }
      ],
      agencyAssignments: [
        {
          agency: 'Fire Department',
          role: 'Primary Response',
          contact: '+84-555-0101',
          responsibilities: ['Search and rescue operations', 'Emergency medical response', 'Hazmat containment']
        },
        {
          agency: 'Police Department',
          role: 'Security & Traffic',
          contact: '+84-555-0102', 
          responsibilities: ['Traffic control', 'Evacuation coordination', 'Public safety enforcement']
        },
        {
          agency: 'Red Cross Vietnam',
          role: 'Humanitarian Support',
          contact: '+84-555-0103',
          responsibilities: ['Shelter management', 'Food distribution', 'Medical aid']
        }
      ],
      timeline: [
        {
          phase: 'Immediate Response (0-6 hours)',
          duration: '6 hours',
          actions: [
            'Activate Emergency Operations Center',
            'Issue public warnings and evacuation orders',
            'Deploy initial response teams'
          ]
        },
        {
          phase: 'Short-term Response (6-72 hours)',
          duration: '66 hours',
          actions: [
            'Continue search and rescue operations',
            'Establish temporary shelters',
            'Assess damage and infrastructure'
          ]
        }
      ],
      confidence: 85
    }

    setGeneratedEOP(newEOP)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGeneratedEOP(prev => {
        if (!prev) return prev
        const newProgress = Math.min(prev.progress + 10, 100)
        const updatedEOP = { ...prev, progress: newProgress }
        
        if (newProgress >= 100) {
          updatedEOP.status = 'draft'
          setIsGenerating(false)
          clearInterval(progressInterval)
          if (onEOPGenerated) {
            onEOPGenerated(updatedEOP)
          }
        }
        
        return updatedEOP
      })
    }, 500)
  }

  const handleApproveEOP = () => {
    if (generatedEOP) {
      const approvedEOP = { ...generatedEOP, status: 'approved' as const }
      setGeneratedEOP(approvedEOP)
      if (onEOPGenerated) {
        onEOPGenerated(approvedEOP)
      }
    }
  }

  const getStatusColor = (status: GeneratedEOP['status']) => {
    switch (status) {
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Cpu className="h-6 w-6 text-purple-600" />
            AI Emergency Operation Plan Generator
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive EOPs with AI-powered analysis and recommendations
          </p>
        </div>
        {isEmergency && (
          <Badge variant="destructive" className="animate-pulse">
            EMERGENCY MODE
          </Badge>
        )}
      </div>

      {/* Generation Status */}
      {generatedEOP && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {generatedEOP.title}
              </h3>
            </div>
            <Badge className={getStatusColor(generatedEOP.status)}>
              {generatedEOP.status.toUpperCase()}
            </Badge>
          </div>
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Generating EOP...
                </span>
                <span className="text-sm font-medium">
                  {generatedEOP.progress}%
                </span>
              </div>
              <Progress value={generatedEOP.progress} className="h-2" />
            </div>
          )}

          {generatedEOP.status === 'draft' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  EOP Generation Complete (Confidence: {generatedEOP.confidence}%)
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" onClick={handleApproveEOP}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="parameters">Generation Parameters</TabsTrigger>
          <TabsTrigger value="preview">EOP Preview</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
        </TabsList>

        {/* Parameters Tab */}
        <TabsContent value="parameters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                EOP Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disaster Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Disaster Type</Label>
                  <RadioGroup
                    value={params.disasterType}
                    onValueChange={(value) => setParams(prev => ({ ...prev, disasterType: value as EOPGenerationParams['disasterType'] }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    {['flood', 'landslide', 'storm', 'earthquake', 'drought', 'wildfire'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="capitalize cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Severity */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Severity Level</Label>
                  <RadioGroup
                    value={params.severity}
                    onValueChange={(value) => setParams(prev => ({ ...prev, severity: value as EOPGenerationParams['severity'] }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    {['low', 'medium', 'high', 'critical'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="capitalize cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Affected Area */}
                <div className="space-y-2">
                  <Label htmlFor="area">Affected Area</Label>
                  <Input
                    id="area"
                    value={params.affectedArea}
                    onChange={(e) => setParams(prev => ({ ...prev, affectedArea: e.target.value }))}
                  />
                </div>

                {/* Population */}
                <div className="space-y-2">
                  <Label htmlFor="population">Estimated Population</Label>
                  <Input
                    id="population"
                    type="number"
                    value={params.population}
                    onChange={(e) => setParams(prev => ({ ...prev, population: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                {/* Timeframe */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Response Timeframe</Label>
                  <RadioGroup
                    value={params.timeframe}
                    onValueChange={(value) => setParams(prev => ({ ...prev, timeframe: value as EOPGenerationParams['timeframe'] }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    {['immediate', 'short', 'medium', 'long'].map(time => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={time} />
                        <Label htmlFor={time} className="capitalize cursor-pointer">
                          {time} term
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Special Considerations */}
              <div className="space-y-2">
                <Label htmlFor="considerations">Special Considerations</Label>
                <Textarea
                  id="considerations"
                  placeholder="Enter any special considerations, vulnerable populations, or unique circumstances..."
                  value={params.specialConsiderations}
                  onChange={(e) => setParams(prev => ({ ...prev, specialConsiderations: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateEOP}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating EOP...
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4 mr-2" />
                    Generate Emergency Operation Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          {generatedEOP ? (
            <div className="space-y-4">
              {/* Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Mission Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Primary Objectives</h4>
                    <ul className="space-y-1">
                      {generatedEOP.objectives.primary.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Secondary Objectives</h4>
                    <ul className="space-y-1">
                      {generatedEOP.objectives.secondary.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Evacuation Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    Evacuation Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedEOP.evacuationRoutes.map(route => (
                      <div key={route.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{route.name}</h4>
                          <p className="text-sm text-gray-600">
                            Capacity: {route.capacity.toLocaleString()} people • Est. time: {route.estimatedTime}
                          </p>
                        </div>
                        <Badge variant={
                          route.status === 'clear' ? 'outline' :
                          route.status === 'congested' ? 'secondary' : 'destructive'
                        }>
                          {route.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agency Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Agency Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedEOP.agencyAssignments.map((agency, idx) => (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{agency.agency}</h4>
                          <Badge variant="outline">{agency.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Contact: {agency.contact}</p>
                        <ul className="text-sm space-y-1">
                          {agency.responsibilities.map((resp, ridx) => (
                            <li key={ridx} className="flex items-start gap-2">
                              <Shield className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="lg">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Plan
                </Button>
                {generatedEOP.status === 'draft' && (
                  <Button onClick={handleApproveEOP} size="lg" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Activate
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Cpu className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No EOP Generated Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your parameters and generate an Emergency Operation Plan using AI
                </p>
                <Button onClick={() => setActiveTab('parameters')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Parameters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Generation History
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Previous AI-generated EOPs will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}