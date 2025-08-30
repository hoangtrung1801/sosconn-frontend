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

// Helper function to generate realistic dates
const getDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
const getDaysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
const getHoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

// Area-specific Resource Data
export const getResourcesByArea = (area: string): Resource[] => {
  const baseResources: Resource[] = [
    // Medical Resources
    {
      id: 'med-001',
      name: 'Emergency Medical Kit',
      category: 'medical',
      type: 'First Aid Supplies',
      description: 'Comprehensive emergency medical kit with bandages, antiseptics, and basic medications',
      quantity: 50,
      availableQuantity: 42,
      unit: 'kits',
      location: `${area} Emergency Depot`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getDaysAgo(1),
      condition: 'excellent',
      cost: 150,
      supplier: 'MediCorp Vietnam',
      expiryDate: getDaysFromNow(365)
    },
    {
      id: 'med-002',
      name: 'Portable Defibrillator',
      category: 'medical',
      type: 'Life Support Equipment',
      description: 'Automated External Defibrillator (AED) for cardiac emergencies',
      quantity: 8,
      availableQuantity: 6,
      unit: 'units',
      location: `${area} Health Center`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getDaysAgo(2),
      condition: 'excellent',
      cost: 2500
    },
    {
      id: 'med-003',
      name: 'Oxygen Tanks',
      category: 'medical',
      type: 'Respiratory Support',
      description: 'Portable oxygen tanks for emergency respiratory support',
      quantity: 25,
      availableQuantity: 18,
      unit: 'tanks',
      location: `${area} Emergency Depot`,
      status: 'available',
      priority: 'high',
      lastUpdated: getDaysAgo(0.5),
      condition: 'good'
    },

    // Equipment Resources
    {
      id: 'eq-001',
      name: 'Water Pumps',
      category: 'equipment',
      type: 'Drainage Equipment',
      description: 'High-capacity water pumps for flood control and drainage',
      quantity: 15,
      availableQuantity: 11,
      unit: 'pumps',
      location: `${area} Equipment Yard`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getHoursAgo(6),
      condition: 'excellent',
      specifications: { capacity: '2000 L/min', power: '5.5 HP' }
    },
    {
      id: 'eq-002',
      name: 'Emergency Generators',
      category: 'equipment',
      type: 'Power Supply',
      description: 'Portable diesel generators for emergency power supply',
      quantity: 12,
      availableQuantity: 8,
      unit: 'generators',
      location: `${area} Equipment Yard`,
      status: 'available',
      priority: 'high',
      lastUpdated: getDaysAgo(1),
      condition: 'good',
      specifications: { power: '10 kW', fuel: 'Diesel', runtime: '12 hours' }
    },
    {
      id: 'eq-003',
      name: 'Emergency Lighting',
      category: 'equipment',
      type: 'Lighting Systems',
      description: 'Portable LED floodlights for emergency illumination',
      quantity: 30,
      availableQuantity: 24,
      unit: 'units',
      location: `${area} Equipment Yard`,
      status: 'available',
      priority: 'medium',
      lastUpdated: getDaysAgo(2),
      condition: 'excellent'
    },

    // Vehicle Resources
    {
      id: 'veh-001',
      name: 'Emergency Response Vehicles',
      category: 'vehicles',
      type: 'Emergency Transport',
      description: 'Specialized emergency response vehicles with medical equipment',
      quantity: 6,
      availableQuantity: 4,
      unit: 'vehicles',
      location: `${area} Fire Station`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getHoursAgo(4),
      condition: 'excellent'
    },
    {
      id: 'veh-002',
      name: 'Rescue Boats',
      category: 'vehicles',
      type: 'Marine Rescue',
      description: 'Inflatable rescue boats for water rescue operations',
      quantity: 10,
      availableQuantity: 7,
      unit: 'boats',
      location: `${area} Marine Base`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getHoursAgo(2),
      condition: 'good'
    },
    {
      id: 'veh-003',
      name: 'Evacuation Buses',
      category: 'vehicles',
      type: 'Mass Transport',
      description: 'Buses designated for emergency evacuation operations',
      quantity: 8,
      availableQuantity: 6,
      unit: 'buses',
      location: `${area} Transport Hub`,
      status: 'available',
      priority: 'high',
      lastUpdated: getDaysAgo(1),
      condition: 'good'
    },

    // Supply Resources
    {
      id: 'sup-001',
      name: 'Emergency Food Supplies',
      category: 'supplies',
      type: 'Food & Nutrition',
      description: 'Ready-to-eat meals and water for emergency relief',
      quantity: 5000,
      availableQuantity: 3200,
      unit: 'meals',
      location: `${area} Supply Warehouse`,
      status: 'available',
      priority: 'high',
      lastUpdated: getDaysAgo(1),
      condition: 'excellent',
      expiryDate: getDaysFromNow(180)
    },
    {
      id: 'sup-002',
      name: 'Emergency Blankets',
      category: 'supplies',
      type: 'Shelter & Warmth',
      description: 'Thermal emergency blankets for shelter operations',
      quantity: 2000,
      availableQuantity: 1650,
      unit: 'blankets',
      location: `${area} Supply Warehouse`,
      status: 'available',
      priority: 'medium',
      lastUpdated: getDaysAgo(3),
      condition: 'excellent'
    },
    {
      id: 'sup-003',
      name: 'Water Purification Tablets',
      category: 'supplies',
      type: 'Water Treatment',
      description: 'Water purification tablets for emergency water supply',
      quantity: 10000,
      availableQuantity: 8500,
      unit: 'tablets',
      location: `${area} Supply Warehouse`,
      status: 'available',
      priority: 'critical',
      lastUpdated: getDaysAgo(2),
      condition: 'excellent',
      expiryDate: getDaysFromNow(720)
    }
  ]

  // Area-specific adjustments
  switch (area) {
    case 'hai-chau':
      return baseResources.map(resource => ({
        ...resource,
        location: resource.location.replace(area, 'Hai Chau District'),
        availableQuantity: Math.floor(resource.availableQuantity * 0.7) // Higher usage in urban center
      }))
    
    case 'son-tra':
      return baseResources.map(resource => ({
        ...resource,
        location: resource.location.replace(area, 'Son Tra District'),
        // Add marine-specific resources
        ...(resource.category === 'vehicles' && resource.type === 'Marine Rescue' ? {
          quantity: resource.quantity + 5,
          availableQuantity: resource.availableQuantity + 3
        } : {})
      }))
    
    case 'thanh-khe':
      return baseResources.map(resource => ({
        ...resource,
        location: resource.location.replace(area, 'Thanh Khe District'),
        // Education area - more medical supplies needed
        ...(resource.category === 'medical' ? {
          quantity: resource.quantity + Math.floor(resource.quantity * 0.3),
          availableQuantity: resource.availableQuantity + Math.floor(resource.availableQuantity * 0.2)
        } : {})
      }))
    
    default:
      return baseResources.map(resource => ({
        ...resource,
        location: resource.location.replace(area, area.charAt(0).toUpperCase() + area.slice(1) + ' District')
      }))
  }
}

export const getResourceAllocationsByArea = (area: string): ResourceAllocation[] => [
  {
    id: 'alloc-001',
    resourceId: 'eq-001',
    allocatedTo: `${area}-flood-task-001`,
    quantity: 4,
    allocatedAt: getHoursAgo(8),
    allocatedBy: 'Emergency Commander',
    status: 'active',
    notes: 'Deployed to flood-affected residential areas'
  },
  {
    id: 'alloc-002',
    resourceId: 'med-001',
    allocatedTo: `${area}-medical-task-002`,
    quantity: 8,
    allocatedAt: getHoursAgo(12),
    allocatedBy: 'Medical Team Lead',
    status: 'active',
    expectedReturn: getDaysFromNow(1)
  },
  {
    id: 'alloc-003',
    resourceId: 'veh-002',
    allocatedTo: `${area}-rescue-task-003`,
    quantity: 3,
    allocatedAt: getDaysAgo(0.5),
    allocatedBy: 'Rescue Operations Manager',
    status: 'returned',
    returnedAt: getHoursAgo(2),
    returnedQuantity: 3
  }
]

export const getResourceRequestsByArea = (area: string): ResourceRequest[] => [
  {
    id: 'req-001',
    requestedBy: `${area} Emergency Team`,
    requestedAt: getHoursAgo(2),
    category: 'medical',
    description: 'Additional medical supplies for evacuation center',
    urgency: 'urgent',
    quantity: 20,
    unit: 'kits',
    justification: 'Increased casualties requiring immediate medical attention',
    status: 'pending'
  },
  {
    id: 'req-002',
    requestedBy: `${area} Logistics Team`,
    requestedAt: getHoursAgo(6),
    category: 'equipment',
    description: 'Heavy-duty water pumps for industrial area',
    urgency: 'immediate',
    quantity: 5,
    unit: 'pumps',
    justification: 'Factory flooding threatening chemical storage areas',
    status: 'approved',
    approvedBy: 'Emergency Director',
    approvedAt: getHoursAgo(5)
  },
  {
    id: 'req-003',
    requestedBy: `${area} Relief Operations`,
    requestedAt: getDaysAgo(0.25),
    category: 'supplies',
    description: 'Emergency food for expanded evacuation center',
    urgency: 'normal',
    quantity: 1000,
    unit: 'meals',
    justification: 'Additional families evacuated, current supplies insufficient',
    status: 'fulfilled',
    fulfillmentDetails: [{
      resourceId: 'sup-001',
      quantity: 1000,
      fulfilledAt: getHoursAgo(4)
    }]
  }
]

// Volunteer Data
export const getVolunteersByArea = (area: string): Volunteer[] => [
  {
    id: 'vol-001',
    name: 'Nguyen Van An',
    email: 'nva.volunteer@gmail.com',
    phone: '+84 987 654 321',
    address: `${area} District, Da Nang City`,
    skills: ['First Aid', 'CPR', 'Emergency Response', 'Vietnamese', 'English'],
    certifications: ['Red Cross First Aid', 'CPR Certified', 'Emergency Medical Technician'],
    availability: {
      status: 'available',
      availableHours: ['08:00-18:00']
    },
    experience: 'experienced',
    specialties: ['medical', 'search_rescue'],
    emergencyContacts: [
      { name: 'Tran Thi Mai', relationship: 'Wife', phone: '+84 987 123 456' }
    ],
    preferences: {
      maxHoursPerWeek: 40,
      preferredLocations: [`${area} District`],
      willingToTravel: true,
      hasTransportation: true
    },
    performanceRating: 4.8,
    totalHours: 245,
    joinedDate: getDaysAgo(180),
    lastActive: getHoursAgo(8),
    isVerified: true,
    backgroundCheckStatus: 'approved'
  },
  {
    id: 'vol-002',
    name: 'Le Thi Hoa',
    email: 'lethihoa.rescue@yahoo.com',
    phone: '+84 976 543 210',
    address: `${area} District, Da Nang City`,
    skills: ['Search and Rescue', 'Radio Communication', 'Boat Operation', 'Swimming'],
    certifications: ['Water Rescue Certification', 'Radio Operator License'],
    availability: {
      status: 'deployed',
      deployedUntil: getDaysFromNow(0.5)
    },
    experience: 'expert',
    specialties: ['search_rescue', 'communication'],
    currentAssignment: {
      taskId: `${area}-rescue-001`,
      assignedAt: getHoursAgo(6),
      location: `${area} Flood Zone`,
      role: 'Water Rescue Specialist'
    },
    emergencyContacts: [
      { name: 'Le Van Duc', relationship: 'Father', phone: '+84 965 432 109' }
    ],
    preferences: {
      maxHoursPerWeek: 50,
      preferredLocations: [`${area} District`, 'Coastal Areas'],
      willingToTravel: true,
      hasTransportation: true
    },
    performanceRating: 4.9,
    totalHours: 380,
    joinedDate: getDaysAgo(365),
    lastActive: getHoursAgo(1),
    isVerified: true,
    backgroundCheckStatus: 'approved'
  },
  {
    id: 'vol-003',
    name: 'Phan Minh Duc',
    email: 'pmduc.logistics@hotmail.com',
    phone: '+84 945 678 901',
    skills: ['Logistics Management', 'Inventory Control', 'Truck Driving', 'Warehouse Operations'],
    certifications: ['Professional Truck License', 'Forklift Operation'],
    availability: {
      status: 'available',
      availableHours: ['06:00-22:00']
    },
    experience: 'experienced',
    specialties: ['logistics', 'evacuation'],
    emergencyContacts: [
      { name: 'Vo Thi Lan', relationship: 'Mother', phone: '+84 934 567 890' }
    ],
    preferences: {
      maxHoursPerWeek: 35,
      preferredLocations: [`${area} District`],
      willingToTravel: false,
      hasTransportation: true
    },
    performanceRating: 4.6,
    totalHours: 156,
    joinedDate: getDaysAgo(120),
    lastActive: getDaysAgo(1),
    isVerified: true,
    backgroundCheckStatus: 'approved'
  },
  {
    id: 'vol-004',
    name: 'Tran Van Hai',
    email: 'tvhai.security@gmail.com',
    phone: '+84 912 345 678',
    skills: ['Security Operations', 'Crowd Control', 'Emergency Evacuation', 'Basic Medical'],
    certifications: ['Security License', 'Crowd Management'],
    availability: {
      status: 'unavailable',
      reason: 'Family emergency'
    },
    experience: 'intermediate',
    specialties: ['security', 'evacuation'],
    emergencyContacts: [
      { name: 'Tran Thi Kim', relationship: 'Sister', phone: '+84 923 456 789' }
    ],
    preferences: {
      maxHoursPerWeek: 30,
      preferredLocations: [`${area} District`],
      willingToTravel: false,
      hasTransportation: false
    },
    performanceRating: 4.3,
    totalHours: 89,
    joinedDate: getDaysAgo(90),
    lastActive: getDaysAgo(3),
    isVerified: true,
    backgroundCheckStatus: 'approved'
  },
  {
    id: 'vol-005',
    name: 'Hoang Thi Linh',
    email: 'htlinh.translator@outlook.com',
    phone: '+84 898 765 432',
    skills: ['English Translation', 'Japanese Translation', 'Cultural Liaison', 'Tourist Assistance'],
    certifications: ['Professional Translator License', 'Tour Guide License'],
    availability: {
      status: 'available',
      availableHours: ['09:00-17:00']
    },
    experience: 'experienced',
    specialties: ['translation', 'communication'],
    emergencyContacts: [
      { name: 'Hoang Van Minh', relationship: 'Husband', phone: '+84 887 654 321' }
    ],
    preferences: {
      maxHoursPerWeek: 25,
      preferredLocations: ['Tourist Areas', `${area} District`],
      willingToTravel: true,
      hasTransportation: true
    },
    performanceRating: 4.7,
    totalHours: 134,
    joinedDate: getDaysAgo(200),
    lastActive: getHoursAgo(12),
    isVerified: true,
    backgroundCheckStatus: 'approved'
  }
]

export const getVolunteerAssignmentsByArea = (area: string): VolunteerAssignment[] => [
  {
    id: 'assign-001',
    volunteerId: 'vol-002',
    taskId: `${area}-rescue-001`,
    assignedBy: 'Emergency Commander',
    assignedAt: getHoursAgo(6),
    role: 'Water Rescue Specialist',
    location: `${area} Flood Zone Alpha`,
    expectedDuration: 12,
    actualStartTime: getHoursAgo(6),
    status: 'active',
    checkInRequired: true,
    lastCheckIn: getHoursAgo(1),
    notes: 'Specialized water rescue operations in flooded residential area'
  },
  {
    id: 'assign-002',
    volunteerId: 'vol-001',
    taskId: `${area}-medical-001`,
    assignedBy: 'Medical Team Lead',
    assignedAt: getDaysAgo(0.25),
    role: 'Emergency Medical Support',
    location: `${area} Evacuation Center`,
    expectedDuration: 8,
    actualStartTime: getDaysAgo(0.25),
    actualEndTime: getHoursAgo(2),
    status: 'completed',
    checkInRequired: true,
    lastCheckIn: getHoursAgo(2),
    completionNotes: 'Excellent performance providing medical support to evacuees',
    rating: 5
  },
  {
    id: 'assign-003',
    volunteerId: 'vol-003',
    taskId: `${area}-logistics-001`,
    assignedBy: 'Logistics Manager',
    assignedAt: getHoursAgo(10),
    role: 'Supply Distribution Coordinator',
    location: `${area} Supply Distribution Point`,
    expectedDuration: 10,
    actualStartTime: getHoursAgo(10),
    status: 'active',
    checkInRequired: false,
    lastCheckIn: getHoursAgo(3)
  }
]

export const getVolunteerRequestsByArea = (area: string): VolunteerRequest[] => [
  {
    id: 'vreq-001',
    requestedBy: `${area} Emergency Operations`,
    requestedAt: getHoursAgo(4),
    requiredSkills: ['Medical', 'CPR', 'First Aid'],
    preferredSpecialties: ['medical'],
    numberOfVolunteers: 3,
    urgency: 'immediate',
    location: `${area} Emergency Shelter`,
    description: 'Medical volunteers needed for increased casualty care at evacuation center',
    estimatedHours: 12,
    startTime: getHoursAgo(2),
    endTime: getDaysFromNow(0.5),
    requirements: ['Medical certification required', 'Immediate availability', 'Own transportation preferred'],
    status: 'open',
    assignedVolunteers: [],
    createdAt: getHoursAgo(4)
  },
  {
    id: 'vreq-002',
    requestedBy: `${area} Search & Rescue`,
    requestedAt: getHoursAgo(8),
    requiredSkills: ['Swimming', 'Water Rescue', 'Boat Operation'],
    preferredSpecialties: ['search_rescue'],
    numberOfVolunteers: 5,
    urgency: 'urgent',
    location: `${area} Flood Zones`,
    description: 'Water rescue volunteers for ongoing flood rescue operations',
    estimatedHours: 16,
    startTime: getHoursAgo(6),
    endTime: getDaysFromNow(1),
    requirements: ['Water rescue certification', 'Strong swimming ability', 'Physical fitness'],
    status: 'partially_filled',
    assignedVolunteers: ['vol-002'],
    createdAt: getHoursAgo(8)
  }
]

export const getVolunteerTrainingsByArea = (_area: string): VolunteerTraining[] => [
  {
    id: 'train-001',
    title: 'Emergency Water Rescue Training',
    description: 'Comprehensive training for water rescue operations in flood scenarios',
    category: 'safety',
    duration: 8,
    scheduledFor: getDaysFromNow(7),
    maxParticipants: 20,
    registeredVolunteers: ['vol-003', 'vol-004', 'vol-005'],
    completedVolunteers: [],
    requirements: ['Basic swimming ability', 'Physical fitness clearance'],
    status: 'scheduled',
    materials: ['Training Manual', 'Safety Equipment', 'Practice Pool Access']
  },
  {
    id: 'train-002',
    title: 'Advanced First Aid & CPR Certification',
    description: 'Advanced medical response training for emergency volunteers',
    category: 'first_aid',
    duration: 6,
    scheduledFor: getDaysFromNow(14),
    maxParticipants: 15,
    registeredVolunteers: ['vol-004', 'vol-005'],
    completedVolunteers: [
      {
        volunteerId: 'vol-001',
        completedAt: getDaysAgo(30),
        score: 95,
        certificateIssued: true
      }
    ],
    requirements: ['Basic First Aid knowledge', 'No medical contraindications'],
    status: 'scheduled'
  }
]

// Statistics Generation
export const generateResourceStatistics = (resources: Resource[]): ResourceStatistics => {
  const totalResources = resources.length
  const availableResources = resources.filter(r => r.status === 'available').length
  const deployedResources = resources.filter(r => r.status === 'deployed').length
  
  const resourcesByCategory = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1
    return acc
  }, {} as Record<Resource['category'], number>)

  const criticalResourcesLow = resources.filter(r => 
    r.availableQuantity <= (r.quantity * 0.2) && r.status === 'available'
  )

  return {
    totalResources,
    availableResources,
    deployedResources,
    resourcesByCategory,
    criticalResourcesLow,
    allocationRate: totalResources > 0 ? (deployedResources / totalResources) * 100 : 0,
    maintenanceScheduled: resources.filter(r => r.status === 'maintenance').length,
    pendingRequests: Math.floor(Math.random() * 5) + 1
  }
}

export const generateVolunteerStatistics = (volunteers: Volunteer[]): VolunteerStatistics => {
  const totalVolunteers = volunteers.length
  const availableVolunteers = volunteers.filter(v => v.availability.status === 'available').length
  const deployedVolunteers = volunteers.filter(v => v.availability.status === 'deployed').length
  
  const volunteersBySpecialty = volunteers.reduce((acc, volunteer) => {
    volunteer.specialties.forEach(specialty => {
      acc[specialty] = (acc[specialty] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const ratingsSum = volunteers.reduce((sum, v) => sum + (v.performanceRating || 0), 0)
  const averageRating = totalVolunteers > 0 ? ratingsSum / totalVolunteers : 0

  const totalActiveHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0)

  return {
    totalVolunteers,
    availableVolunteers,
    deployedVolunteers,
    volunteersBySpecialty,
    averageRating,
    totalActiveHours,
    recentJoinings: volunteers.filter(v => 
      new Date(v.joinedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    trainingScheduled: Math.floor(Math.random() * 3) + 1,
    pendingRequests: Math.floor(Math.random() * 4) + 1
  }
}