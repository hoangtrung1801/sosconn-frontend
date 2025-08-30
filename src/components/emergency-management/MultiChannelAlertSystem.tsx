'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Send,
  Smartphone,
  Radio,
  MessageSquare,
  Mail,
  Users,
  MapPin,
  CheckCircle,
  Clock,
  Plus,
  Settings,
  Volume2,
  Tv,
  Zap,
  Target,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Channel {
  id: string
  name: string
  type: 'sms' | 'push' | 'radio' | 'email' | 'social' | 'tv' | 'siren'
  icon: React.ReactNode
  enabled: boolean
  coverage: number
  reliability: number
  responseTime: string
  cost: 'low' | 'medium' | 'high'
  capabilities: string[]
}

interface AlertTemplate {
  id: string
  name: string
  type: 'flood' | 'earthquake' | 'fire' | 'storm' | 'evacuation' | 'custom'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  channels: string[]
  targetAreas: string[]
  estimatedReach: number
}

interface BroadcastAlert {
  id: string
  template: AlertTemplate
  channels: Channel[]
  targetAreas: string[]
  scheduledTime?: string
  status: 'draft' | 'scheduled' | 'broadcasting' | 'completed' | 'failed'
  sentAt?: string
  reachStats: {
    total: number
    delivered: number
    failed: number
    acknowledged: number
  }
}

const AVAILABLE_CHANNELS: Channel[] = [
  {
    id: 'sms',
    name: 'SMS Messages',
    type: 'sms',
    icon: <Smartphone className="h-4 w-4" />,
    enabled: true,
    coverage: 95,
    reliability: 90,
    responseTime: '< 30s',
    cost: 'medium',
    capabilities: ['Mass messaging', 'Location targeting', 'Two-way communication']
  },
  {
    id: 'push',
    name: 'Mobile Push Notifications',
    type: 'push',
    icon: <Bell className="h-4 w-4" />,
    enabled: true,
    coverage: 85,
    reliability: 85,
    responseTime: '< 10s',
    cost: 'low',
    capabilities: ['Rich media', 'Action buttons', 'Silent updates']
  },
  {
    id: 'radio',
    name: 'Emergency Radio',
    type: 'radio',
    icon: <Radio className="h-4 w-4" />,
    enabled: true,
    coverage: 99,
    reliability: 95,
    responseTime: '< 5s',
    cost: 'low',
    capabilities: ['Wide coverage', 'Battery independent', 'Multi-language']
  },
  {
    id: 'email',
    name: 'Email Alerts',
    type: 'email',
    icon: <Mail className="h-4 w-4" />,
    enabled: true,
    coverage: 70,
    reliability: 80,
    responseTime: '< 2m',
    cost: 'low',
    capabilities: ['Detailed information', 'Attachments', 'Rich formatting']
  },
  {
    id: 'social',
    name: 'Social Media',
    type: 'social',
    icon: <MessageSquare className="h-4 w-4" />,
    enabled: true,
    coverage: 60,
    reliability: 75,
    responseTime: '< 1m',
    cost: 'low',
    capabilities: ['Viral spread', 'Community engagement', 'Real-time updates']
  },
  {
    id: 'tv',
    name: 'TV/Media Broadcast',
    type: 'tv',
    icon: <Tv className="h-4 w-4" />,
    enabled: false,
    coverage: 80,
    reliability: 90,
    responseTime: '< 5m',
    cost: 'high',
    capabilities: ['Visual content', 'Wide reach', 'Authoritative source']
  },
  {
    id: 'siren',
    name: 'Public Sirens',
    type: 'siren',
    icon: <Volume2 className="h-4 w-4" />,
    enabled: true,
    coverage: 50,
    reliability: 95,
    responseTime: '< 5s',
    cost: 'medium',
    capabilities: ['Immediate attention', 'Works without devices', 'Penetrates noise']
  }
]

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'flood-warning',
    name: 'Flood Warning',
    type: 'flood',
    severity: 'high',
    title: 'FLOOD WARNING - Immediate Action Required',
    message: 'Severe flooding expected in your area. Move to higher ground immediately. Avoid driving through flooded roads. Follow evacuation orders from local authorities.',
    channels: ['sms', 'push', 'radio', 'siren'],
    targetAreas: ['District 1', 'District 3', 'District 7'],
    estimatedReach: 150000
  },
  {
    id: 'earthquake-alert',
    name: 'Earthquake Alert',
    type: 'earthquake',
    severity: 'critical',
    title: 'EARTHQUAKE ALERT - Take Cover Now',
    message: 'Strong earthquake detected. DROP, COVER, and HOLD ON. Take shelter under sturdy furniture. Stay away from windows and heavy objects.',
    channels: ['push', 'radio', 'siren', 'tv'],
    targetAreas: ['Citywide'],
    estimatedReach: 500000
  },
  {
    id: 'evacuation-order',
    name: 'Evacuation Order',
    type: 'evacuation',
    severity: 'critical',
    title: 'MANDATORY EVACUATION ORDER',
    message: 'Immediate evacuation required for your area due to emergency conditions. Follow designated evacuation routes. Report to assigned shelters.',
    channels: ['sms', 'push', 'radio', 'email', 'siren'],
    targetAreas: ['District 4', 'District 5'],
    estimatedReach: 200000
  }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getChannelCostColor = (cost: string) => {
  switch (cost) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

export const MultiChannelAlertSystem: React.FC = () => {
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<AlertTemplate | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([])
  const [activeTab, setActiveTab] = useState('compose')

  const handleChannelToggle = useCallback((channel: Channel) => {
    setSelectedChannels(prev => {
      const isSelected = prev.some(c => c.id === channel.id)
      if (isSelected) {
        return prev.filter(c => c.id !== channel.id)
      } else {
        return [...prev, channel]
      }
    })
  }, [])

  const handleTemplateSelect = useCallback((template: AlertTemplate) => {
    setSelectedTemplate(template)
    setCustomTitle(template.title)
    setCustomMessage(template.message)
    setSelectedAreas(template.targetAreas)
    setSelectedChannels(AVAILABLE_CHANNELS.filter(c => template.channels.includes(c.id)))
  }, [])

  const calculateReach = () => {
    if (selectedChannels.length === 0 || selectedAreas.length === 0) return 0
    
    const avgCoverage = selectedChannels.reduce((sum, channel) => sum + channel.coverage, 0) / selectedChannels.length
    const baseReach = selectedAreas.length * 50000
    return Math.floor(baseReach * (avgCoverage / 100))
  }

  const handleBroadcast = () => {
    if (!customTitle || !customMessage || selectedChannels.length === 0) return

    const newBroadcast: BroadcastAlert = {
      id: `alert-${Date.now()}`,
      template: selectedTemplate || {
        id: 'custom',
        name: 'Custom Alert',
        type: 'custom',
        severity: 'medium',
        title: customTitle,
        message: customMessage,
        channels: selectedChannels.map(c => c.id),
        targetAreas: selectedAreas,
        estimatedReach: calculateReach()
      },
      channels: selectedChannels,
      targetAreas: selectedAreas,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      status: isScheduled ? 'scheduled' : 'broadcasting',
      sentAt: new Date().toISOString(),
      reachStats: {
        total: calculateReach(),
        delivered: 0,
        failed: 0,
        acknowledged: 0
      }
    }

    setBroadcasts(prev => [newBroadcast, ...prev])
    
    // Simulate broadcasting progress
    setTimeout(() => {
      setBroadcasts(prev => prev.map(b => 
        b.id === newBroadcast.id 
          ? { ...b, status: 'completed', reachStats: { ...b.reachStats, delivered: Math.floor(b.reachStats.total * 0.9) } }
          : b
      ))
    }, 3000)

    // Reset form
    setCustomTitle('')
    setCustomMessage('')
    setSelectedChannels([])
    setSelectedAreas([])
    setSelectedTemplate(null)
    setActiveTab('history')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Multi-Channel Alert System
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Broadcast emergency alerts across multiple communication channels
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Channels
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">
            <Plus className="h-4 w-4 mr-2" />
            Compose Alert
          </TabsTrigger>
          <TabsTrigger value="channels">
            <Target className="h-4 w-4 mr-2" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Broadcast History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Alert Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ALERT_TEMPLATES.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{template.name}</h3>
                          <Badge className={getSeverityColor(template.severity)}>
                            {template.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {template.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            ~{template.estimatedReach.toLocaleString()} people
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Alert Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="alert-title">Alert Title</Label>
                  <Input
                    id="alert-title"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter alert title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="alert-message">Alert Message</Label>
                  <Textarea
                    id="alert-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter alert message..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label>Target Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 7', 'Citywide'].map((area) => (
                      <Badge
                        key={area}
                        variant={selectedAreas.includes(area) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedAreas(prev => 
                          prev.includes(area) 
                            ? prev.filter(a => a !== area)
                            : [...prev, area]
                        )}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="schedule-alert"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="schedule-alert">Schedule for later</Label>
                </div>
                
                {isScheduled && (
                  <div>
                    <Label htmlFor="scheduled-time">Scheduled Time</Label>
                    <Input
                      id="scheduled-time"
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Channel Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Communication Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_CHANNELS.map((channel) => (
                  <motion.div
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedChannels.some(c => c.id === channel.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : channel.enabled
                          ? 'hover:border-gray-300'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => channel.enabled && handleChannelToggle(channel)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {channel.icon}
                            <span className="font-medium text-sm">{channel.name}</span>
                          </div>
                          {selectedChannels.some(c => c.id === channel.id) && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        
                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Coverage:</span>
                            <span>{channel.coverage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reliability:</span>
                            <span>{channel.reliability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response:</span>
                            <span>{channel.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span className={getChannelCostColor(channel.cost)}>
                              {channel.cost}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {channel.capabilities.slice(0, 2).map((cap) => (
                              <Badge key={cap} variant="secondary" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Preview & Send */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Alert Preview & Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedChannels.length}</div>
                  <div className="text-sm text-gray-600">Channels Selected</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedAreas.length}</div>
                  <div className="text-sm text-gray-600">Target Areas</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{calculateReach().toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Estimated Reach</div>
                </div>
              </div>
              
              {customTitle && customMessage && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold mb-2">{customTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{customMessage}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  Save as Template
                </Button>
                <Button 
                  onClick={handleBroadcast}
                  disabled={!customTitle || !customMessage || selectedChannels.length === 0}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isScheduled ? 'Schedule Alert' : 'Broadcast Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {AVAILABLE_CHANNELS.map((channel) => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {channel.icon}
                      {channel.name}
                    </CardTitle>
                    <Badge variant={channel.enabled ? "default" : "secondary"}>
                      {channel.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Coverage:</span>
                      <div className="font-semibold">{channel.coverage}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Reliability:</span>
                      <div className="font-semibold">{channel.reliability}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Response Time:</span>
                      <div className="font-semibold">{channel.responseTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost:</span>
                      <div className={`font-semibold ${getChannelCostColor(channel.cost)}`}>
                        {channel.cost.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 mb-2 block">Capabilities:</span>
                    <div className="flex flex-wrap gap-1">
                      {channel.capabilities.map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Broadcasts</h3>
            <div className="text-sm text-gray-600">
              {broadcasts.length} alerts sent
            </div>
          </div>
          
          <div className="space-y-4">
            {broadcasts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No broadcasts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your broadcast history will appear here after sending alerts.
                </p>
              </div>
            ) : (
              broadcasts.map((broadcast) => (
                <Card key={broadcast.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{broadcast.template.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {broadcast.template.message}
                        </p>
                      </div>
                      <Badge className={
                        broadcast.status === 'completed' ? 'bg-green-100 text-green-800' :
                        broadcast.status === 'broadcasting' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                        broadcast.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {broadcast.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Channels:</span>
                        <div className="font-semibold">{broadcast.channels.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Target Areas:</span>
                        <div className="font-semibold">{broadcast.targetAreas.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Reach:</span>
                        <div className="font-semibold">{broadcast.reachStats.total.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Delivered:</span>
                        <div className="font-semibold text-green-600">{broadcast.reachStats.delivered.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>
                        {broadcast.sentAt ? new Date(broadcast.sentAt).toLocaleString() : 'Not sent yet'}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {broadcast.channels.map((channel) => (
                          <Badge key={channel.id} variant="outline" className="text-xs">
                            {channel.icon}
                            <span className="ml-1">{channel.type.toUpperCase()}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}