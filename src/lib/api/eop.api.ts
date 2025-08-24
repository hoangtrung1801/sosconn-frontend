// import request from "@/lib/http"
import type { CreateEOPRequest, EOPReport, GenerateEOPResponse, ConfirmEOPRequest } from "@/types/eop.type"

export const URL_GENERATE_EOP = "/eop/generate"
export const URL_CONFIRM_EOP = "/eop/confirm"

// Mock API implementation for development
const mockGenerateEOP = async (data: CreateEOPRequest): Promise<GenerateEOPResponse> => {
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 3000))

  const reportId = `eop-${Date.now()}`
  
  const mockContent = `# Emergency Operation Plan

## Disaster Information
- **Type**: ${data.disasterType.charAt(0).toUpperCase() + data.disasterType.slice(1)}
- **Period**: ${data.dateFrom} to ${data.dateTo}
- **Affected Area**: ${data.affectedArea}
- **Severity Level**: ${data.severityLevel.charAt(0).toUpperCase() + data.severityLevel.slice(1)}

## Situation Analysis
Based on the disaster information provided, this Emergency Operation Plan outlines the necessary response procedures and coordination efforts.

## Objectives
1. Ensure public safety and minimize casualties
2. Coordinate emergency response efforts
3. Manage resources effectively
4. Facilitate recovery operations

## Response Strategy
### Immediate Actions (0-72 hours)
- Activate emergency response teams
- Establish command and control center
- Conduct damage assessment
- Deploy rescue and relief operations

### Short-term Actions (3-7 days)
- Continue search and rescue operations
- Provide emergency shelter and supplies
- Restore critical infrastructure
- Coordinate with relief agencies

### Long-term Recovery (1-4 weeks)
- Assess infrastructure damage
- Plan reconstruction efforts
- Support affected communities
- Monitor ongoing risks

${data.additionalInfo ? `## Additional Considerations\n${data.additionalInfo}` : ''}

## Resources and Contacts
- Emergency Operations Center: 24/7 active
- Medical Response Teams: On standby
- Search and Rescue Units: Deployed
- Relief Organizations: Coordinating

---
*This plan was generated on ${new Date().toLocaleString()} and should be reviewed regularly.*`

  const mockTasks = [
    {
      id: "task-1",
      title: "Activate Emergency Response Team",
      description: "Deploy first response team to affected area",
      priority: "high" as const,
      assignedTo: "Emergency Coordinator",
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      status: "pending" as const,
      category: "response" as const
    },
    {
      id: "task-2", 
      title: "Establish Command Center",
      description: "Set up emergency operations command center",
      priority: "high" as const,
      assignedTo: "Operations Manager",
      deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
      status: "pending" as const,
      category: "preparation" as const
    },
    {
      id: "task-3",
      title: "Conduct Damage Assessment",
      description: "Survey and document damage in affected areas",
      priority: "medium" as const,
      assignedTo: "Assessment Team",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      status: "pending" as const,
      category: "response" as const
    },
    {
      id: "task-4",
      title: "Coordinate Relief Supplies",
      description: "Organize and distribute emergency supplies",
      priority: "medium" as const,
      assignedTo: "Logistics Team",
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      status: "pending" as const,
      category: "response" as const
    },
    {
      id: "task-5",
      title: "Infrastructure Recovery Planning",
      description: "Plan restoration of critical infrastructure",
      priority: "low" as const,
      assignedTo: "Recovery Team",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: "pending" as const,
      category: "recovery" as const
    }
  ]

  const report: EOPReport = {
    id: reportId,
    title: `EOP for ${data.disasterType.charAt(0).toUpperCase() + data.disasterType.slice(1)} - ${data.affectedArea}`,
    generatedAt: new Date().toISOString(),
    disasterInfo: data,
    content: mockContent,
    tasks: mockTasks,
    status: "draft"
  }

  return {
    reportId,
    report
  }
}

const mockConfirmEOP = async (data: ConfirmEOPRequest): Promise<EOPReport> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // In real implementation, this would update the report on the server
  return {
    id: data.reportId,
    title: "Confirmed EOP Report",
    generatedAt: new Date().toISOString(),
    disasterInfo: {} as CreateEOPRequest, // Would be filled from server
    content: data.updatedContent,
    tasks: [], // Would be updated from server
    status: "confirmed"
  }
}

const eopApi = {
  async generateEOP(data: CreateEOPRequest): Promise<GenerateEOPResponse> {
    try {
      // Use mock implementation for development
      return await mockGenerateEOP(data)
      
      // Real API call would be:
      // const response = await request.post<GenerateEOPResponse>(URL_GENERATE_EOP, data)
      // return response.data
    } catch (error) {
      console.error("Error generating EOP:", error)
      throw error
    }
  },

  async confirmEOP(data: ConfirmEOPRequest): Promise<EOPReport> {
    try {
      // Use mock implementation for development
      return await mockConfirmEOP(data)
      
      // Real API call would be:
      // const response = await request.post<EOPReport>(URL_CONFIRM_EOP, data)
      // return response.data
    } catch (error) {
      console.error("Error confirming EOP:", error)
      throw error
    }
  }
}

export default eopApi