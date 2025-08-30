import type { EOPReport } from "@/types/eop.type"

// Helper function to generate realistic dates
const getDaysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
const getDaysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

// Area-specific EOP Reports for Da Nang Districts
export const areaEOPReports: EOPReport[] = [
  // Hai Chau District - Urban Flooding
  {
    id: "eop-hai-chau-2024",
    title: "Urban Flood Response Plan - Hải Châu District",
    generatedAt: getDaysAgo(1),
    status: "active",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "Hải Châu District, Da Nang City",
      severityLevel: "critical",
      dateFrom: getDaysAgo(0.5),
      dateTo: getDaysFromNow(7),
      additionalInfo: "Severe urban flooding affecting central business district. Water levels 0.8-1.2m in low-lying areas. 45,000 people affected."
    },
    content: `# Urban Flood Response Plan - Hải Châu District

## Emergency Overview
Central business district of Da Nang experiencing severe flooding due to overwhelmed drainage systems and continuous rainfall. Critical infrastructure and commercial areas are significantly impacted.

## Situation Assessment
- **Flood Level**: 0.8-1.2m in CBD areas, 0.4-0.6m in residential zones
- **Affected Population**: ~45,000 residents and workers
- **Infrastructure Impact**: Central Hospital, People's Committee building, 25 schools
- **Economic Impact**: 850+ businesses affected, financial district partially closed
- **Transportation**: Major roads flooded, disrupted public transport

## Immediate Response Actions (0-24 hours)

### 1. Emergency Evacuation
- Evacuate ground floors of critical buildings
- Establish 8 emergency shelters in higher ground locations
- Priority evacuation for Central Hospital patients
- Deploy amphibious vehicles for stranded residents

### 2. Infrastructure Protection
- Activate all 15 drainage pumps at maximum capacity
- Deploy temporary barriers around critical facilities
- Emergency power generators for hospitals and emergency services
- Coordinate with city utilities for service restoration

### 3. Traffic and Access Management
- Close flooded major streets: Tran Phu, Bach Dang, Le Duan
- Establish emergency vehicle corridors
- Deploy traffic police at critical intersections
- Coordinate with taxi and ride services for alternative transport

## Resource Allocation
- **Emergency Personnel**: 180 responders, 45 medical staff
- **Equipment**: 25 water pumps, 12 rescue boats, 8 generators
- **Shelters**: Capacity for 8,000 evacuees across 8 locations
- **Medical**: Field hospital setup, ambulance teams

## Coordination Centers
- **Primary Command**: Hai Chau District Emergency Operations Center
- **Medical Command**: Central Hospital Emergency Wing
- **Traffic Command**: District Traffic Police Station

---
*Plan Status: Active | Updated every 2 hours during emergency*`,
    tasks: [
      {
        id: "task-hc-001",
        title: "Activate Emergency Drainage System",
        description: "Ensure all 15 municipal drainage pumps are operational at full capacity",
        priority: "high",
        assignedTo: "Hai Chau Infrastructure Team",
        deadline: getDaysFromNow(0.25),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-hc-002",
        title: "Central Hospital Protection",
        description: "Deploy barriers and emergency generators to protect Central Hospital operations",
        priority: "high",
        assignedTo: "Medical Emergency Team",
        deadline: getDaysFromNow(0.5),
        status: "pending",
        category: "response"
      },
      {
        id: "task-hc-003",
        title: "Business District Evacuation",
        description: "Coordinate evacuation of ground floor businesses in flood-affected areas",
        priority: "medium",
        assignedTo: "Civil Defense Corps",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "response"
      },
      {
        id: "task-hc-004",
        title: "Traffic Rerouting",
        description: "Implement emergency traffic management for major flooded roads",
        priority: "medium",
        assignedTo: "District Traffic Police",
        deadline: getDaysFromNow(0.75),
        status: "in_progress",
        category: "response"
      }
    ]
  },

  // Son Tra District
  {
    id: "eop-son-tra-2024",
    title: "Storm Surge Response Plan - Sơn Trà District",
    generatedAt: getDaysAgo(1),
    status: "active",
    disasterInfo: {
      disasterType: "storm",
      affectedArea: "Sơn Trà District, Da Nang City",
      severityLevel: "high",
      dateFrom: getDaysAgo(0.5),
      dateTo: getDaysFromNow(5),
      additionalInfo: "Storm surge from tropical storm affecting coastal areas. Waves 3-4m high, coastal flooding expected."
    },
    content: `# Storm Surge Response Plan - Sơn Trà District

## Storm Surge Overview
Tropical storm generating dangerous waves and coastal flooding along Son Tra Peninsula. Tourist areas and coastal communities at high risk.

## Impact Assessment
- **Wave Height**: 3-4 meters with storm surge up to 2m
- **Coastal Flooding**: 500m inland penetration expected
- **Tourist Areas**: My Khe Beach, Linh Ung Pagoda area affected
- **Population**: ~18,000 residents, 12,000 tourists at risk
- **Infrastructure**: Coastal roads, resorts, fishing ports

## Emergency Response Protocol

### Phase 1: Coastal Evacuation (0-12 hours)
- Mandatory evacuation of beachfront hotels and resorts
- Relocate fishing boats to protected harbors
- Clear My Khe Beach and coastal walkways
- Activate 6 inland evacuation centers

### Phase 2: Infrastructure Protection (6-24 hours)
- Deploy sandbags along vulnerable coastal roads
- Secure Linh Ung Pagoda and cultural sites
- Protect telecommunication towers on Ba Na Hills
- Emergency generators for critical facilities

### Phase 3: Search and Rescue Standby
- Position marine rescue teams at strategic locations
- Deploy helicopters for isolated area access
- Coordinate with Coast Guard for offshore emergencies
- Medical teams at evacuation centers

## Resource Deployment
- **Marine Units**: 8 rescue boats, Coast Guard coordination
- **Air Support**: 2 helicopters on standby
- **Evacuation Centers**: 6 sites with 15,000 capacity
- **Emergency Personnel**: 120 responders, 30 medical staff

---
*Coordinated with Da Nang Tourism Department and Coast Guard*`,
    tasks: [
      {
        id: "task-st-001",
        title: "Coastal Resort Evacuation",
        description: "Evacuate all beachfront hotels and resorts to inland safety zones",
        priority: "high",
        assignedTo: "Tourist Area Emergency Team",
        deadline: getDaysFromNow(0.5),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-st-002",
        title: "Harbor Protection",
        description: "Secure fishing boats and marine equipment in protected harbors",
        priority: "high",
        assignedTo: "Marine Safety Team",
        deadline: getDaysFromNow(0.75),
        status: "pending",
        category: "response"
      },
      {
        id: "task-st-003",
        title: "Cultural Site Protection",
        description: "Implement protection measures for Linh Ung Pagoda and historical sites",
        priority: "medium",
        assignedTo: "Cultural Heritage Team",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "response"
      }
    ]
  },

  // Other districts follow similar pattern...
  // Thanh Khe District
  {
    id: "eop-thanh-khe-2024",
    title: "Flash Flood Response Plan - Thanh Khê District",
    generatedAt: getDaysAgo(1),
    status: "active",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "Thanh Khê District, Da Nang City",
      severityLevel: "critical",
      dateFrom: getDaysAgo(0.25),
      dateTo: getDaysFromNow(3),
      additionalInfo: "Flash flooding in educational hub. University campuses and residential areas severely affected."
    },
    content: `# Flash Flood Response Plan - Thanh Khê District

## Flash Flood Emergency
Educational district experiencing rapid flooding due to overwhelmed drainage and upstream water flow. University of Da Nang and residential complexes at high risk.

## Critical Situation
- **Water Level**: Rising rapidly, 0.6-1.0m in low areas
- **Affected Institutions**: University of Da Nang, 15 schools
- **Student Population**: ~25,000 students potentially affected
- **Residential Impact**: 12 apartment complexes, 8,000 families
- **Infrastructure**: Educational facilities, student dormitories

## Emergency Response Actions

### Immediate Evacuation (0-6 hours)
- Emergency evacuation of ground floor dormitories
- Move university equipment and documents to upper floors
- Establish emergency shelters in gymnasium buildings
- Coordinate student transportation to safe areas

### Educational Institution Protection
- Deploy pumps to critical university buildings
- Protect library and computer facilities
- Secure laboratory equipment and chemicals
- Emergency power for research facilities

### Community Response
- Open community centers as temporary shelters
- Deploy mobile medical units to residential areas
- Coordinate with apartment building management
- Emergency food and water distribution

## Resource Coordination
- **Educational Emergency Team**: 85 personnel
- **Student Services**: 45 staff for student evacuation
- **Community Support**: 120 volunteers
- **Equipment**: 18 water pumps, 8 generators

---
*Coordinated with University Administration and Student Affairs*`,
    tasks: [
      {
        id: "task-tk-001",
        title: "University Evacuation Protocol",
        description: "Execute emergency evacuation of all ground-floor dormitories and vulnerable buildings",
        priority: "high",
        assignedTo: "University Emergency Team",
        deadline: getDaysFromNow(0.25),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-tk-002",
        title: "Educational Facility Protection",
        description: "Deploy pumps and barriers to protect critical university infrastructure",
        priority: "high",
        assignedTo: "Facilities Management Team",
        deadline: getDaysFromNow(0.5),
        status: "pending",
        category: "response"
      },
      {
        id: "task-tk-003",
        title: "Student Welfare Management",
        description: "Coordinate temporary housing and support for displaced students",
        priority: "medium",
        assignedTo: "Student Affairs Team",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "response"
      }
    ]
  },

  // Cam Le District
  {
    id: "eop-cam-le-2024",
    title: "River Flood Response Plan - Cẩm Lệ District",
    generatedAt: getDaysAgo(1),
    status: "active",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "Cẩm Lệ District, Da Nang City",
      severityLevel: "high",
      dateFrom: getDaysAgo(0.75),
      dateTo: getDaysFromNow(10),
      additionalInfo: "Cam Le River overflow affecting industrial and agricultural areas. Factory evacuations in progress."
    },
    content: `# River Flood Response Plan - Cẩm Lệ District

## River Flooding Emergency
Cam Le River has exceeded flood stage, affecting industrial zones and agricultural areas. Manufacturing facilities and farming communities require immediate response.

## Flood Impact Assessment
- **River Level**: 2.1m above flood stage
- **Industrial Impact**: 12 factories, 45 warehouses affected
- **Agricultural Loss**: 2,500 hectares of crops flooded
- **Population**: ~8,500 residents in flood-prone areas
- **Infrastructure**: Industrial access roads, irrigation systems

## Industrial Emergency Response

### Factory Evacuation and Safety
- Immediate shutdown of affected manufacturing operations
- Evacuate workers from flooded industrial zones
- Secure hazardous materials and chemicals
- Deploy environmental monitoring teams

### Agricultural Support
- Emergency livestock evacuation to higher ground
- Crop loss assessment for insurance claims
- Support for affected farming families
- Coordinate with agricultural cooperatives

### Infrastructure Protection
- Reinforce river embankments where possible
- Deploy portable barriers for critical facilities
- Emergency road access maintenance
- Backup power for affected communities

## Emergency Resources
- **Industrial Safety Team**: 95 specialists
- **Agricultural Support**: 60 extension workers
- **Environmental Monitoring**: 25 technicians
- **Community Support**: 140 volunteers

---
*Coordinated with Industrial Zone Management and Department of Agriculture*`,
    tasks: [
      {
        id: "task-cl-001",
        title: "Industrial Zone Evacuation",
        description: "Complete evacuation of workers from flooded factory areas and secure hazardous materials",
        priority: "high",
        assignedTo: "Industrial Safety Team",
        deadline: getDaysFromNow(0.5),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-cl-002",
        title: "Livestock Emergency Relocation",
        description: "Evacuate livestock from flooded agricultural areas to safe zones",
        priority: "high",
        assignedTo: "Agricultural Emergency Team",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "response"
      },
      {
        id: "task-cl-003",
        title: "Environmental Impact Assessment",
        description: "Monitor potential chemical contamination from industrial facilities",
        priority: "medium",
        assignedTo: "Environmental Monitoring Team",
        deadline: getDaysFromNow(2),
        status: "pending",
        category: "response"
      }
    ]
  },

  // Lien Chieu District
  {
    id: "eop-lien-chieu-2024",
    title: "Urban Development Flood Response - Liên Chiểu District",
    generatedAt: getDaysAgo(1),
    status: "active",
    disasterInfo: {
      disasterType: "flood",
      affectedArea: "Liên Chiểu District, Da Nang City",
      severityLevel: "high",
      dateFrom: getDaysAgo(0.5),
      dateTo: getDaysFromNow(6),
      additionalInfo: "New urban development areas experiencing flooding due to inadequate drainage infrastructure."
    },
    content: `# Urban Development Flood Response Plan - Liên Chiểu District

## Development Area Flooding
Rapidly expanding urban district facing infrastructure challenges during flooding. New residential complexes and incomplete drainage systems are particularly vulnerable.

## Affected Development Areas
- **New Residential**: 25 apartment complexes, 15,000 residents
- **Under Construction**: 8 building projects temporarily halted
- **Infrastructure**: Incomplete drainage, temporary roads flooded
- **Transportation**: New bus routes disrupted, bridge access limited

## Emergency Response Strategy

### Residential Community Protection
- Evacuate ground-floor apartments in vulnerable complexes
- Deploy portable pumps to residential areas
- Establish community emergency centers in newer buildings
- Coordinate with building management companies

### Construction Site Safety
- Secure construction sites and equipment
- Prevent environmental hazards from building materials
- Protect ongoing infrastructure projects
- Coordinate with developers for emergency access

### Infrastructure Emergency Measures
- Deploy mobile pumping stations
- Create temporary drainage channels
- Emergency road repairs for access routes
- Coordinate utilities restoration

## Resource Deployment
- **Urban Planning Emergency Team**: 70 specialists
- **Construction Safety Team**: 55 inspectors
- **Community Response**: 180 volunteers
- **Equipment**: 22 mobile pumps, 6 generators

---
*Coordinated with Urban Planning Department and Construction Management*`,
    tasks: [
      {
        id: "task-lc-001",
        title: "Apartment Complex Safety",
        description: "Evacuate vulnerable ground-floor apartments and establish emergency centers",
        priority: "high",
        assignedTo: "Community Emergency Team",
        deadline: getDaysFromNow(0.75),
        status: "in_progress",
        category: "response"
      },
      {
        id: "task-lc-002",
        title: "Construction Site Security",
        description: "Secure all construction sites and prevent environmental hazards",
        priority: "medium",
        assignedTo: "Construction Safety Team",
        deadline: getDaysFromNow(1.5),
        status: "pending",
        category: "response"
      },
      {
        id: "task-lc-003",
        title: "Mobile Drainage Deployment",
        description: "Deploy mobile pumping stations to areas with inadequate drainage",
        priority: "high",
        assignedTo: "Infrastructure Emergency Team",
        deadline: getDaysFromNow(0.5),
        status: "pending",
        category: "response"
      }
    ]
  },

  // Ngu Hanh Son District
  {
    id: "eop-ngu-hanh-son-2024",
    title: "Landslide Prevention Plan - Ngũ Hành Sơn District",
    generatedAt: getDaysAgo(1),
    status: "confirmed",
    disasterInfo: {
      disasterType: "landslide",
      affectedArea: "Ngũ Hành Sơn District, Da Nang City",
      severityLevel: "medium",
      dateFrom: getDaysAgo(0.25),
      dateTo: getDaysFromNow(14),
      additionalInfo: "Heavy rainfall creating landslide risk around Marble Mountains. Tourist areas and cave systems monitoring required."
    },
    content: `# Landslide Prevention Plan - Ngũ Hành Sơn District

## Landslide Risk Assessment
Marble Mountains area experiencing increased landslide risk due to continuous rainfall. Tourist attractions and residential areas near mountain slopes require monitoring and preventive measures.

## Risk Areas Identified
- **Marble Mountains**: Cave systems and tourist paths
- **Tourist Areas**: Linh Ung Pagoda, cave entrance areas
- **Residential**: 15 neighborhoods near mountain base
- **Infrastructure**: Access roads, parking areas, tourist facilities

## Preventive Response Actions

### Tourist Area Safety
- Temporary closure of high-risk cave tours
- Evacuate visitors from dangerous cliff areas
- Deploy safety personnel at tourist access points
- Emergency communication systems for isolated areas

### Geological Monitoring
- Install temporary slope monitoring equipment
- Regular geological assessment of vulnerable areas
- Coordinate with geological survey teams
- Early warning system activation

### Community Preparedness
- Evacuation planning for at-risk residential areas
- Emergency shelter identification in safe zones
- Community alert systems activation
- Coordination with local tourism operators

## Specialized Resources
- **Geological Team**: 35 specialists
- **Tourist Safety**: 45 guides and safety personnel
- **Mountain Rescue**: 25 trained responders
- **Monitoring Equipment**: Slope sensors, communication systems

---
*Coordinated with Tourism Department and Geological Institute*`,
    tasks: [
      {
        id: "task-nhs-001",
        title: "Cave System Safety Assessment",
        description: "Complete safety evaluation of all cave tours and tourist areas",
        priority: "high",
        assignedTo: "Tourist Safety Team",
        deadline: getDaysFromNow(0.5),
        status: "in_progress",
        category: "preparation"
      },
      {
        id: "task-nhs-002",
        title: "Slope Monitoring Installation",
        description: "Deploy geological monitoring equipment on high-risk slopes",
        priority: "medium",
        assignedTo: "Geological Survey Team",
        deadline: getDaysFromNow(2),
        status: "pending",
        category: "preparation"
      },
      {
        id: "task-nhs-003",
        title: "Tourist Evacuation Planning",
        description: "Develop evacuation procedures for tourists in mountainous areas",
        priority: "medium",
        assignedTo: "Tourism Emergency Team",
        deadline: getDaysFromNow(1),
        status: "pending",
        category: "preparation"
      }
    ]
  }
]

// Mapping areas to their EOP reports
export const areaToEOPMapping: Record<string, string> = {
  "hai-chau": "eop-hai-chau-2024",
  "son-tra": "eop-son-tra-2024", 
  "thanh-khe": "eop-thanh-khe-2024",
  "cam-le": "eop-cam-le-2024",
  "lien-chieu": "eop-lien-chieu-2024",
  "ngu-hanh-son": "eop-ngu-hanh-son-2024"
}

// Helper function to get EOP report by area
export const getEOPReportByArea = (area: string): EOPReport | null => {
  const eopId = areaToEOPMapping[area]
  if (!eopId) return null
  return areaEOPReports.find(report => report.id === eopId) || null
}

// Keep original mock data for backward compatibility
export const mockEOPReports: EOPReport[] = areaEOPReports

// Helper functions for backward compatibility
export const getMockEOPReports = (): EOPReport[] => {
  return areaEOPReports
}

export const getMockEOPReportById = (id: string): EOPReport | null => {
  return areaEOPReports.find(report => report.id === id) || null
}