import React, { useState, useMemo } from 'react'
import { 
  Package, 
  Truck, 
  Heart, 
  Wrench, 
  MapPin, 
  AlertCircle, 
  Clock,
  Search,
  MoreHorizontal,
  TrendingUp,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Resource, ResourceAllocation, ResourceRequest, ResourceStatistics } from '@/types/emergency-management.type'

interface ResourceManagementProps {
  resources: Resource[]
  allocations: ResourceAllocation[]
  requests: ResourceRequest[]
  statistics: ResourceStatistics
  isLoading?: boolean
  onAllocateResource?: (resourceId: string, allocation: Partial<ResourceAllocation>) => void
  onUpdateResource?: (resourceId: string, updates: Partial<Resource>) => void
  onApproveRequest?: (requestId: string) => void
  onRejectRequest?: (requestId: string, reason: string) => void
}

const getCategoryIcon = (category: Resource['category']) => {
  switch (category) {
    case 'medical': return <Heart className="h-4 w-4" />
    case 'equipment': return <Wrench className="h-4 w-4" />
    case 'vehicles': return <Truck className="h-4 w-4" />
    case 'supplies': return <Package className="h-4 w-4" />
    case 'facilities': return <MapPin className="h-4 w-4" />
    case 'personnel': return <Users className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: Resource['status']) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800 border-green-200'
    case 'deployed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'reserved': return 'bg-purple-100 text-purple-800 border-purple-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: Resource['priority']) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200'
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}



export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  allocations,
  requests,
  statistics,
  isLoading = false,
  onAllocateResource,
  onUpdateResource,
  onApproveRequest,
  onRejectRequest
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [resources, searchTerm, statusFilter, categoryFilter])

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const lowStockResources = resources.filter(res => 
    res.availableQuantity <= (res.quantity * 0.2) && res.status === 'available'
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Total Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalResources}</div>
            <div className="text-xs text-gray-500 mt-1">
              {statistics.availableResources} available
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Deployment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.allocationRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {statistics.deployedResources} deployed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Critical Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.criticalResourcesLow.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Need immediate attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.pendingRequests}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Awaiting approval
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(lowStockResources.length > 0 || pendingRequests.length > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Critical Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockResources.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">
                  Low Stock Alert ({lowStockResources.length} resources)
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockResources.slice(0, 5).map(resource => (
                    <Badge key={resource.id} variant="outline" className="border-red-300 text-red-700">
                      {resource.name}: {resource.availableQuantity}/{resource.quantity}
                    </Badge>
                  ))}
                  {lowStockResources.length > 5 && (
                    <Badge variant="outline" className="border-red-300 text-red-700">
                      +{lowStockResources.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            {pendingRequests.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">
                  Urgent Requests ({pendingRequests.filter(r => r.urgency === 'immediate').length} immediate)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resources by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resources by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(statistics.resourcesByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category as Resource['category'])}
                      <span className="capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(count / statistics.totalResources) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allocations.slice(0, 6).map(allocation => {
                  const resource = resources.find(r => r.id === allocation.resourceId)
                  return (
                    <div key={allocation.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{resource?.name}</p>
                          <p className="text-xs text-gray-500">
                            Allocated to {allocation.allocatedTo}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={allocation.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {allocation.status}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="deployed">Deployed</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="medical">Medical</option>
                <option value="equipment">Equipment</option>
                <option value="vehicles">Vehicles</option>
                <option value="supplies">Supplies</option>
                <option value="facilities">Facilities</option>
                <option value="personnel">Personnel</option>
              </select>
            </div>
          </div>

          {/* Resources Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map(resource => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(resource.category)}
                        <span className="capitalize">{resource.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {resource.availableQuantity}/{resource.quantity} {resource.unit}
                        </div>
                        <Progress 
                          value={(resource.availableQuantity / resource.quantity) * 100}
                          className="w-16 h-1 mt-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {resource.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(resource.priority)}>
                        {resource.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onAllocateResource?.(resource.id, {})}>
                            Allocate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateResource?.(resource.id, {})}>
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Allocations Tab */}
        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Allocated To</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Allocated By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map(allocation => {
                    const resource = resources.find(r => r.id === allocation.resourceId)
                    return (
                      <TableRow key={allocation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{resource?.name}</div>
                            <div className="text-sm text-gray-500">{resource?.type}</div>
                          </div>
                        </TableCell>
                        <TableCell>{allocation.allocatedTo}</TableCell>
                        <TableCell>{allocation.quantity} {resource?.unit}</TableCell>
                        <TableCell>{allocation.allocatedBy}</TableCell>
                        <TableCell>
                          {new Date(allocation.allocatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={allocation.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                                     allocation.status === 'returned' ? 'bg-green-100 text-green-800' :
                                     'bg-red-100 text-red-800'}
                          >
                            {allocation.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map(request => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.description}</div>
                          <div className="text-sm text-gray-500">
                            {request.quantity} {request.unit} • {request.category}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>
                        <Badge 
                          className={request.urgency === 'immediate' ? 'bg-red-100 text-red-800' :
                                   request.urgency === 'urgent' ? 'bg-orange-100 text-orange-800' :
                                   'bg-blue-100 text-blue-800'}
                        >
                          {request.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                   request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                   request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                   'bg-blue-100 text-blue-800'}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300"
                              onClick={() => onApproveRequest?.(request.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300"
                              onClick={() => onRejectRequest?.(request.id, '')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}