import type { FloodData } from '@/types/disaster.type'

export const mockFloodData: FloodData[] = [
  {
    id: 'flood-001',
    type: 'flood',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 10.8231,
      longitude: 106.6297,
      address: 'District 1, Ho Chi Minh City, Vietnam'
    },
    title: 'Severe Flooding in District 1',
    description: 'Heavy rainfall caused severe flooding affecting main streets and residential areas.',
    affectedPeople: 1500,
    reportedAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
    reportedBy: 'City Emergency Center',
    waterLevel: 1.8,
    affectedArea: 2.5
  },
  {
    id: 'flood-002',
    type: 'flood',
    severity: 'medium',
    status: 'monitoring',
    location: {
      latitude: 10.7769,
      longitude: 106.7009,
      address: 'District 2, Ho Chi Minh City, Vietnam'
    },
    title: 'Flash Flood in Thu Duc',
    description: 'Rising water levels in residential areas due to blocked drainage systems.',
    affectedPeople: 800,
    reportedAt: '2025-01-15T06:45:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    reportedBy: 'Local Authorities',
    waterLevel: 0.9,
    affectedArea: 1.2
  },
  {
    id: 'flood-003',
    type: 'flood',
    severity: 'critical',
    status: 'active',
    location: {
      latitude: 10.7543,
      longitude: 106.4319,
      address: 'Cu Chi District, Ho Chi Minh City, Vietnam'
    },
    title: 'Critical Flood Emergency',
    description: 'Dam overflow threatening multiple villages. Immediate evacuation required.',
    affectedPeople: 3200,
    reportedAt: '2025-01-15T05:00:00Z',
    updatedAt: '2025-01-15T10:45:00Z',
    reportedBy: 'Emergency Response Team',
    waterLevel: 3.2,
    affectedArea: 8.7
  },
  {
    id: 'flood-004',
    type: 'flood',
    severity: 'low',
    status: 'resolved',
    location: {
      latitude: 10.8142,
      longitude: 106.6438,
      address: 'District 3, Ho Chi Minh City, Vietnam'
    },
    title: 'Minor Street Flooding',
    description: 'Temporary flooding on main road, water has receded.',
    affectedPeople: 200,
    reportedAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-15T07:00:00Z',
    reportedBy: 'Traffic Police',
    waterLevel: 0.3,
    affectedArea: 0.4
  },
  {
    id: 'flood-005',
    type: 'flood',
    severity: 'medium',
    status: 'active',
    location: {
      latitude: 10.7215,
      longitude: 106.6573,
      address: 'District 7, Ho Chi Minh City, Vietnam'
    },
    title: 'Residential Area Flooding',
    description: 'Moderate flooding in residential complex affecting ground floor units.',
    affectedPeople: 650,
    reportedAt: '2025-01-15T07:15:00Z',
    updatedAt: '2025-01-15T09:45:00Z',
    reportedBy: 'Community Leader',
    waterLevel: 1.1,
    affectedArea: 1.8
  }
]