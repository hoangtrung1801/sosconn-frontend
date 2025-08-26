import type { EOPReport } from "@/types/eop.type"

// Helper function to generate realistic dates
const getDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
const getDaysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

// Mock EOP Reports with comprehensive data
export const mockEOPReports: EOPReport[] = [
  {
    id: "eop-2024-001",
    title: "Severe Flood Response Plan - Mekong Delta Region",
    generatedAt: getDaysAgo(2),
    status: "active",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "An Giang, Dong Thap, Can Tho, Long An",
      severityLevel: "critical",
      dateFrom: getDaysAgo(1),
      dateTo: getDaysFromNow(14),
      additionalInfo: "Monsoon season flooding with water levels exceeding 2.5m above normal. Approximately 150,000 people at risk."
    },
    content: `# Severe Flood Response Plan - Mekong Delta Region

## Executive Summary
This Emergency Operation Plan addresses the severe flooding situation in the Mekong Delta region caused by unprecedented monsoon rainfall and upstream dam releases. The plan coordinates response efforts across multiple provinces to ensure public safety and minimize economic impact.

## Situation Assessment
- **Flood Level**: 2.5m above normal seasonal levels
- **Affected Population**: ~150,000 residents
- **Infrastructure Impact**: 85 schools, 23 healthcare facilities, major highways
- **Agricultural Loss**: 45,000 hectares of rice paddies submerged
- **Duration Estimate**: 14-21 days

## Immediate Response Actions (0-72 hours)

### 1. Search and Rescue Operations
- Deploy 12 rescue boats across affected areas
- Establish 6 temporary rescue coordination centers
- Coordinate with Vietnam Navy for additional marine assets
- Set up emergency medical stations at evacuation centers

### 2. Evacuation Procedures
- Mandatory evacuation for areas with water levels >1.5m
- Activate 15 designated evacuation centers
- Coordinate transportation for elderly and disabled residents
- Establish pet-friendly evacuation areas

### 3. Emergency Communications
- Activate emergency broadcast system
- Deploy mobile communication units where infrastructure is damaged
- Coordinate with telecom providers for priority restoration
- Establish community liaison officers in each district

## Resource Deployment

### Human Resources
- **Emergency Response Teams**: 450 personnel
- **Medical Personnel**: 85 doctors, 120 nurses, 45 paramedics
- **Search & Rescue**: 180 trained personnel with 35 boats
- **Logistics Support**: 200 volunteers coordinated by Red Cross

### Equipment & Supplies
- **Emergency Shelters**: Capacity for 25,000 displaced residents
- **Medical Supplies**: 30-day stock for 50,000 people
- **Food & Water**: 14-day emergency rations, water purification systems
- **Transportation**: 25 evacuation buses, 12 amphibious vehicles

## Coordination Structure
- **Incident Command**: Provincial Emergency Operations Center
- **Field Operations**: District-level command posts
- **Inter-agency Coordination**: Daily briefings with military, NGOs
- **International Support**: ASEAN Disaster Response coordination

## Recovery Planning
- Infrastructure damage assessment teams deployed
- Agricultural support for affected farmers
- Economic assistance program activation
- Psychological support services for trauma victims

---
*Plan Status: Active | Last Updated: ${new Date(getDaysAgo(2)).toLocaleString()}*`,
    tasks: [
      {
        id: "task-flood-001",
        title: "Deploy Emergency Rescue Teams",
        description: "Deploy 12 rescue boat teams to priority flood zones in An Giang and Dong Thap provinces",
        priority: "high",
        assignedTo: "Emergency Response Command",
        deadline: getDaysFromNow(0.5), // 12 hours
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-flood-002", 
        title: "Activate Evacuation Centers",
        description: "Open and staff all 15 designated evacuation centers with full capacity",
        priority: "high",
        assignedTo: "Civil Defense Team",
        deadline: getDaysFromNow(0.25), // 6 hours
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-flood-003",
        title: "Medical Supply Distribution",
        description: "Distribute emergency medical supplies to all evacuation centers and field hospitals",
        priority: "medium",
        assignedTo: "Medical Logistics Team",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "response"
      },
      {
        id: "task-flood-004",
        title: "Infrastructure Assessment",
        description: "Conduct damage assessment of critical infrastructure including hospitals, schools, and transportation networks",
        priority: "medium",
        assignedTo: "Engineering Assessment Team",
        deadline: getDaysFromNow(3),
        status: "pending",
        category: "recovery"
      }
    ]
  },
  {
    id: "eop-2024-002",
    title: "Earthquake Preparedness Plan - Central Highlands",
    generatedAt: getDaysAgo(5),
    status: "confirmed",
    disasterInfo: {
      disasterType: "earthquake",
      affectedArea: "Dak Lak, Gia Lai, Kon Tum, Dak Nong",
      severityLevel: "high",
      dateFrom: getDaysAgo(4),
      dateTo: getDaysFromNow(30),
      additionalInfo: "Magnitude 6.2 earthquake with multiple aftershocks expected. Mountainous terrain complicates rescue operations."
    },
    content: `# Earthquake Preparedness Plan - Central Highlands

## Seismic Event Overview
A magnitude 6.2 earthquake struck the Central Highlands region, with the epicenter located 15km northwest of Buon Ma Thuot. Significant aftershocks are expected over the next 30 days.

## Affected Areas and Population
- **Primary Impact Zone**: 50km radius from epicenter
- **Secondary Impact**: Extended to provincial capitals
- **Population at Risk**: ~180,000 residents
- **Vulnerable Infrastructure**: Highland settlements, mountain roads

## Immediate Response Protocol

### Phase 1: Emergency Response (0-24 hours)
1. **Search and Rescue Activation**
   - Deploy specialized mountain rescue teams
   - Coordinate with military helicopter units
   - Establish field triage centers

2. **Structural Safety Assessment** 
   - Inspect all critical facilities (hospitals, schools, government buildings)
   - Red-tag unsafe structures immediately
   - Establish temporary safe zones

3. **Communication Systems**
   - Deploy satellite communication units
   - Establish emergency broadcast protocols
   - Coordinate with national emergency services

### Phase 2: Stabilization (1-7 days)
- Set up temporary housing for displaced residents
- Restore essential services (power, water, medical)
- Continue aftershock monitoring
- Coordinate international aid if needed

### Phase 3: Recovery (1-4 weeks)
- Permanent housing assessment and planning
- Infrastructure rebuilding prioritization
- Economic support for affected businesses
- Long-term geological monitoring setup

## Resource Requirements
- **Mountain Rescue Teams**: 8 specialized units
- **Medical Facilities**: 5 field hospitals, trauma surgeons
- **Heavy Equipment**: Excavators, cranes for debris removal
- **Communication**: Satellite phones, portable radio systems

---
*This plan coordinates with national seismic monitoring systems and international earthquake response protocols.*`,
    tasks: [
      {
        id: "task-eq-001",
        title: "Deploy Mountain Rescue Teams",
        description: "Send 8 specialized mountain rescue teams to affected highland areas",
        priority: "high",
        assignedTo: "Mountain Rescue Command",
        deadline: getDaysFromNow(0.33), // 8 hours
        status: "completed",
        category: "response"
      },
      {
        id: "task-eq-002",
        title: "Structural Safety Inspections",
        description: "Complete safety assessment of all critical infrastructure in affected areas",
        priority: "high",
        assignedTo: "Engineering Safety Team",
        deadline: getDaysFromNow(2),
        status: "in_progress", 
        category: "response"
      },
      {
        id: "task-eq-003",
        title: "Aftershock Monitoring Setup",
        description: "Install additional seismic monitoring equipment in the affected region",
        priority: "medium",
        assignedTo: "Geological Survey Team",
        deadline: getDaysFromNow(5),
        status: "pending",
        category: "preparation"
      }
    ]
  },
  {
    id: "eop-2024-003", 
    title: "Typhoon Preparedness - Coastal Provinces",
    generatedAt: getDaysAgo(7),
    status: "confirmed",
    disasterInfo: {
      disasterType: "storm",
      affectedArea: "Quang Ninh, Hai Phong, Thai Binh, Nam Dinh",
      severityLevel: "high",
      dateFrom: getDaysFromNow(2),
      dateTo: getDaysFromNow(5),
      additionalInfo: "Category 3 typhoon approaching with winds up to 185 km/h. Storm surge expected up to 3 meters."
    },
    content: `# Typhoon Preparedness Plan - Northern Coastal Provinces

## Storm Overview
**Typhoon Minh** is approaching the northern coast of Vietnam as a Category 3 storm with maximum sustained winds of 185 km/h. Landfall expected in 48-72 hours.

## Projected Impact Assessment
- **Wind Speeds**: 150-185 km/h sustained, gusts up to 220 km/h
- **Storm Surge**: 2-3 meters above normal high tide
- **Rainfall**: 200-350mm over 24-hour period
- **Affected Population**: ~500,000 coastal residents

## Pre-Landfall Actions (48-72 hours before impact)

### Evacuation Operations
1. **Mandatory Evacuation Zones**
   - All coastal areas within 2km of shoreline
   - Low-lying areas prone to flooding
   - Temporary structures and fishing communities
   
2. **Evacuation Centers**
   - Activate 45 inland evacuation facilities
   - Capacity for 75,000 evacuees
   - Special provisions for families with pets
   
3. **Transportation Coordination**
   - Deploy 80 evacuation buses
   - Coordinate with Vietnam Railways for inland transport
   - Establish evacuation routes with police escort

### Infrastructure Protection
- Secure all ports and harbors
- Power grid shutdown in high-risk areas
- Water treatment facility protection measures
- Hospital backup generator testing

### Supply Pre-positioning
- 7-day emergency supplies for 100,000 people
- Medical supplies at inland hospitals
- Fuel reserves for emergency vehicles
- Communication equipment backups

## During Storm Operations
- Emergency services sheltering protocols
- Damage assessment teams on standby
- Medical emergency response coordination
- Search and rescue preparation

## Post-Storm Recovery
- Rapid damage assessment within 6 hours
- Priority restoration of critical infrastructure
- Debris clearance operations
- Economic support activation

---
*Coordination with National Meteorological Center for real-time storm tracking.*`,
    tasks: [
      {
        id: "task-ty-001",
        title: "Issue Evacuation Orders",
        description: "Issue mandatory evacuation orders for all coastal zones within 2km of shoreline",
        priority: "high",
        assignedTo: "Provincial Emergency Committee",
        deadline: getDaysFromNow(1.5), // 36 hours before landfall
        status: "pending",
        category: "preparation"
      },
      {
        id: "task-ty-002",
        title: "Activate Evacuation Centers",
        description: "Open and fully staff all 45 designated evacuation centers",
        priority: "high",
        assignedTo: "Civil Defense Corps",
        deadline: getDaysFromNow(1.75), // 42 hours
        status: "pending",
        category: "preparation"
      },
      {
        id: "task-ty-003",
        title: "Secure Critical Infrastructure",
        description: "Complete protection measures for hospitals, power stations, and water facilities",
        priority: "medium",
        assignedTo: "Infrastructure Security Team",
        deadline: getDaysFromNow(1.25), // 30 hours
        status: "pending",
        category: "preparation"
      }
    ]
  },
  {
    id: "eop-2024-004",
    title: "Industrial Fire Response - Ho Chi Minh City",
    generatedAt: getDaysAgo(12),
    status: "confirmed", 
    disasterInfo: {
      disasterType: "fire",
      affectedArea: "District 7, Ho Chi Minh City Industrial Zone",
      severityLevel: "medium",
      dateFrom: getDaysAgo(11),
      dateTo: getDaysFromNow(7),
      additionalInfo: "Chemical plant fire with potential toxic smoke. 5km evacuation radius established."
    },
    content: `# Industrial Fire Response Plan - HCMC Industrial Zone

## Incident Overview
Major industrial fire at Saigon Chemical Manufacturing facility in District 7. Fire involves chemical storage areas with potential for toxic smoke dispersion.

## Hazard Assessment
- **Fire Scope**: 15,000 m² manufacturing facility
- **Chemical Hazards**: Ammonia, sulfuric acid, petroleum products
- **Smoke Plume**: Extending 8km northeast with prevailing winds
- **Evacuation Radius**: 5km precautionary zone

## Response Operations

### Fire Suppression
- **Fire Department Response**: 25 fire trucks, 120 firefighters
- **Specialized Units**: HAZMAT teams, foam suppression systems
- **Industrial Support**: Plant safety team coordination
- **Water Supply**: Mobile water tankers, industrial hydrants

### Evacuation and Safety
- **Affected Residents**: ~12,000 people in evacuation zone
- **Evacuation Centers**: 8 facilities in Districts 1, 2, and 8
- **Transportation**: City bus fleet for resident transport
- **Medical Screening**: Air quality monitoring, respiratory checks

### Environmental Monitoring
- **Air Quality Sensors**: Real-time toxic gas monitoring
- **Water Contamination**: Testing of nearby Saigon River
- **Soil Assessment**: Long-term contamination evaluation
- **Wildlife Protection**: Coordination with environmental agencies

### Traffic and Access Control
- **Road Closures**: Major highways and local streets
- **Emergency Access Routes**: Maintained for response vehicles
- **Public Transport**: Diverted bus and metro routes
- **Commercial Impact**: Temporary business relocations

## Recovery Phases
1. **Immediate (0-48 hours)**: Fire suppression, evacuation completion
2. **Short-term (2-14 days)**: Environmental cleanup, resident return
3. **Long-term (1-6 months)**: Facility reconstruction, environmental restoration

---
*Coordinated with Vietnam Fire Prevention Department and Environmental Protection Agency.*`,
    tasks: [
      {
        id: "task-fire-001",
        title: "Complete Fire Suppression",
        description: "Fully extinguish industrial fire and secure chemical storage areas",
        priority: "high",
        assignedTo: "HCMC Fire Department",
        deadline: getDaysFromNow(0.5), // 12 hours
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-fire-002",
        title: "Air Quality Assessment",
        description: "Comprehensive air quality testing before allowing resident return",
        priority: "high",
        assignedTo: "Environmental Monitoring Team",
        deadline: getDaysFromNow(2),
        status: "pending",
        category: "response"
      },
      {
        id: "task-fire-003",
        title: "Evacuation Center Management",
        description: "Maintain evacuation centers until safe return conditions confirmed",
        priority: "medium",
        assignedTo: "Emergency Shelter Team",
        deadline: getDaysFromNow(3),
        status: "in_progress",
        category: "response"
      }
    ]
  },
  {
    id: "eop-2024-005",
    title: "Landslide Emergency Response - Northern Mountains",
    generatedAt: getDaysAgo(20),
    status: "active",
    disasterInfo: {
      disasterType: "landslide",
      affectedArea: "Lao Cai, Ha Giang, Cao Bang",
      severityLevel: "high", 
      dateFrom: getDaysAgo(19),
      dateTo: getDaysFromNow(21),
      additionalInfo: "Multiple landslides triggered by heavy rainfall. Remote mountain communities isolated."
    },
    content: `# Landslide Emergency Response Plan - Northern Mountain Region

## Geological Emergency Overview
Severe rainfall has triggered multiple landslides across the northern mountain provinces, isolating 15 remote communities and blocking major transportation routes.

## Affected Areas
- **Primary Impact**: Sa Pa, Dong Van, Tra Linh districts  
- **Isolated Communities**: 15 villages, ~8,500 residents
- **Infrastructure Damage**: 45km of mountain roads, 3 bridges destroyed
- **Communication**: 8 villages without phone/internet connectivity

## Search and Rescue Operations

### Mountain Rescue Deployment
- **Helicopter Units**: 6 military helicopters for personnel/supply transport
- **Ground Teams**: 12 specialized mountain rescue units
- **Search Dogs**: 8 trained avalanche/disaster search dogs
- **Medical Teams**: Mobile field hospitals with trauma specialists

### Access Route Restoration
- **Heavy Equipment**: Bulldozers, excavators for debris clearance
- **Engineering Corps**: Military engineers for temporary bridge construction
- **Route Priorities**: Medical evacuation paths, supply delivery roads
- **Alternative Transport**: Pack animals, all-terrain vehicles

### Community Support
- **Emergency Supplies**: Food, water, medical supplies via helicopter
- **Communication**: Satellite phones, emergency radio systems
- **Shelter Assessment**: Evaluating homes for continued habitability
- **Evacuation Planning**: For most vulnerable residents

## Risk Assessment and Monitoring
- **Geological Survey**: Ongoing slope stability monitoring
- **Weather Tracking**: Continued rainfall risk assessment
- **Secondary Hazards**: Identifying areas at risk for additional slides
- **Long-term Planning**: Permanent relocation considerations

## International Cooperation
- **Cross-border Coordination**: With Chinese emergency services
- **Technical Assistance**: UN disaster response expertise
- **Equipment Support**: Specialized rescue equipment from regional partners

---
*This operation coordinates with Vietnam Border Guard and international mountain rescue organizations.*`,
    tasks: [
      {
        id: "task-land-001",
        title: "Helicopter Supply Missions",
        description: "Deliver emergency supplies to all 15 isolated communities via helicopter",
        priority: "high",
        assignedTo: "Vietnam Air Force Rescue Wing",
        deadline: getDaysFromNow(1),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-land-002",
        title: "Road Clearance Operations", 
        description: "Clear debris from priority mountain roads to restore access",
        priority: "high",
        assignedTo: "Military Engineering Corps",
        deadline: getDaysFromNow(5),
        status: "in_progress",
        category: "recovery"
      },
      {
        id: "task-land-003",
        title: "Geological Hazard Assessment",
        description: "Complete geological survey of landslide-prone areas for future risk",
        priority: "medium",
        assignedTo: "National Geological Institute",
        deadline: getDaysFromNow(14),
        status: "pending",
        category: "mitigation"
      }
    ]
  },
  {
    id: "eop-2024-006",
    title: "Drought Management Plan - Central Coast",
    generatedAt: getDaysAgo(30),
    status: "draft",
    disasterInfo: {
      disasterType: "storm", // Using storm as closest available type
      affectedArea: "Binh Dinh, Phu Yen, Khanh Hoa, Ninh Thuan",
      severityLevel: "medium",
      dateFrom: getDaysAgo(60),
      dateTo: getDaysFromNow(120),
      additionalInfo: "Severe drought conditions affecting agricultural production. Water reservoirs at 25% capacity."
    },
    content: `# Drought Management Plan - Central Coast Provinces

## Drought Conditions Assessment
The central coast region is experiencing severe drought conditions with rainfall 65% below normal for the past 3 months. Water reservoirs are critically low.

## Impact Analysis
- **Agricultural**: 85,000 hectares of rice and crops affected
- **Water Supply**: 200,000 residents with limited water access
- **Economic**: Estimated $45 million in agricultural losses
- **Livestock**: 150,000 cattle and buffalo requiring emergency water

## Water Resource Management

### Emergency Water Supply
- **Mobile Water Trucks**: 50 trucks delivering to rural areas
- **Community Wells**: Drilling 25 emergency wells
- **Water Rationing**: Scheduled water distribution in urban areas
- **Desalination**: Temporary coastal desalination units

### Agricultural Support
- **Crop Switching**: Support for drought-resistant crop varieties
- **Irrigation Efficiency**: Drip irrigation system subsidies
- **Livestock Support**: Emergency feed and water for animals
- **Farmer Assistance**: Financial support and technical guidance

### Long-term Solutions
- **Water Storage**: Planning for additional reservoir capacity
- **Infrastructure**: Improved water distribution networks
- **Conservation**: Public awareness and water-saving programs
- **Climate Adaptation**: Long-term drought-resistant planning

---
*Coordinated with Ministry of Agriculture and Rural Development and Water Resources Ministry.*`,
    tasks: [
      {
        id: "task-drought-001",
        title: "Deploy Emergency Water Trucks",
        description: "Send 50 water trucks to provide emergency water supply to affected rural communities",
        priority: "high",
        assignedTo: "Provincial Water Authority",
        deadline: getDaysFromNow(2),
        status: "pending",
        category: "response"
      },
      {
        id: "task-drought-002",
        title: "Emergency Well Drilling",
        description: "Complete drilling of 25 emergency water wells in most affected areas",
        priority: "medium",
        assignedTo: "Water Infrastructure Team",
        deadline: getDaysFromNow(21),
        status: "pending",
        category: "response"
      }
    ]
  },
  {
    id: "eop-2024-007",
    title: "Urban Flood Response - Hanoi Capital",
    generatedAt: getDaysAgo(45),
    status: "confirmed",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "Ba Dinh, Hoan Kiem, Long Bien, Dong Da Districts",
      severityLevel: "low",
      dateFrom: getDaysAgo(40),
      dateTo: getDaysFromNow(5),
      additionalInfo: "Urban flooding due to overwhelmed drainage systems during heavy rainfall season."
    },
    content: `# Urban Flood Response Plan - Hanoi Capital

## Urban Flooding Situation
Heavy rainfall has overwhelmed Hanoi's drainage infrastructure, causing flooding in low-lying urban areas and major transportation disruptions.

## Affected Areas and Infrastructure
- **Flooded Streets**: 125 roads with water levels 20-50cm
- **Transportation**: 15 metro stations, 3 bus terminals affected  
- **Residential**: 8,500 households experiencing basement flooding
- **Commercial**: 450 businesses with ground floor water damage

## Immediate Response Actions

### Traffic and Transportation Management
- **Road Closures**: 25 major streets temporarily closed
- **Alternative Routes**: Emergency traffic routing plans activated
- **Public Transport**: Modified bus and metro schedules
- **Emergency Access**: Maintained routes for ambulances and emergency services

### Drainage and Water Management
- **Pump Stations**: All 45 drainage pumps operating at maximum capacity
- **Street Drainage**: Manual clearing of blocked storm drains
- **Sandbag Operations**: Temporary flood barriers for critical facilities
- **Water Quality**: Monitoring for contamination in flood waters

### Public Safety and Communication
- **Traffic Police**: Additional officers at flood-prone intersections
- **Public Warnings**: Real-time flood alerts via mobile and radio
- **Emergency Shelters**: 5 community centers available if needed
- **Medical Response**: Emergency medical teams positioned strategically

## Recovery Operations
- **Damage Assessment**: Systematic evaluation of infrastructure damage
- **Cleanup Operations**: Street cleaning and debris removal
- **Insurance Coordination**: Support for affected businesses and residents
- **Infrastructure Repair**: Priority restoration of damaged drainage systems

---
*Coordinated with Hanoi Traffic Police, Urban Planning Department, and Municipal Services.*`,
    tasks: [
      {
        id: "task-urban-001",
        title: "Activate All Drainage Pumps",
        description: "Ensure all 45 municipal drainage pumps are operational and running at full capacity",
        priority: "high",
        assignedTo: "Hanoi Municipal Services",
        deadline: getDaysFromNow(0.25), // 6 hours
        status: "completed",
        category: "response"
      },
      {
        id: "task-urban-002",
        title: "Traffic Route Management",
        description: "Implement alternative traffic routing and manage road closures",
        priority: "medium",
        assignedTo: "Hanoi Traffic Police",
        deadline: getDaysFromNow(0.5), // 12 hours
        status: "completed",
        category: "response"
      },
      {
        id: "task-urban-003",
        title: "Infrastructure Damage Assessment",
        description: "Complete assessment of flood damage to drainage and transportation infrastructure",
        priority: "medium",
        assignedTo: "Urban Infrastructure Team",
        deadline: getDaysFromNow(3),
        status: "in_progress",
        category: "recovery"
      }
    ]
  }
]

// Helper function to get mock reports (for use in components)
export const getMockEOPReports = (): EOPReport[] => {
  return mockEOPReports
}

// Helper function to get a specific mock report by ID
export const getMockEOPReportById = (id: string): EOPReport | null => {
  return mockEOPReports.find(report => report.id === id) || null
}