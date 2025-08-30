// Resource Management Types
export interface Resource {
  id: string
  name: string
  category: 'medical' | 'equipment' | 'supplies' | 'vehicles' | 'facilities' | 'personnel'
  type: string
  description: string
  quantity: number
  availableQuantity: number
  unit: string
  location: string
  status: 'available' | 'deployed' | 'maintenance' | 'reserved'
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignedTo?: string
  deployedAt?: string
  lastUpdated: string
  specifications?: Record<string, any>
  cost?: number
  supplier?: string
  expiryDate?: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface ResourceAllocation {
  id: string
  resourceId: string
  allocatedTo: string // Task ID or Operation ID
  quantity: number
  allocatedAt: string
  allocatedBy: string
  expectedReturn?: string
  returnedAt?: string
  returnedQuantity?: number
  notes?: string
  status: 'active' | 'returned' | 'overdue'
}

export interface ResourceRequest {
  id: string
  requestedBy: string
  requestedAt: string
  category: Resource['category']
  description: string
  urgency: 'immediate' | 'urgent' | 'normal' | 'low'
  quantity: number
  unit: string
  justification: string
  approvedBy?: string
  approvedAt?: string
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  rejectionReason?: string
  fulfillmentDetails?: {
    resourceId: string
    quantity: number
    fulfilledAt: string
  }[]
}

// Volunteer Management Types
export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  skills: string[]
  certifications: string[]
  availability: {
    status: 'available' | 'deployed' | 'unavailable' | 'off_duty'
    availableHours?: string[]
    deployedUntil?: string
    reason?: string
  }
  experience: 'novice' | 'intermediate' | 'experienced' | 'expert'
  specialties: ('medical' | 'search_rescue' | 'logistics' | 'communication' | 'translation' | 'evacuation' | 'security')[]
  currentAssignment?: {
    taskId: string
    assignedAt: string
    location: string
    role: string
  }
  emergencyContacts: {
    name: string
    relationship: string
    phone: string
  }[]
  medicalInfo?: {
    bloodType?: string
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
  }
  preferences: {
    maxHoursPerWeek?: number
    preferredLocations?: string[]
    willingToTravel?: boolean
    hasTransportation?: boolean
  }
  performanceRating?: number // 1-5 stars
  totalHours: number
  joinedDate: string
  lastActive: string
  isVerified: boolean
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected'
}

export interface VolunteerAssignment {
  id: string
  volunteerId: string
  taskId: string
  assignedBy: string
  assignedAt: string
  role: string
  location: string
  expectedDuration: number // hours
  actualStartTime?: string
  actualEndTime?: string
  status: 'assigned' | 'active' | 'completed' | 'cancelled'
  notes?: string
  checkInRequired: boolean
  lastCheckIn?: string
  completionNotes?: string
  rating?: number
}

export interface VolunteerRequest {
  id: string
  requestedBy: string
  requestedAt: string
  taskId?: string
  requiredSkills: string[]
  preferredSpecialties: Volunteer['specialties']
  numberOfVolunteers: number
  urgency: 'immediate' | 'urgent' | 'normal' | 'planned'
  location: string
  description: string
  estimatedHours: number
  startTime: string
  endTime?: string
  requirements: string[]
  status: 'open' | 'partially_filled' | 'filled' | 'cancelled'
  assignedVolunteers: string[] // volunteer IDs
  createdAt: string
}

export interface VolunteerTraining {
  id: string
  title: string
  description: string
  category: 'safety' | 'first_aid' | 'communication' | 'technical' | 'leadership'
  duration: number // hours
  instructorId?: string
  scheduledFor?: string
  maxParticipants: number
  registeredVolunteers: string[]
  completedVolunteers: {
    volunteerId: string
    completedAt: string
    score?: number
    certificateIssued: boolean
  }[]
  requirements: string[]
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  materials?: string[]
}

// Statistics and Summary Types
export interface ResourceStatistics {
  totalResources: number
  availableResources: number
  deployedResources: number
  resourcesByCategory: Record<Resource['category'], number>
  criticalResourcesLow: Resource[]
  allocationRate: number
  maintenanceScheduled: number
  pendingRequests: number
}

export interface VolunteerStatistics {
  totalVolunteers: number
  availableVolunteers: number
  deployedVolunteers: number
  volunteersBySpecialty: Record<string, number>
  averageRating: number
  totalActiveHours: number
  recentJoinings: number
  trainingScheduled: number
  pendingRequests: number
}