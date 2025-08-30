'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckSquare, 
  Clock, 
  User, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  Calendar,
  Tag,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { EOPTask } from '@/types/eop.type'

interface TaskManagementProps {
  tasks: EOPTask[]
  onUpdateTask: (taskId: string, status: EOPTask['status']) => void
  statistics: {
    totalTasks: number
    completedTasks: number
    taskCompletionRate: number
    overdueTasks: number
  }
  isLoading: boolean
}

interface TaskFilters {
  status: EOPTask['status'] | 'all'
  priority: EOPTask['priority'] | 'all'
  category: EOPTask['category'] | 'all'
  search: string
}

const getPriorityColor = (priority: EOPTask['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getStatusColor = (status: EOPTask['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getCategoryColor = (category: EOPTask['category']) => {
  switch (category) {
    case 'response':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'preparation':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'recovery':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'mitigation':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const TaskCard: React.FC<{
  task: EOPTask
  onUpdateStatus: (taskId: string, status: EOPTask['status']) => void
  index: number
}> = ({ task, onUpdateStatus, index }) => {
  const deadline = new Date(task.deadline)
  const now = new Date()
  const isOverdue = deadline < now && task.status !== 'completed'
  const timeUntilDeadline = deadline.getTime() - now.getTime()
  const hoursRemaining = Math.floor(timeUntilDeadline / (1000 * 60 * 60))
  const daysRemaining = Math.floor(hoursRemaining / 24)

  const formatDeadline = () => {
    if (isOverdue) {
      const overdueDays = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))
      return `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`
    } else if (daysRemaining > 0) {
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`
    } else {
      return 'Due soon'
    }
  }

  const getNextStatus = (currentStatus: EOPTask['status']): EOPTask['status'] => {
    switch (currentStatus) {
      case 'pending':
        return 'in_progress'
      case 'in_progress':
        return 'completed'
      case 'completed':
        return 'pending'
      default:
        return 'in_progress'
    }
  }

  const getStatusIcon = (status: EOPTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
        return <Play className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className={`hover:shadow-md transition-all duration-200 ${
        isOverdue ? 'border-red-300 bg-red-50/50' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold line-clamp-2 mb-2">
                {task.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1">{task.status.replace('_', ' ').toUpperCase()}</span>
                </Badge>
                <Badge variant="outline" className={getCategoryColor(task.category)}>
                  {task.category.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {task.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Assigned to: {task.assignedTo}</span>
            </div>
            
            <div className={`flex items-center gap-2 ${
              isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
            }`}>
              <Calendar className="h-4 w-4" />
              <span>
                Deadline: {deadline.toLocaleDateString()} - {formatDeadline()}
              </span>
              {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => onUpdateStatus(task.id, getNextStatus(task.status))}
              className={
                task.status === 'completed' 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : task.status === 'in_progress'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {task.status === 'completed' ? 'Reopen' : 
               task.status === 'in_progress' ? 'Complete' : 'Start Task'}
            </Button>
            
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  onUpdateTask,
  statistics,
  isLoading
}) => {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  })

  const [groupBy, setGroupBy] = useState<'status' | 'priority' | 'category'>('status')

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      if (filters.category !== 'all' && task.category !== filters.category) return false
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [tasks, filters])

  const groupedTasks = useMemo(() => {
    const groups: Record<string, EOPTask[]> = {}
    
    filteredTasks.forEach(task => {
      const groupKey = task[groupBy]
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(task)
    })
    
    return groups
  }, [filteredTasks, groupBy])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statistics.completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {statistics.totalTasks - statistics.completedTasks}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statistics.overdueTasks}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex gap-1">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filters.status === status ? "default" : "outline"}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className="h-7 px-2 text-xs"
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <div className="flex gap-1">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <Button
                  key={priority}
                  size="sm"
                  variant={filters.priority === priority ? "default" : "outline"}
                  onClick={() => setFilters(prev => ({ ...prev, priority }))}
                  className="h-7 px-2 text-xs"
                >
                  {priority === 'all' ? 'All' : priority}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Group by:</span>
            <div className="flex gap-1">
              {(['status', 'priority', 'category'] as const).map((group) => (
                <Button
                  key={group}
                  size="sm"
                  variant={groupBy === group ? "default" : "outline"}
                  onClick={() => setGroupBy(group)}
                  className="h-7 px-2 text-xs"
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-8">
        <AnimatePresence>
          {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
            <motion.div 
              key={groupName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {groupName.charAt(0).toUpperCase() + groupName.replace('_', ' ').slice(1)}
                </h3>
                <Badge variant="outline" className="px-2">
                  {groupTasks.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateTask}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or create a new task.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}