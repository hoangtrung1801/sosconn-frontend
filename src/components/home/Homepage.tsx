import { DisasterMap } from '@/components/disaster/disaster-map'
import { mockFloodData } from '@/lib/mock-data/flood-data'

export default function Homepage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Emergency Response Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time disaster monitoring and response system
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Active Disasters Map
          </h2>
          <DisasterMap disasters={mockFloodData} className="shadow-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Active Incidents</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {mockFloodData.filter(d => d.status === 'active').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">People Affected</h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {mockFloodData.reduce((sum, d) => sum + d.affectedPeople, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Total Area</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockFloodData.reduce((sum, d) => sum + d.affectedArea, 0).toFixed(1)}km²
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
