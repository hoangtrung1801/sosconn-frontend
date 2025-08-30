'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Eye, 
  EyeOff,
  Search,
  Users,
  Activity,
  CheckCircle,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { Alert } from '@/hooks/use-emergency-management'

interface AlertManagementProps {
  alerts: Alert[]
  onMarkAsRead: (alertId: string) => void
  statistics: {
    totalAlerts: number
    unreadAlerts: number
    criticalAlerts: number
  }
  isLoading: boolean
}

interface AlertFilters {
  type: Alert['type'] | 'all'
  priority: Alert['priority'] | 'all'
  status: 'read' | 'unread' | 'all'
  search: string
}

const getAlertTypeIcon = (type: Alert['type']) => {
  switch (type) {
    case 'disaster':
      return <AlertTriangle className="h-4 w-4" />
    case 'community':
      return <Users className="h-4 w-4" />
    case 'system':
      return <Activity className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getAlertTypeColor = (type: Alert['type']) => {
  switch (type) {
    case 'disaster':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'community':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'system':
      return 'bg-purple-100 text-purple-800 border-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getPriorityColor = (priority: Alert['priority']) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const AlertCard: React.FC<{
  alert: Alert
  onMarkAsRead: (alertId: string) => void
  index: number
}> = ({ alert, onMarkAsRead, index }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className={`hover:shadow-md transition-all duration-200 ${
        !alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10' : ''
      } ${
        alert.priority === 'critical' ? 'border-red-300 bg-red-50/50' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getAlertTypeColor(alert.type)}>
                  {getAlertTypeIcon(alert.type)}
                  <span className="ml-1">{alert.type.toUpperCase()}</span>
                </Badge>
                <Badge className={getPriorityColor(alert.priority)}>
                  {alert.priority.toUpperCase()}
                </Badge>
                {alert.priority === 'critical' && (
                  <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                )}
              </div>
              
              <CardTitle className={`text-base font-semibold line-clamp-2 ${
                !alert.isRead ? 'font-bold' : ''
              }`}>
                {alert.title}
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-1">
              {!alert.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkAsRead(alert.id)}
                className="h-6 w-6 p-0"
              >
                {alert.isRead ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className={`text-sm line-clamp-3 ${
            !alert.isRead 
              ? 'text-gray-900 dark:text-gray-100 font-medium' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {alert.description}
          </p>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {alert.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{alert.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTimestamp(alert.timestamp)}</span>
            </div>
          </div>
          
          {alert.actions && alert.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {alert.actions.slice(0, 3).map((action, idx) => (
                <Button 
                  key={idx}
                  size="sm" 
                  variant="outline"
                  className="h-7 px-2 text-xs"
                >
                  {action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
              {alert.actions.length > 3 && (
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  +{alert.actions.length - 3} more
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const AlertManagement: React.FC<AlertManagementProps> = ({
  alerts,
  onMarkAsRead,
  statistics,
  isLoading
}) => {
  const [filters, setFilters] = useState<AlertFilters>({
    type: 'all',
    priority: 'all',
    status: 'all',
    search: ''
  })

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filters.type !== 'all' && alert.type !== filters.type) return false
      if (filters.priority !== 'all' && alert.priority !== filters.priority) return false
      if (filters.status === 'read' && !alert.isRead) return false
      if (filters.status === 'unread' && alert.isRead) return false
      if (filters.search && !alert.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !alert.description.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [alerts, filters])

  const markAllAsRead = () => {
    alerts.filter(alert => !alert.isRead).forEach(alert => {
      onMarkAsRead(alert.id)
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex gap-2 mb-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-5 bg-gray-200 rounded mb-2" />
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
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalAlerts}</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{statistics.unreadAlerts}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statistics.criticalAlerts}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search alerts..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
            <div className="flex gap-1">
              {(['all', 'disaster', 'community', 'system'] as const).map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={filters.type === type ? "default" : "outline"}
                  onClick={() => setFilters(prev => ({ ...prev, type }))}
                  className="h-7 px-2 text-xs"
                >
                  {type === 'all' ? 'All' : type}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <div className="flex gap-1">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((priority) => (
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex gap-1">
              {(['all', 'unread', 'read'] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filters.status === status ? "default" : "outline"}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className="h-7 px-2 text-xs"
                >
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {statistics.unreadAlerts > 0 && (
            <Button 
              size="sm"
              onClick={markAllAsRead}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={onMarkAsRead}
              index={index}
            />
          ))}
        </AnimatePresence>
        
        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later for new alerts.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}