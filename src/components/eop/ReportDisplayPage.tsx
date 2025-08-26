import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Download, Clock, CheckCircle, User, Calendar, MapPin, AlertTriangle, Search, Filter, MoreVertical, ChevronUp, ChevronDown } from "lucide-react"
import { getMockEOPReportById } from "@/lib/mock-data/eop-data"
import type { EOPReport, EOPTask } from "@/types"

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", 
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

const categoryColors = {
  preparation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  response: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  recovery: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  mitigation: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
}

export default function ReportDisplayPage() {
  const [report, setReport] = useState<EOPReport | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("priority")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    // Get the final report from sessionStorage
    const storedReport = sessionStorage.getItem('finalEOPReport')
    if (storedReport) {
      const parsedReport = JSON.parse(storedReport) as EOPReport
      setReport(parsedReport)
    } else {
      // Fallback: try to get from URL params and load from mock data
      const urlParams = new URLSearchParams(window.location.search)
      const reportId = urlParams.get('reportId')
      if (reportId) {
        const mockReport = getMockEOPReportById(reportId)
        if (mockReport) {
          setReport(mockReport)
          sessionStorage.setItem('finalEOPReport', JSON.stringify(mockReport))
        }
      }
    }
  }, [])

  const updateTaskStatus = (taskId: string, newStatus: EOPTask['status']) => {
    if (!report) return
    
    const updatedTasks = report.tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    )
    
    const updatedReport = { ...report, tasks: updatedTasks }
    setReport(updatedReport)
    
    // Update sessionStorage
    sessionStorage.setItem('finalEOPReport', JSON.stringify(updatedReport))
  }

  const filteredAndSortedTasks = report?.tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        }
        case "deadline":
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        default:
          comparison = 0
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    }) || []

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const handleDownloadReport = () => {
    if (!report) return

    const content = `# ${report.title}

Generated at: ${new Date(report.generatedAt).toLocaleString()}
Status: ${report.status}

## Disaster Information
- Type: ${report.disasterInfo.disasterType}
- Affected Area: ${report.disasterInfo.affectedArea}
- Severity: ${report.disasterInfo.severityLevel}
- Period: ${report.disasterInfo.dateFrom} to ${report.disasterInfo.dateTo}

---

${report.content}

## Tasks Summary

| Task | Priority | Category | Assigned To | Deadline | Status |
|------|----------|----------|-------------|-----------|--------|
${report.tasks.map(task => 
  `| ${task.title} | ${task.priority} | ${task.category} | ${task.assignedTo} | ${new Date(task.deadline).toLocaleDateString()} | ${task.status} |`
).join('\n')}

---
Report generated by Emergency Response System
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `EOP-Report-${report.id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No Report Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please generate and confirm an EOP report first.
          </p>
          <Button onClick={() => window.location.href = '/eop/create'}>
            Generate New Report
          </Button>
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
              Emergency Operation Plan Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Final confirmed EOP ready for implementation
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleDownloadReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Badge variant="default" className="flex items-center gap-1 px-3 py-1">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Report ID</div>
                <div className="text-sm font-mono">{report.id}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Generated</div>
                  <div className="text-sm">{new Date(report.generatedAt).toLocaleString()}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Disaster Details</h4>
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {report.disasterInfo.disasterType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Area</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {report.disasterInfo.affectedArea}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">Period</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(report.disasterInfo.dateFrom).toLocaleDateString()} - {new Date(report.disasterInfo.dateTo).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Severity</div>
                  <Badge variant="secondary" className="capitalize">
                    {report.disasterInfo.severityLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Task Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Tasks</span>
                  <span className="font-medium">{report.tasks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>High Priority</span>
                  <span className="font-medium text-red-600">
                    {report.tasks.filter(t => t.priority === 'high').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Tasks</span>
                  <span className="font-medium">
                    {report.tasks.filter(t => t.category === 'response').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Report Content */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Operation Plan</CardTitle>
              <CardDescription>
                Generated report content based on disaster information and AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Implementation Tasks</CardTitle>
                  <CardDescription>
                    Interactive tasks for EOP implementation with status tracking
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {filteredAndSortedTasks.length} of {report.tasks.length} tasks
                </Badge>
              </div>
              
              {/* Filters and Search */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All Status
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "in_progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("in_progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Label className="text-sm font-medium">Priority:</Label>
                <Button
                  variant={priorityFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={priorityFilter === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("high")}
                >
                  High
                </Button>
                <Button
                  variant={priorityFilter === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={priorityFilter === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter("low")}
                >
                  Low
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Label className="text-sm font-medium">Category:</Label>
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={categoryFilter === "preparation" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("preparation")}
                >
                  Preparation
                </Button>
                <Button
                  variant={categoryFilter === "response" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("response")}
                >
                  Response
                </Button>
                <Button
                  variant={categoryFilter === "recovery" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("recovery")}
                >
                  Recovery
                </Button>
                <Button
                  variant={categoryFilter === "mitigation" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter("mitigation")}
                >
                  Mitigation
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("title")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Task
                        {sortBy === "title" && (
                          sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("priority")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Priority
                        {sortBy === "priority" && (
                          sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("deadline")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Deadline
                        {sortBy === "deadline" && (
                          sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("status")}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        Status
                        {sortBy === "status" && (
                          sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${priorityColors[task.priority]} capitalize`}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${categoryColors[task.category]} capitalize`}>
                          {task.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(task.deadline).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.deadline).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[task.status]} capitalize`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => updateTaskStatus(task.id, "pending")}
                              disabled={task.status === "pending"}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateTaskStatus(task.id, "in_progress")}
                              disabled={task.status === "in_progress"}
                            >
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateTaskStatus(task.id, "completed")}
                              disabled={task.status === "completed"}
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAndSortedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks match your current filters</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                      setCategoryFilter("all")
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}