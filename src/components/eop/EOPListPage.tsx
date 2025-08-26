import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Plus, Search, MapPin, AlertTriangle, Clock } from "lucide-react"
import eopApi from "@/lib/api/eop.api"
import { getMockEOPReports } from "@/lib/mock-data/eop-data"
import type { EOPReport } from "@/types"

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
}

const severityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  critical: "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-200"
}

export default function EOPListPage() {
  const [reports, setReports] = useState<EOPReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await eopApi.getEOPReports()
      setReports(response.reports || [])
    } catch (error) {
      console.error("Failed to fetch EOP reports:", error)
      // Use comprehensive mock data
      const mockReports = getMockEOPReports()
      setReports(mockReports)
    } finally {
      setLoading(false)
    }
  }



  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.disasterInfo.affectedArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.disasterInfo.disasterType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleRowClick = (reportId: string) => {
    // Store the report in sessionStorage and navigate to report detail page
    const report = reports.find(r => r.id === reportId)
    if (report) {
      sessionStorage.setItem('finalEOPReport', JSON.stringify(report))
      window.location.href = `/eop/report?reportId=${reportId}`
    }
  }

  const handleCreateNew = () => {
    window.location.href = '/eop/create'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2" />
          <span>Loading EOP reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Emergency Operation Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and view all generated emergency operation plans
            </p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New EOP
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by title, area, or disaster type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "confirmed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("confirmed")}
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            EOP Reports ({filteredReports.length})
          </CardTitle>
          <CardDescription>
            Click on any row to view the full report details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No reports found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No reports match your current filters"
                  : "Get started by creating your first emergency operation plan"
                }
              </p>
              {searchTerm || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First EOP
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Details</TableHead>
                  <TableHead>Disaster Info</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow 
                    key={report.id}
                    onClick={() => handleRowClick(report.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {report.id}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="capitalize text-sm">
                            {report.disasterInfo.disasterType}
                          </span>
                          <Badge className={`${severityColors[report.disasterInfo.severityLevel]} capitalize text-xs`}>
                            {report.disasterInfo.severityLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {report.disasterInfo.affectedArea}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div className="text-sm">
                          <div>{new Date(report.generatedAt).toLocaleDateString()}</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {new Date(report.generatedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={`${statusColors[report.status]} capitalize`}>
                        {report.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}