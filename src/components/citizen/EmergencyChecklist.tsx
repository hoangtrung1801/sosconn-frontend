import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertTriangle, Package, FileText } from 'lucide-react';

type DisasterPhase = 'before' | 'during' | 'after';

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  phase: DisasterPhase[];
  completed: boolean;
  description?: string;
}

interface EmergencyChecklistProps {
  currentPhase: DisasterPhase;
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const EmergencyChecklist: React.FC<EmergencyChecklistProps> = ({
  currentPhase,
  emergencyLevel,
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Before Disaster - Preparedness
    {
      id: 'prep-1',
      category: 'Documents',
      task: 'Secure important documents (ID, insurance, medical records)',
      priority: 'high',
      phase: ['before'],
      completed: false,
      description: 'Keep documents in waterproof container or digital backup'
    },
    {
      id: 'prep-2',
      category: 'Communication',
      task: 'Charge all electronic devices and power banks',
      priority: 'high',
      phase: ['before'],
      completed: false,
      description: 'Ensure phones, radios, and flashlights are fully charged'
    },
    {
      id: 'prep-3',
      category: 'Supplies',
      task: 'Pack emergency kit (water, food, first aid)',
      priority: 'high',
      phase: ['before'],
      completed: false,
      description: '3-day supply of water (1 gallon per person per day) and non-perishable food'
    },
    {
      id: 'prep-4',
      category: 'Safety',
      task: 'Identify and plan evacuation routes',
      priority: 'high',
      phase: ['before'],
      completed: false,
      description: 'Know at least 2 routes to nearest shelters and safe zones'
    },
    {
      id: 'prep-5',
      category: 'Family',
      task: 'Establish family communication plan',
      priority: 'medium',
      phase: ['before'],
      completed: false,
      description: 'Designate out-of-area contact person and meeting points'
    },

    // During Disaster - Response
    {
      id: 'resp-1',
      category: 'Safety',
      task: 'Move to higher ground immediately',
      priority: 'high',
      phase: ['during'],
      completed: false,
      description: 'Evacuate flood-prone areas immediately'
    },
    {
      id: 'resp-2',
      category: 'Communication',
      task: 'Send location update to emergency contacts',
      priority: 'high',
      phase: ['during'],
      completed: false,
      description: 'Let family know your current safe location'
    },
    {
      id: 'resp-3',
      category: 'Safety',
      task: 'Stay updated with official emergency broadcasts',
      priority: 'high',
      phase: ['during'],
      completed: false,
      description: 'Monitor radio, TV, or mobile alerts for instructions'
    },
    {
      id: 'resp-4',
      category: 'Community',
      task: 'Report your status as safe if possible',
      priority: 'medium',
      phase: ['during'],
      completed: false,
      description: 'Use safety check-in features or contact authorities'
    },

    // After Disaster - Recovery
    {
      id: 'rec-1',
      category: 'Safety',
      task: 'Check for injuries and hazards',
      priority: 'high',
      phase: ['after'],
      completed: false,
      description: 'Assess immediate safety of yourself and others'
    },
    {
      id: 'rec-2',
      category: 'Documentation',
      task: 'Document damage with photos',
      priority: 'medium',
      phase: ['after'],
      completed: false,
      description: 'Take photos of property damage for insurance claims'
    },
    {
      id: 'rec-3',
      category: 'Communication',
      task: 'Contact family and check on neighbors',
      priority: 'high',
      phase: ['after'],
      completed: false,
      description: 'Confirm safety of family members and offer help to neighbors'
    },
    {
      id: 'rec-4',
      category: 'Resources',
      task: 'Locate aid distribution points',
      priority: 'medium',
      phase: ['after'],
      completed: false,
      description: 'Find locations for food, water, and medical assistance'
    },
  ]);

  const toggleItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const currentPhaseItems = checklistItems.filter(item => 
    item.phase.includes(currentPhase)
  );

  const completedCount = currentPhaseItems.filter(item => item.completed).length;
  const totalCount = currentPhaseItems.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Documents': return <FileText className="h-4 w-4" />;
      case 'Supplies': return <Package className="h-4 w-4" />;
      case 'Safety': return <AlertTriangle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Emergency Checklist - {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
          </CardTitle>
          <CardDescription>
            Personalized emergency checklist based on current situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completion Progress</p>
                <p className="text-xs text-gray-600">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {Math.round(completionPercentage)}%
                </p>
              </div>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {['high', 'medium', 'low'].map(priority => {
          const priorityItems = currentPhaseItems.filter(item => item.priority === priority);
          if (priorityItems.length === 0) return null;

          return (
            <Card key={priority} className={`${
              priority === 'high' ? 'border-red-200' :
              priority === 'medium' ? 'border-orange-200' : 'border-yellow-200'
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg flex items-center gap-2 ${getPriorityColor(priority)}`}>
                  <AlertTriangle className="h-4 w-4" />
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priorityItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(item.category)}
                          <span className="text-xs font-medium text-gray-600">
                            {item.category}
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${
                          item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {item.task}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentPhase === 'before' && emergencyLevel === 'critical' && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-800">Critical Alert</h3>
            </div>
            <p className="text-red-700 text-sm">
              Emergency level is critical. Focus on high-priority tasks immediately and prepare for immediate evacuation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};