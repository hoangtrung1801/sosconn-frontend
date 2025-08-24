export type DisasterType = 'flood' | 'earthquake' | 'fire' | 'storm' | 'landslide'

export type DisasterSeverity = 'low' | 'medium' | 'high' | 'critical'

export type DisasterStatus = 'active' | 'resolved' | 'monitoring'

export interface Location {
  latitude: number
  longitude: number
  address: string
}

export interface DisasterData {
  id: string
  type: DisasterType
  severity: DisasterSeverity
  status: DisasterStatus
  location: Location
  title: string
  description: string
  affectedPeople: number
  reportedAt: string
  updatedAt: string
  reportedBy: string
}

export interface FloodData extends DisasterData {
  type: 'flood'
  waterLevel: number // in meters
  affectedArea: number // in square kilometers
}