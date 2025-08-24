import type { DisasterType, DisasterSeverity } from './disaster.type'

export interface CreateEOPRequest {
  dateFrom: string
  dateTo: string
  disasterType: DisasterType
  affectedArea: string
  severityLevel: DisasterSeverity
  additionalInfo?: string
}

export interface EOPTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignedTo: string
  deadline: string
  status: 'pending' | 'in_progress' | 'completed'
  category: 'preparation' | 'response' | 'recovery' | 'mitigation'
}

export interface EOPReport {
  id: string
  title: string
  generatedAt: string
  disasterInfo: CreateEOPRequest
  content: string
  tasks: EOPTask[]
  status: 'draft' | 'confirmed' | 'active'
}

export interface GenerateEOPResponse {
  reportId: string
  report: EOPReport
}

export interface ConfirmEOPRequest {
  reportId: string
  updatedContent: string
}