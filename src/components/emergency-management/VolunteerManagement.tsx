import React, { useState, useMemo } from 'react'
import { 
  Users, 
  UserCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  AlertCircle,
  Search,
  MoreHorizontal,
  Shield,
  Package,
  Globe,
  Heart,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import type { 
  Volunteer, 
  VolunteerAssignment, 
  VolunteerRequest, 
  VolunteerTraining,
  VolunteerStatistics 
} from '@/types/emergency-management.type'

interface VolunteerManagementProps {
  volunteers: Volunteer[]
  assignments: VolunteerAssignment[]
  requests: VolunteerRequest[]
  trainings: VolunteerTraining[]
  statistics: VolunteerStatistics
  isLoading?: boolean
  onAssignVolunteer?: (volunteerId: string, assignment: Partial<VolunteerAssignment>) => void
  onUpdateVolunteer?: (volunteerId: string, updates: Partial<Volunteer>) => void
  onApproveRequest?: (requestId: string, volunteerIds: string[]) => void
  onScheduleTraining?: (training: Partial<VolunteerTraining>) => void
}

const getAvailabilityColor = (status: Volunteer['availability']['status']) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800 border-green-200'
    case 'deployed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'unavailable': return 'bg-red-100 text-red-800 border-red-200'
    case 'off_duty': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getExperienceColor = (experience: Volunteer['experience']) => {
  switch (experience) {
    case 'expert': return 'text-purple-600'
    case 'experienced': return 'text-blue-600'
    case 'intermediate': return 'text-green-600'
    case 'novice': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

const getSpecialtyIcon = (specialty: string) => {
  switch (specialty) {
    case 'medical': return <Heart className="h-3 w-3" />
    case 'search_rescue': return <Shield className="h-3 w-3" />
    case 'logistics': return <Package className="h-3 w-3" />
    case 'communication': return <Radio className="h-3 w-3" />
    case 'translation': return <Globe className="h-3 w-3" />
    case 'evacuation': return <Users className="h-3 w-3" />
    case 'security': return <Shield className="h-3 w-3" />
    default: return <Users className="h-3 w-3" />
  }
}

export const VolunteerManagement: React.FC<VolunteerManagementProps> = ({
  volunteers,
  assignments,
  requests,
  trainings,
  statistics,
  isLoading = false,
  onAssignVolunteer,
  onUpdateVolunteer
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(volunteer => {
      const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           volunteer.specialties.some(specialty => specialty.includes(searchTerm.toLowerCase()))
      const matchesAvailability = availabilityFilter === 'all' || volunteer.availability.status === availabilityFilter
      const matchesSpecialty = specialtyFilter === 'all' || volunteer.specialties.includes(specialtyFilter as any)
      return matchesSearch && matchesAvailability && matchesSpecialty
    })
  }, [volunteers, searchTerm, availabilityFilter, specialtyFilter])

  const activeAssignments = assignments.filter(a => a.status === 'active')
  const openRequests = requests.filter(r => r.status === 'open')
  const upcomingTrainings = trainings.filter(t => t.status === 'scheduled')

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
              <Users className="h-4 w-4 text-blue-600" />
              Total Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalVolunteers}</div>
            <div className="text-xs text-gray-500 mt-1">
              {statistics.availableVolunteers} available
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              Active Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.deployedVolunteers}</div>
            <div className="text-xs text-gray-500 mt-1">
              Currently on assignment
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(statistics.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalActiveHours.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              Hours contributed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(openRequests.length > 0 || upcomingTrainings.length > 0) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openRequests.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700 mb-2">
                  Open Requests ({openRequests.length} requests need volunteers)
                </p>
                <div className="flex flex-wrap gap-2">
                  {openRequests.slice(0, 3).map(request => (
                    <Badge key={request.id} variant="outline" className="border-blue-300 text-blue-700">
                      {request.numberOfVolunteers} volunteers needed for {request.description}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {upcomingTrainings.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-700 mb-2">
                  Upcoming Trainings ({upcomingTrainings.length} sessions scheduled)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volunteers by Specialty */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volunteers by Specialty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(statistics.volunteersBySpecialty).map(([specialty, count]) => (
                  <div key={specialty} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSpecialtyIcon(specialty)}
                      <span className="capitalize">{specialty.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(count / statistics.totalVolunteers) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Assignments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeAssignments.slice(0, 6).map(assignment => {
                  const volunteer = volunteers.find(v => v.id === assignment.volunteerId)
                  return (
                    <div key={assignment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {volunteer?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{volunteer?.name}</p>
                          <p className="text-xs text-gray-500">{assignment.role} • {assignment.location}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {assignment.status}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="deployed">Deployed</option>
                <option value="unavailable">Unavailable</option>
                <option value="off_duty">Off Duty</option>
              </select>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Specialties</option>
                <option value="medical">Medical</option>
                <option value="search_rescue">Search & Rescue</option>
                <option value="logistics">Logistics</option>
                <option value="communication">Communication</option>
                <option value="translation">Translation</option>
                <option value="evacuation">Evacuation</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>

          {/* Volunteers Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map(volunteer => (
                  <TableRow key={volunteer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{volunteer.name}</div>
                          <div className="text-sm text-gray-500">
                            {volunteer.totalHours}h • Joined {new Date(volunteer.joinedDate).getFullYear()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {volunteer.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {volunteer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.specialties.slice(0, 2).map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty.replace('_', ' ')}
                          </Badge>
                        ))}
                        {volunteer.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getExperienceColor(volunteer.experience)}`}>
                        {volunteer.experience}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAvailabilityColor(volunteer.availability.status)}>
                        {volunteer.availability.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm">{volunteer.performanceRating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onAssignVolunteer?.(volunteer.id, {})}>
                            Assign to Task
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateVolunteer?.(volunteer.id, {})}>
                            Update Profile
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

        {/* Other tabs can be implemented similarly */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map(assignment => {
                    const volunteer = volunteers.find(v => v.id === assignment.volunteerId)
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {volunteer?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {volunteer?.name}
                          </div>
                        </TableCell>
                        <TableCell>{assignment.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {assignment.location}
                          </div>
                        </TableCell>
                        <TableCell>{assignment.expectedDuration}h</TableCell>
                        <TableCell>
                          <Badge 
                            className={assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                          >
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignment.lastCheckIn ? 
                            new Date(assignment.lastCheckIn).toLocaleTimeString() : 
                            'No check-in'
                          }
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs implementation would continue here */}
      </Tabs>
    </div>
  )
}