import { useState, useEffect, useMemo } from 'react'
import type { EOPReport, EOPTask } from '@/types/eop.type'
import type { FloodData } from '@/types/disaster.type'
import type { 
  Resource, 
  ResourceAllocation, 
  ResourceRequest, 
  ResourceStatistics,
  Volunteer,
  VolunteerAssignment,
  VolunteerRequest,
  VolunteerTraining,
  VolunteerStatistics
} from '@/types/emergency-management.type'
import eopApi from '@/lib/api/eop.api'
import { mockFloodData } from '@/lib/mock-data/flood-data'
import { getEOPReportByArea } from '@/lib/mock-data/eop-data'
import { 
  getResourcesByArea, 
  getResourceAllocationsByArea, 
  getResourceRequestsByArea,
  getVolunteersByArea,
  getVolunteerAssignmentsByArea,
  getVolunteerRequestsByArea,
  getVolunteerTrainingsByArea,
  generateResourceStatistics,
  generateVolunteerStatistics
} from '@/lib/mock-data/resource-volunteer-data'

export interface Alert {
  id: string
  type: 'disaster' | 'community' | 'system'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  location?: string
  timestamp: string
  isRead: boolean
  actions?: string[]
}

export interface EmergencyManagementState {
  eopReports: EOPReport[]
  activeEOP: EOPReport | null
  allTasks: EOPTask[]
  alerts: Alert[]
  resources: Resource[]
  resourceAllocations: ResourceAllocation[]
  resourceRequests: ResourceRequest[]
  resourceStatistics: ResourceStatistics
  volunteers: Volunteer[]
  volunteerAssignments: VolunteerAssignment[]
  volunteerRequests: VolunteerRequest[]
  volunteerTrainings: VolunteerTraining[]
  volunteerStatistics: VolunteerStatistics
  isLoading: boolean
  error: string | null
}

const generateDisasterAlerts = (disasters: FloodData[]): Alert[] => {
  return disasters
    .filter(disaster => disaster.status === 'active')
    .map(disaster => ({
      id: `disaster-${disaster.id}`,
      type: 'disaster' as const,
      priority: disaster.severity === 'critical' 
        ? 'critical' as const 
        : disaster.severity === 'high' 
        ? 'high' as const 
        : 'medium' as const,
      title: `${disaster.severity.toUpperCase()} ${disaster.type.toUpperCase()}: ${disaster.title}`,
      description: disaster.description,
      location: disaster.location.address,
      timestamp: disaster.updatedAt,
      isRead: false,
      actions: ['create-task', 'view-details', 'update-status']
    }))
}

const generateSystemAlerts = (tasks: EOPTask[]): Alert[] => {
  const now = new Date()
  const overdueTasks = tasks.filter(task => {
    const deadline = new Date(task.deadline)
    return deadline < now && task.status !== 'completed'
  })

  return overdueTasks.map(task => ({
    id: `task-overdue-${task.id}`,
    type: 'system' as const,
    priority: task.priority === 'high' ? 'high' as const : 'medium' as const,
    title: `Overdue Task: ${task.title}`,
    description: `Task "${task.title}" assigned to ${task.assignedTo} is overdue`,
    timestamp: task.deadline,
    isRead: false,
    actions: ['reassign', 'extend-deadline', 'mark-complete']
  }))
}

export const useEmergencyManagement = (selectedArea?: string) => {
  const [state, setState] = useState<EmergencyManagementState>({
    eopReports: [],
    activeEOP: null,
    allTasks: [],
    alerts: [],
    resources: [],
    resourceAllocations: [],
    resourceRequests: [],
    resourceStatistics: {
      totalResources: 0,
      availableResources: 0,
      deployedResources: 0,
      resourcesByCategory: {
        medical: 0,
        equipment: 0,
        supplies: 0,
        vehicles: 0,
        facilities: 0,
        personnel: 0
      },
      criticalResourcesLow: [],
      allocationRate: 0,
      maintenanceScheduled: 0,
      pendingRequests: 0
    },
    volunteers: [],
    volunteerAssignments: [],
    volunteerRequests: [],
    volunteerTrainings: [],
    volunteerStatistics: {
      totalVolunteers: 0,
      availableVolunteers: 0,
      deployedVolunteers: 0,
      volunteersBySpecialty: {},
      averageRating: 0,
      totalActiveHours: 0,
      recentJoinings: 0,
      trainingScheduled: 0,
      pendingRequests: 0
    },
    isLoading: true,
    error: null
  })

  const loadEOPReports = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      let reports: EOPReport[] = []
      let activeEOP: EOPReport | null = null
      
      if (selectedArea) {
        // Use area-specific EOP report
        const areaEOP = getEOPReportByArea(selectedArea)
        if (areaEOP) {
          reports = [areaEOP]
          activeEOP = areaEOP
        }
      } else {
        // Fallback to API data
        const response = await eopApi.getEOPReports()
        reports = response.reports || []
        activeEOP = reports.find(report => report.status === 'active') || null
      }
      
      // Collect all tasks from all EOPs
      const allTasks = reports.flatMap(report => report.tasks || [])
      
      // Generate alerts
      const disasterAlerts = generateDisasterAlerts(mockFloodData)
      const systemAlerts = generateSystemAlerts(allTasks)
      const communityAlerts: Alert[] = [
        {
          id: 'community-1',
          type: 'community',
          priority: 'medium',
          title: 'Safety Check-in Request',
          description: '150 residents in Hai Chau District have not checked in during the emergency',
          location: 'Hai Chau District, Da Nang',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          actions: ['send-notification', 'deploy-team']
        },
        {
          id: 'community-2',
          type: 'community',
          priority: 'high',
          title: 'Emergency Supply Request',
          description: 'Community center requests emergency medical supplies for 200 people',
          location: 'Son Tra District, Da Nang',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          isRead: false,
          actions: ['dispatch-supplies', 'assign-team']
        }
      ]

      // Load resource and volunteer data if area is selected
      let resources: Resource[] = []
      let resourceAllocations: ResourceAllocation[] = []
      let resourceRequests: ResourceRequest[] = []
      let resourceStatistics = state.resourceStatistics
      let volunteers: Volunteer[] = []
      let volunteerAssignments: VolunteerAssignment[] = []
      let volunteerRequests: VolunteerRequest[] = []
      let volunteerTrainings: VolunteerTraining[] = []
      let volunteerStatistics = state.volunteerStatistics

      if (selectedArea) {
        resources = getResourcesByArea(selectedArea)
        resourceAllocations = getResourceAllocationsByArea(selectedArea)
        resourceRequests = getResourceRequestsByArea(selectedArea)
        resourceStatistics = generateResourceStatistics(resources)
        
        volunteers = getVolunteersByArea(selectedArea)
        volunteerAssignments = getVolunteerAssignmentsByArea(selectedArea)
        volunteerRequests = getVolunteerRequestsByArea(selectedArea)
        volunteerTrainings = getVolunteerTrainingsByArea(selectedArea)
        volunteerStatistics = generateVolunteerStatistics(volunteers)
      }

      const allAlerts = [...disasterAlerts, ...systemAlerts, ...communityAlerts]
        .sort((a, b) => {
          // Sort by priority and timestamp
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          }
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })

      setState(prev => ({
        ...prev,
        eopReports: reports,
        activeEOP,
        allTasks,
        alerts: allAlerts,
        resources,
        resourceAllocations,
        resourceRequests,
        resourceStatistics,
        volunteers,
        volunteerAssignments,
        volunteerRequests,
        volunteerTrainings,
        volunteerStatistics,
        isLoading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load emergency data'
      }))
    }
  }

  useEffect(() => {
    loadEOPReports()
  }, [selectedArea])

  const markAlertAsRead = (alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    }))
  }

  const updateTaskStatus = (taskId: string, status: EOPTask['status']) => {
    setState(prev => ({
      ...prev,
      allTasks: prev.allTasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      ),
      eopReports: prev.eopReports.map(report => ({
        ...report,
        tasks: report.tasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      }))
    }))
  }

  const statistics = useMemo(() => {
    const totalTasks = state.allTasks.length
    const completedTasks = state.allTasks.filter(task => task.status === 'completed').length
    const overdueTasks = state.allTasks.filter(task => {
      const deadline = new Date(task.deadline)
      return deadline < new Date() && task.status !== 'completed'
    }).length
    const unreadAlerts = state.alerts.filter(alert => !alert.isRead).length

    return {
      totalEOPs: state.eopReports.length,
      activeEOPs: state.eopReports.filter(eop => eop.status === 'active').length,
      totalTasks,
      completedTasks,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      overdueTasks,
      totalAlerts: state.alerts.length,
      unreadAlerts,
      criticalAlerts: state.alerts.filter(alert => alert.priority === 'critical').length,
      resourceStatistics: state.resourceStatistics,
      volunteerStatistics: state.volunteerStatistics
    }
  }, [state.eopReports, state.allTasks, state.alerts, state.resourceStatistics, state.volunteerStatistics])

  // Resource management actions (placeholder implementations)
  const allocateResource = (resourceId: string, allocation: Partial<ResourceAllocation>) => {
    console.log('Allocate resource:', resourceId, allocation)
    // Implementation would update resource allocations
  }

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    console.log('Update resource:', resourceId, updates)
    // Implementation would update resource data
  }

  const approveResourceRequest = (requestId: string) => {
    console.log('Approve resource request:', requestId)
    // Implementation would approve resource request
  }

  const rejectResourceRequest = (requestId: string, reason: string) => {
    console.log('Reject resource request:', requestId, reason)
    // Implementation would reject resource request
  }

  // Volunteer management actions (placeholder implementations)
  const assignVolunteer = (volunteerId: string, assignment: Partial<VolunteerAssignment>) => {
    console.log('Assign volunteer:', volunteerId, assignment)
    // Implementation would create volunteer assignment
  }

  const updateVolunteer = (volunteerId: string, updates: Partial<Volunteer>) => {
    console.log('Update volunteer:', volunteerId, updates)
    // Implementation would update volunteer data
  }

  return {
    ...state,
    statistics,
    actions: {
      loadEOPReports,
      markAlertAsRead,
      updateTaskStatus,
      // Resource actions
      resources: state.resources,
      resourceAllocations: state.resourceAllocations,
      resourceRequests: state.resourceRequests,
      resourceStatistics: state.resourceStatistics,
      allocateResource,
      updateResource,
      approveResourceRequest,
      rejectResourceRequest,
      // Volunteer actions
      volunteers: state.volunteers,
      volunteerAssignments: state.volunteerAssignments,
      volunteerRequests: state.volunteerRequests,
      volunteerTrainings: state.volunteerTrainings,
      volunteerStatistics: state.volunteerStatistics,
      assignVolunteer,
      updateVolunteer
    }
  }
}