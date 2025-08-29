import type { FloodData } from '@/types/disaster.type'

export const mockFloodData: FloodData[] = [
  {
    id: 'flood-001',
    type: 'flood',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 16.0544,
      longitude: 108.2022,
      address: 'Hai Chau District, Da Nang, Vietnam'
    },
    title: 'Severe Flooding in Hai Chau District',
    description: 'Heavy rainfall caused severe flooding affecting main streets and residential areas in downtown Da Nang.',
    affectedPeople: 1200,
    reportedAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
    reportedBy: 'Da Nang Emergency Center',
    waterLevel: 1.8,
    affectedArea: 2.5
  },
  {
    id: 'flood-002',
    type: 'flood',
    severity: 'medium',
    status: 'monitoring',
    location: {
      latitude: 16.0678,
      longitude: 108.2208,
      address: 'Son Tra District, Da Nang, Vietnam'
    },
    title: 'Flash Flood in Son Tra Peninsula',
    description: 'Rising water levels in coastal residential areas due to blocked drainage systems and high tide.',
    affectedPeople: 600,
    reportedAt: '2025-01-15T06:45:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    reportedBy: 'Son Tra District Authorities',
    waterLevel: 0.9,
    affectedArea: 1.2
  },
  {
    id: 'flood-003',
    type: 'flood',
    severity: 'critical',
    status: 'active',
    location: {
      latitude: 16.0238,
      longitude: 108.1580,
      address: 'Cam Le District, Da Nang, Vietnam'
    },
    title: 'Critical Flood Emergency near Han River',
    description: 'Han River overflow threatening multiple residential areas. Immediate evacuation of riverside communities required.',
    affectedPeople: 2800,
    reportedAt: '2025-01-15T05:00:00Z',
    updatedAt: '2025-01-15T10:45:00Z',
    reportedBy: 'Da Nang Emergency Response Team',
    waterLevel: 3.2,
    affectedArea: 7.8
  },
  {
    id: 'flood-004',
    type: 'flood',
    severity: 'low',
    status: 'resolved',
    location: {
      latitude: 16.0471,
      longitude: 108.2068,
      address: 'Thanh Khe District, Da Nang, Vietnam'
    },
    title: 'Minor Street Flooding Resolved',
    description: 'Temporary flooding on Dien Bien Phu Street has been cleared, traffic flow restored.',
    affectedPeople: 150,
    reportedAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-15T07:00:00Z',
    reportedBy: 'Da Nang Traffic Police',
    waterLevel: 0.3,
    affectedArea: 0.4
  },
  {
    id: 'flood-005',
    type: 'flood',
    severity: 'medium',
    status: 'active',
    location: {
      latitude: 16.0755,
      longitude: 108.1568,
      address: 'Lien Chieu District, Da Nang, Vietnam'
    },
    title: 'Residential Area Flooding in Lien Chieu',
    description: 'Moderate flooding in industrial residential complex affecting ground floor units and small businesses.',
    affectedPeople: 450,
    reportedAt: '2025-01-15T07:15:00Z',
    updatedAt: '2025-01-15T09:45:00Z',
    reportedBy: 'Lien Chieu Community Leader',
    waterLevel: 1.1,
    affectedArea: 1.8
  },
  {
    id: 'flood-006',
    type: 'flood',
    severity: 'high',
    status: 'monitoring',
    location: {
      latitude: 16.0311,
      longitude: 108.2433,
      address: 'Ngu Hanh Son District, Da Nang, Vietnam'
    },
    title: 'Marble Mountains Area Flooding',
    description: 'Tourist area near Marble Mountains experiencing significant water accumulation, affecting local businesses.',
    affectedPeople: 350,
    reportedAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    reportedBy: 'Tourism Department',
    waterLevel: 1.5,
    affectedArea: 2.1
  }
]