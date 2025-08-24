import { DisasterMap } from '@/components/disaster/disaster-map'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockFloodData } from '@/lib/mock-data/flood-data'
import { FileText, Zap } from 'lucide-react'

export default function Homepage() {
  const handleGenerateEOP = () => {
    window.location.href = '/eop/create'
  }

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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                AI Emergency Response
              </CardTitle>
              <CardDescription>
                Generate comprehensive Emergency Operation Plans using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGenerateEOP}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate EOP Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>
                Current emergency situation overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Incidents</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {mockFloodData.filter(d => d.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">People Affected</span>
                <span className="text-sm font-medium">
                  {mockFloodData.reduce((sum, d) => sum + d.affectedPeople, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Area</span>
                <span className="text-sm font-medium">
                  {mockFloodData.reduce((sum, d) => sum + d.affectedArea, 0).toFixed(1)}km²
                </span>
              </div>
            </CardContent>
          </Card>
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
