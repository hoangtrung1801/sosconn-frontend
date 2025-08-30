'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Eye, Edit, Play, Archive, Calendar, MapPin, AlertTriangle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { EOPReport } from '@/types/eop.type'

interface EOPManagementProps {
  eopReports: EOPReport[]
  activeEOP: EOPReport | null
  isEmergency: boolean
  emergencyLocation: string
  emergencyType: string
  isLoading: boolean
}

const getStatusColor = (status: EOPReport['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

const CreateEOPPrompt: React.FC<{ 
  isEmergency: boolean
  emergencyLocation: string
  emergencyType: string 
}> = ({ isEmergency, emergencyLocation, emergencyType }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={`border-2 ${isEmergency ? 'border-red-300 bg-red-50 dark:bg-red-950/20' : 'border-blue-300 bg-blue-50 dark:bg-blue-950/20'} text-center py-8`}>
      <CardContent className="space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEmergency ? '🚨 Emergency EOP Required' : 'No Emergency Operation Plan Found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isEmergency 
              ? `An active emergency is ongoing in ${emergencyLocation}. An Emergency Operation Plan must be created immediately to coordinate response efforts.`
              : 'Create an Emergency Operation Plan to prepare for potential disasters and coordinate response activities.'
            }
          </p>
          
          {isEmergency && (
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">
                  Immediate Action Required
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                {emergencyType} response coordination needed for {emergencyLocation}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            onClick={() => window.location.href = '/eop/ai-generate'}
          >
            <Plus className="h-5 w-5 mr-2" />
            🤖 AI Generate EOP
          </Button>
          
          <Button 
            size="lg"
            className={`${isEmergency 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            } px-8`}
            onClick={() => window.location.href = '/eop/create'}
          >
            <Plus className="h-5 w-5 mr-2" />
            {isEmergency ? '🚨 Create Emergency EOP' : 'Create Manual EOP'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/eop/'}
          >
            <FileText className="h-5 w-5 mr-2" />
            View All EOP Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

const EOPCard: React.FC<{ 
  eop: EOPReport
  index: number
  isActive?: boolean 
}> = ({ eop, index, isActive = false }) => {
  const tasksCompleted = eop.tasks?.filter(task => task.status === 'completed').length || 0
  const totalTasks = eop.tasks?.length || 0
  const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-200 ${isActive ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {eop.title}
                </CardTitle>
                {isActive && (
                  <Badge className="bg-green-100 text-green-800 border-green-300 animate-pulse">
                    ACTIVE
                  </Badge>
                )}
              </div>
              <Badge className={getStatusColor(eop.status)}>
                {eop.status.toUpperCase()}
              </Badge>
            </div>
            <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Disaster Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {eop.disasterInfo.disasterType.charAt(0).toUpperCase() + eop.disasterInfo.disasterType.slice(1)}
              </span>
              <Badge className={getSeverityColor(eop.disasterInfo.severityLevel)}>
                {eop.disasterInfo.severityLevel.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{eop.disasterInfo.affectedArea}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Generated {formatDate(eop.generatedAt)}</span>
            </div>
          </div>
          
          {/* Task Progress */}
          {totalTasks > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Task Progress</span>
                <span className="font-medium">{tasksCompleted}/{totalTasks} completed</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="text-xs text-gray-500 text-right">
                {completionRate}% complete
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = `/eop/report?id=${eop.id}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = `/eop/edit?id=${eop.id}`}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            {eop.status !== 'active' && (
              <Button 
                size="sm" 
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                Activate
              </Button>
            )}
            
            {eop.status === 'active' && (
              <Button 
                size="sm" 
                variant="outline"
                className="text-gray-600"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const EOPManagement: React.FC<EOPManagementProps> = ({
  eopReports,
  activeEOP,
  isEmergency,
  emergencyLocation,
  emergencyType,
  isLoading
}) => {
  // Check if there's no active EOP during an emergency
  const needsEmergencyEOP = isEmergency && !activeEOP

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency EOP Creation Prompt */}
      {needsEmergencyEOP && (
        <CreateEOPPrompt 
          isEmergency={isEmergency}
          emergencyLocation={emergencyLocation}
          emergencyType={emergencyType}
        />
      )}

      {/* EOP Reports Grid */}
      {eopReports.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Emergency Operation Plans ({eopReports.length})
            </h2>
            <Button 
              onClick={() => window.location.href = '/eop/create'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New EOP
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Active EOP first if exists */}
            {activeEOP && (
              <EOPCard 
                eop={activeEOP} 
                index={0} 
                isActive={true}
              />
            )}
            
            {/* Other EOPs */}
            {eopReports
              .filter(eop => eop.id !== activeEOP?.id)
              .map((eop, index) => (
                <EOPCard 
                  key={eop.id} 
                  eop={eop} 
                  index={activeEOP ? index + 1 : index}
                />
              ))}
          </div>
        </div>
      ) : !needsEmergencyEOP && (
        <CreateEOPPrompt 
          isEmergency={false}
          emergencyLocation={emergencyLocation}
          emergencyType={emergencyType}
        />
      )}
    </div>
  )
}