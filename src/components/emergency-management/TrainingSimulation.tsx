import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play,
  Pause,
  RotateCcw,
  Settings,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Waves,
  Mountain,
  Wind,
  Activity,
  BarChart3,
  Award,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SimulationScenario {
  id: string
  name: string
  type: 'flood' | 'landslide' | 'storm' | 'earthquake' | 'multi-hazard'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration: number
  description: string
  objectives: string[]
  participants: number
  location: string
  hazards: {
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    timing: number
  }[]
}

interface SimulationResult {
  scenarioId: string
  score: number
  timeCompleted: number
  decisions: {
    timestamp: number
    decision: string
    outcome: 'success' | 'failure' | 'partial'
    points: number
  }[]
  metrics: {
    responseTime: number
    resourceEfficiency: number
    publicSafety: number
    coordination: number
  }
  feedback: string[]
}

interface TrainingModule {
  id: string
  title: string
  category: 'basics' | 'leadership' | 'coordination' | 'technology'
  duration: number
  completed: boolean
  progress: number
  description: string
}

interface TrainingSimulationProps {
  selectedArea: string
  isLoading?: boolean
}

export const TrainingSimulation: React.FC<TrainingSimulationProps> = ({
  selectedArea,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('scenarios')
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])

  const [scenarios] = useState<SimulationScenario[]>([
    {
      id: '1',
      name: 'Coastal Flood Response',
      type: 'flood',
      difficulty: 'intermediate',
      duration: 45,
      description: 'Rapid response to sudden coastal flooding affecting residential areas',
      objectives: [
        'Coordinate evacuation of 500 residents',
        'Deploy rescue teams efficiently',
        'Maintain communication systems',
        'Minimize casualties and property damage'
      ],
      participants: 12,
      location: 'Coastal District',
      hazards: [
        { type: 'Flash Flood', severity: 'high', timing: 5 },
        { type: 'Infrastructure Damage', severity: 'medium', timing: 15 }
      ]
    },
    {
      id: '2',
      name: 'Multi-Hazard Crisis',
      type: 'multi-hazard',
      difficulty: 'expert',
      duration: 90,
      description: 'Complex scenario combining flooding and landslide risks',
      objectives: [
        'Manage simultaneous multiple disasters',
        'Prioritize resource allocation',
        'Coordinate inter-agency response',
        'Adapt strategy as conditions change'
      ],
      participants: 20,
      location: 'Mountain and Coastal Areas',
      hazards: [
        { type: 'Heavy Rain', severity: 'critical', timing: 0 },
        { type: 'River Flooding', severity: 'high', timing: 10 },
        { type: 'Landslide Risk', severity: 'high', timing: 20 },
        { type: 'Infrastructure Collapse', severity: 'medium', timing: 35 }
      ]
    },
    {
      id: '3',
      name: 'Urban Storm Response',
      type: 'storm',
      difficulty: 'beginner',
      duration: 30,
      description: 'Basic storm response procedures for urban environment',
      objectives: [
        'Issue timely public warnings',
        'Secure critical infrastructure',
        'Deploy emergency shelters',
        'Monitor weather conditions'
      ],
      participants: 8,
      location: 'City Center',
      hazards: [
        { type: 'Strong Winds', severity: 'medium', timing: 0 },
        { type: 'Power Outage', severity: 'low', timing: 12 }
      ]
    }
  ])

  const [trainingModules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Emergency Response Fundamentals',
      category: 'basics',
      duration: 60,
      completed: true,
      progress: 100,
      description: 'Core principles of emergency management and disaster response'
    },
    {
      id: '2',
      title: 'Incident Command System',
      category: 'leadership',
      duration: 90,
      completed: false,
      progress: 65,
      description: 'Leadership and organizational structure during emergencies'
    },
    {
      id: '3',
      title: 'Multi-Agency Coordination',
      category: 'coordination',
      duration: 75,
      completed: false,
      progress: 30,
      description: 'Coordinating with various agencies and organizations'
    },
    {
      id: '4',
      title: 'Emergency Communication Systems',
      category: 'technology',
      duration: 45,
      completed: false,
      progress: 0,
      description: 'Using technology for emergency communications'
    }
  ])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'expert': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getHazardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
      case 'flash flood':
      case 'river flooding':
        return <Waves className="h-4 w-4" />
      case 'landslide':
        return <Mountain className="h-4 w-4" />
      case 'storm':
      case 'strong winds':
        return <Wind className="h-4 w-4" />
      case 'earthquake':
        return <Zap className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const startSimulation = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario)
    setSimulationRunning(true)
    setSimulationProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        const newProgress = prev + (100 / scenario.duration)
        if (newProgress >= 100) {
          clearInterval(interval)
          setSimulationRunning(false)
          
          // Generate mock results
          const result: SimulationResult = {
            scenarioId: scenario.id,
            score: Math.floor(Math.random() * 30) + 70,
            timeCompleted: scenario.duration,
            decisions: [],
            metrics: {
              responseTime: Math.floor(Math.random() * 20) + 80,
              resourceEfficiency: Math.floor(Math.random() * 25) + 75,
              publicSafety: Math.floor(Math.random() * 15) + 85,
              coordination: Math.floor(Math.random() * 30) + 70
            },
            feedback: [
              'Good initial response time',
              'Resource allocation could be improved',
              'Excellent coordination between agencies'
            ]
          }
          
          setSimulationResults(prev => [...prev, result])
          return 100
        }
        return newProgress
      })
    }, 100)
  }

  const stopSimulation = () => {
    setSimulationRunning(false)
    setSimulationProgress(0)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return <BookOpen className="h-4 w-4" />
      case 'leadership': return <Users className="h-4 w-4" />
      case 'coordination': return <Target className="h-4 w-4" />
      case 'technology': return <Activity className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Play className="h-6 w-6 text-green-600" />
            Training & Simulation Center
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Practice emergency response scenarios and improve readiness for {selectedArea}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            {trainingModules.filter(m => m.completed).length}/{trainingModules.length} Modules Complete
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {simulationResults.length} Simulations Run
          </Badge>
        </div>
      </div>

      {/* Active Simulation Status */}
      {simulationRunning && selectedScenario && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Simulation Active: {selectedScenario.name}
              </h3>
            </div>
            <Button onClick={stopSimulation} variant="destructive" size="sm">
              <Pause className="h-4 w-4 mr-1" />
              Stop Simulation
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Progress: {Math.round(simulationProgress)}%
              </span>
              <span className="text-sm font-medium">
                {Math.round((simulationProgress / 100) * selectedScenario.duration)} / {selectedScenario.duration} minutes
              </span>
            </div>
            <Progress value={simulationProgress} className="h-2" />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="scenarios">Simulation Scenarios</TabsTrigger>
          <TabsTrigger value="training">Training Modules</TabsTrigger>
          <TabsTrigger value="results">Results & Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Simulation Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4">
            {scenarios.map(scenario => (
              <Card key={scenario.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{scenario.name}</h3>
                        <Badge className={getDifficultyColor(scenario.difficulty)}>
                          {scenario.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {scenario.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{scenario.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{scenario.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{scenario.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-gray-500" />
                          <span>{scenario.hazards.length} hazards</span>
                        </div>
                      </div>

                      {/* Hazards Timeline */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Hazard Timeline:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenario.hazards.map((hazard, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                              {getHazardIcon(hazard.type)}
                              <span>{hazard.type}</span>
                              <Badge variant="outline" className="text-xs">
                                T+{hazard.timing}min
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Objectives */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Objectives:</h4>
                        <ul className="space-y-1">
                          {scenario.objectives.slice(0, 2).map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Target className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                          {scenario.objectives.length > 2 && (
                            <li className="text-xs text-gray-500">
                              +{scenario.objectives.length - 2} more objectives...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => startSimulation(scenario)}
                        disabled={simulationRunning || isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start Simulation
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Training Modules Tab */}
        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4">
            {trainingModules.map(module => (
              <Card key={module.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(module.category)}
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        {module.completed && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{module.duration} min</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {module.category}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        variant={module.completed ? "outline" : "default"}
                        disabled={isLoading}
                      >
                        {module.completed ? (
                          <>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retake
                          </>
                        ) : module.progress > 0 ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results & Analytics Tab */}
        <TabsContent value="results" className="space-y-4">
          {simulationResults.length > 0 ? (
            <div className="space-y-4">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold">
                      {Math.round(simulationResults.reduce((acc, r) => acc + r.score, 0) / simulationResults.length)}%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Simulations</p>
                    <p className="text-2xl font-bold">{simulationResults.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold">
                      {Math.round(simulationResults.reduce((acc, r) => acc + r.metrics.responseTime, 0) / simulationResults.length)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Coordination</p>
                    <p className="text-2xl font-bold">
                      {Math.round(simulationResults.reduce((acc, r) => acc + r.metrics.coordination, 0) / simulationResults.length)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Simulation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {simulationResults.slice(-3).map((result, idx) => {
                      const scenario = scenarios.find(s => s.id === result.scenarioId)
                      return (
                        <div key={idx} className="border rounded p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{scenario?.name || 'Unknown Scenario'}</h4>
                            <Badge className={result.score >= 80 ? 'bg-green-100 text-green-800' : 
                                           result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                           'bg-red-100 text-red-800'}>
                              {result.score}% Score
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Response Time</span>
                              <p className="font-medium">{result.metrics.responseTime}%</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Resource Efficiency</span>
                              <p className="font-medium">{result.metrics.resourceEfficiency}%</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Public Safety</span>
                              <p className="font-medium">{result.metrics.publicSafety}%</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Coordination</span>
                              <p className="font-medium">{result.metrics.coordination}%</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Results Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Run some simulations to see your performance analytics
                </p>
                <Button onClick={() => setActiveTab('scenarios')}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Your First Simulation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Simulation Duration</Label>
                  <RadioGroup defaultValue="45" className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="duration-30" />
                      <Label htmlFor="duration-30">30 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="45" id="duration-45" />
                      <Label htmlFor="duration-45">45 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60" id="duration-60" />
                      <Label htmlFor="duration-60">60 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="90" id="duration-90" />
                      <Label htmlFor="duration-90">90 minutes</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Default Difficulty Level</Label>
                  <RadioGroup defaultValue="intermediate" className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="diff-beginner" />
                      <Label htmlFor="diff-beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="diff-intermediate" />
                      <Label htmlFor="diff-intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="diff-advanced" />
                      <Label htmlFor="diff-advanced">Advanced</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expert" id="diff-expert" />
                      <Label htmlFor="diff-expert">Expert</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Auto-save Progress</Label>
                  <RadioGroup defaultValue="enabled" className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enabled" id="autosave-enabled" />
                      <Label htmlFor="autosave-enabled">Enabled</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled" id="autosave-disabled" />
                      <Label htmlFor="autosave-disabled">Disabled</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}