export interface RainStation {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rainAccumulation: number; // mm
  intensity: "light" | "moderate" | "heavy" | "extreme";
}

export const mockRainData: RainStation[] = [
  {
    id: 'rain-001',
    location: {
      latitude: 16.0544,
      longitude: 108.2022,
      address: 'Da Nang City Center'
    },
    rainAccumulation: 85.5,
    intensity: 'heavy'
  },
  {
    id: 'rain-002',
    location: {
      latitude: 16.0678,
      longitude: 108.2208,
      address: 'Son Tra Peninsula'
    },
    rainAccumulation: 125.2,
    intensity: 'extreme'
  },
  {
    id: 'rain-003',
    location: {
      latitude: 16.0238,
      longitude: 108.1580,
      address: 'Han River Bridge Area'
    },
    rainAccumulation: 95.8,
    intensity: 'heavy'
  },
  {
    id: 'rain-004',
    location: {
      latitude: 16.0471,
      longitude: 108.2068,
      address: 'Thanh Khe District'
    },
    rainAccumulation: 45.3,
    intensity: 'moderate'
  },
  {
    id: 'rain-005',
    location: {
      latitude: 16.0755,
      longitude: 108.1568,
      address: 'Lien Chieu District'
    },
    rainAccumulation: 78.9,
    intensity: 'heavy'
  },
  {
    id: 'rain-006',
    location: {
      latitude: 16.0311,
      longitude: 108.2433,
      address: 'Marble Mountains'
    },
    rainAccumulation: 65.4,
    intensity: 'moderate'
  },
  {
    id: 'rain-007',
    location: {
      latitude: 16.0425,
      longitude: 108.1889,
      address: 'Da Nang Airport'
    },
    rainAccumulation: 32.1,
    intensity: 'light'
  },
  {
    id: 'rain-008',
    location: {
      latitude: 16.0612,
      longitude: 108.2105,
      address: 'My Khe Beach'
    },
    rainAccumulation: 55.7,
    intensity: 'moderate'
  }
];