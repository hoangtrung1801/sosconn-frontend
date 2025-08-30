import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Bell, MapPin } from 'lucide-react';

type DisasterPhase = 'before' | 'during' | 'after';

interface AlertSystemProps {
  currentPhase: DisasterPhase;
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
  currentPhase,
  emergencyLevel,
}) => {
  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Flood Warning - Da Nang City',
      message: 'Heavy rainfall expected. Water levels rising in Han River area. Prepare for evacuation.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'high',
      location: 'District 1, Da Nang'
    },
    {
      id: 2,
      type: 'info',
      title: 'Shelter Availability Update',
      message: 'Da Nang Community Center has space available for 350 more people.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      location: 'Hai Chau District'
    },
    {
      id: 3,
      type: 'critical',
      title: 'Immediate Evacuation Required',
      message: 'Evacuate immediately to nearest shelter. Flood level critical in your area.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      priority: 'critical',
      location: 'Son Tra District'
    }
  ];

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Emergency Alert System
          </CardTitle>
          <CardDescription>
            Real-time emergency notifications and alerts for your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className={`${
                emergencyLevel === 'critical' ? 'bg-red-500' :
                emergencyLevel === 'high' ? 'bg-orange-500' :
                emergencyLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              } text-white`}>
                Alert Level: {emergencyLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                Phase: {currentPhase.toUpperCase()}
              </Badge>
            </div>
            <Button size="sm" variant="outline">
              <Bell className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockAlerts
              .filter(alert => 
                (currentPhase === 'before' && alert.type !== 'critical') ||
                (currentPhase === 'during') ||
                (currentPhase === 'after' && alert.type === 'info')
              )
              .map(alert => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAlertIcon(alert.type)}
                        <h3 className="font-medium text-sm">{alert.title}</h3>
                        <Badge className={getAlertColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentPhase === 'during' && (
        <Card className="border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Response Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <p className="text-red-800 font-medium text-sm">
                  🚨 Stay calm and follow official evacuation orders
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-red-600 hover:bg-red-700">
                  Emergency Call
                </Button>
                <Button variant="outline" className="border-red-500 text-red-600">
                  Find Shelter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};