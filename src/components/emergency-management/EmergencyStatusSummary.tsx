'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckSquare, Bell, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface EmergencyStatusSummaryProps {
  statistics: {
    totalEOPs: number
    activeEOPs: number
    totalTasks: number
    completedTasks: number
    taskCompletionRate: number
    overdueTasks: number
    totalAlerts: number
    unreadAlerts: number
    criticalAlerts: number
  }
  isEmergency: boolean
  isLoading: boolean
}

export const EmergencyStatusSummary: React.FC<EmergencyStatusSummaryProps> = ({
  statistics,
  isEmergency,
  isLoading
}) => {
  const statusCards = [
    {
      title: 'EOP Reports',
      value: statistics.activeEOPs,
      subtitle: `${statistics.totalEOPs} total reports`,
      icon: FileText,
      color: 'blue',
      bgColor: isEmergency ? 'bg-red-50 dark:bg-red-950/20' : 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: isEmergency ? 'border-red-200 dark:border-red-800' : 'border-blue-200 dark:border-blue-800',
      iconColor: isEmergency ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Tasks',
      value: statistics.totalTasks - statistics.completedTasks,
      subtitle: `${statistics.taskCompletionRate}% completion rate`,
      icon: CheckSquare,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      progress: statistics.taskCompletionRate
    },
    {
      title: 'Priority Alerts',
      value: statistics.unreadAlerts,
      subtitle: `${statistics.criticalAlerts} critical alerts`,
      icon: Bell,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      badge: statistics.criticalAlerts > 0 ? 'CRITICAL' : undefined
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className={`${card.bgColor} ${card.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-200`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  {card.title}
                </CardTitle>
                {card.badge && (
                  <Badge variant="destructive" className="animate-pulse text-xs">
                    {card.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${card.iconColor}`}>
                      {card.value}
                    </span>
                    {card.title === 'Active Tasks' && statistics.overdueTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">
                          {statistics.overdueTasks} overdue
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.subtitle}
                  </p>
                  
                  {card.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{card.progress}%</span>
                      </div>
                      <Progress 
                        value={card.progress} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {card.title === 'Priority Alerts' && statistics.criticalAlerts > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        Requires immediate attention
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Emergency Quick Stats */}
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="md:col-span-3"
        >
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <TrendingUp className="h-5 w-5" />
                Emergency Response Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {statistics.activeEOPs}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Active Response Plans
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {statistics.totalTasks - statistics.completedTasks}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Pending Operations
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {statistics.overdueTasks}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Overdue Tasks
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.taskCompletionRate}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Response Efficiency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}