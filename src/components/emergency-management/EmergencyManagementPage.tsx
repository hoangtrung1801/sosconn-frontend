import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AlertTriangle, FileText, CheckSquare, Bell, Shield, Activity, ArrowLeft, MapPin, Package, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEmergencyManagement } from '@/hooks/use-emergency-management'
import { EOPManagement } from '@/components/emergency-management/EOPManagement'
import { TaskManagement } from '@/components/emergency-management/TaskManagement'
import { AlertManagement } from '@/components/emergency-management/AlertManagement'
import { EmergencyStatusSummary } from '@/components/emergency-management/EmergencyStatusSummary'
import { ResourceManagement } from '@/components/emergency-management/ResourceManagement'
import { VolunteerManagement } from '@/components/emergency-management/VolunteerManagement'

interface EmergencyManagementPageProps {
  selectedArea?: string
}

const AREA_NAMES: Record<string, string> = {
  "hai-chau": "Hải Châu District",
  "son-tra": "Sơn Trà District",
  "thanh-khe": "Thanh Khê District",
  "cam-le": "Cẩm Lệ District",
  "lien-chieu": "Liên Chiểu District",
  "ngu-hanh-son": "Ngũ Hành Sơn District"
}

export const EmergencyManagementPage: React.FC<EmergencyManagementPageProps> = ({ selectedArea }) => {
  const [activeTab, setActiveTab] = useState('eop')
  const navigate = useNavigate()
  
  const {
    eopReports,
    activeEOP,
    allTasks,
    alerts,
    statistics,
    isLoading,
    error,
    actions
  } = useEmergencyManagement(selectedArea)

  // Emergency status - same as Homepage for consistency
  const isEmergency = true
  const emergencyLocation = "Da Nang City"
  const emergencyType = "Severe Flooding"

  // Redirect to area selection if no area is selected
  useEffect(() => {
    if (!selectedArea) {
      navigate({ to: "/area-selection" })
      return
    }
  }, [selectedArea, navigate])

  if (!selectedArea) {
    return null // Loading redirect
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Emergency Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              onClick={actions.loadEOPReports}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Retry Loading Data
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedAreaName = AREA_NAMES[selectedArea] || selectedArea

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Emergency Status Banner */}
      {isEmergency && (
        <div className="bg-red-600 dark:bg-red-700 text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">
              🚨 EMERGENCY MANAGEMENT ACTIVE: {emergencyType} in {emergencyLocation}
            </span>
            <Badge variant="secondary" className="bg-white text-red-600 animate-pulse">
              COMMAND CENTER
            </Badge>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 space-y-6">
        {/* Area Selection Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/area-selection" })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Change Area
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Managing: {selectedAreaName}
              </span>
              <Badge variant="outline" className="border-red-300 text-red-700">
                Selected Area
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Shield className="h-8 w-8 text-red-600" />
                Emergency Management
                {isEmergency && (
                  <Badge variant="destructive" className="animate-pulse">
                    ACTIVE EMERGENCY
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Emergency operations for {selectedAreaName}
                {isEmergency && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {" "}• Managing {emergencyType} response
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={actions.loadEOPReports}
                disabled={isLoading}
              >
                <Activity className="h-4 w-4 mr-2" />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Emergency Status Summary Cards */}
        <EmergencyStatusSummary 
          statistics={statistics}
          isEmergency={isEmergency}
          isLoading={isLoading}
        />

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <TabsTrigger 
                value="eop" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                <span>EOP</span>
                <Badge variant="secondary" className="ml-2">
                  {statistics.activeEOPs}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <CheckSquare className="h-4 w-4" />
                <span>Tasks</span>
                <Badge variant="secondary" className="ml-2">
                  {statistics.totalTasks - statistics.completedTasks}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
                <Badge variant="secondary" className="ml-2">
                  {statistics.unreadAlerts}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <Package className="h-4 w-4" />
                <span>Resources</span>
                <Badge variant="secondary" className="ml-2">
                  {statistics.resourceStatistics?.availableResources || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="volunteers" 
                className="flex items-center space-x-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                <span>Volunteers</span>
                <Badge variant="secondary" className="ml-2">
                  {statistics.volunteerStatistics?.availableVolunteers || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* EOP Management Tab */}
            <TabsContent value="eop" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EOPManagement 
                  eopReports={eopReports}
                  activeEOP={activeEOP}
                  isEmergency={isEmergency}
                  emergencyLocation={selectedAreaName}
                  emergencyType={emergencyType}
                  isLoading={isLoading}
                />
              </motion.div>
            </TabsContent>

            {/* Task Management Tab */}
            <TabsContent value="tasks" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskManagement 
                  tasks={allTasks}
                  onUpdateTask={actions.updateTaskStatus}
                  statistics={statistics}
                  isLoading={isLoading}
                />
              </motion.div>
            </TabsContent>

            {/* Alert Management Tab */}
            <TabsContent value="alerts" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertManagement 
                  alerts={alerts}
                  onMarkAsRead={actions.markAlertAsRead}
                  statistics={statistics}
                  isLoading={isLoading}
                />
              </motion.div>
            </TabsContent>

            {/* Resource Management Tab */}
            <TabsContent value="resources" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResourceManagement 
                  resources={actions.resources || []}
                  allocations={actions.resourceAllocations || []}
                  requests={actions.resourceRequests || []}
                  statistics={actions.resourceStatistics || {
                    totalResources: 0,
                    availableResources: 0,
                    deployedResources: 0,
                    resourcesByCategory: {},
                    criticalResourcesLow: [],
                    allocationRate: 0,
                    maintenanceScheduled: 0,
                    pendingRequests: 0
                  }}
                  isLoading={isLoading}
                  onAllocateResource={actions.allocateResource}
                  onUpdateResource={actions.updateResource}
                  onApproveRequest={actions.approveResourceRequest}
                  onRejectRequest={actions.rejectResourceRequest}
                />
              </motion.div>
            </TabsContent>

            {/* Volunteer Management Tab */}
            <TabsContent value="volunteers" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VolunteerManagement 
                  volunteers={actions.volunteers || []}
                  assignments={actions.volunteerAssignments || []}
                  requests={actions.volunteerRequests || []}
                  trainings={actions.volunteerTrainings || []}
                  statistics={actions.volunteerStatistics || {
                    totalVolunteers: 0,
                    availableVolunteers: 0,
                    deployedVolunteers: 0,
                    volunteersBySpecialty: {},
                    averageRating: 0,
                    totalActiveHours: 0,
                    recentJoinings: 0,
                    trainingScheduled: 0,
                    pendingRequests: 0
                  }}
                  isLoading={isLoading}
                  onAssignVolunteer={actions.assignVolunteer}
                  onUpdateVolunteer={actions.updateVolunteer}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}