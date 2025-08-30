import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, Users, Car } from 'lucide-react';

type DisasterPhase = 'before' | 'during' | 'after';

interface EvacuationRoute {
  id: string;
  name: string;
  destination: string;
  distance: string;
  estimatedTime: string;
  capacity: number;
  currentLoad: number;
  status: 'clear' | 'congested' | 'blocked';
  checkpoints: string[];
}

interface EvacuationRoutesProps {
  currentPhase: DisasterPhase;
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const EvacuationRoutes: React.FC<EvacuationRoutesProps> = ({
  currentPhase,
  emergencyLevel,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  const mockRoutes: EvacuationRoute[] = [
    {
      id: 'route-1',
      name: 'Route A - Main Highway',
      destination: 'Da Nang Community Center',
      distance: '3.2 km',
      estimatedTime: '15 mins',
      capacity: 1000,
      currentLoad: 200,
      status: 'clear',
      checkpoints: ['Checkpoint 1: Tran Phu Bridge', 'Checkpoint 2: Han Market', 'Destination: Community Center']
    },
    {
      id: 'route-2',
      name: 'Route B - Coastal Road',
      destination: 'Hai Chau Sports Complex',
      distance: '4.1 km',
      estimatedTime: '25 mins',
      capacity: 800,
      currentLoad: 600,
      status: 'congested',
      checkpoints: ['Checkpoint 1: Dragon Bridge', 'Checkpoint 2: Bach Dang Port', 'Destination: Sports Complex']
    },
    {
      id: 'route-3',
      name: 'Route C - Mountain Path',
      destination: 'Son Tra Emergency Shelter',
      distance: '5.8 km',
      estimatedTime: '35 mins',
      capacity: 300,
      currentLoad: 50,
      status: 'clear',
      checkpoints: ['Checkpoint 1: Linh Ung Pagoda', 'Checkpoint 2: Son Tra Peak', 'Destination: Emergency Shelter']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-500 text-white';
      case 'congested': return 'bg-yellow-500 text-white';
      case 'blocked': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear': return '🟢';
      case 'congested': return '🟡';
      case 'blocked': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Evacuation Routes & Shelters
          </CardTitle>
          <CardDescription>
            Turn-by-turn evacuation routes with real-time capacity and traffic updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Clear Routes</span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {mockRoutes.filter(r => r.status === 'clear').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Congested</span>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                {mockRoutes.filter(r => r.status === 'congested').length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Blocked</span>
              </div>
              <p className="text-lg font-bold text-red-600">
                {mockRoutes.filter(r => r.status === 'blocked').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {mockRoutes.map((route) => (
          <Card
            key={route.id}
            className={`cursor-pointer transition-all ${
              selectedRoute === route.id ? 'ring-2 ring-blue-500' : ''
            } ${route.status === 'blocked' ? 'opacity-50' : ''}`}
            onClick={() => setSelectedRoute(route.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(route.status)}</span>
                  <div>
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {route.destination}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(route.status)}>
                  {route.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="text-sm font-medium">{route.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Est. Time</p>
                    <p className="text-sm font-medium">{route.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Capacity</p>
                    <p className="text-sm font-medium">
                      {route.currentLoad}/{route.capacity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Traffic</p>
                    <p className={`text-sm font-medium ${
                      route.status === 'clear' ? 'text-green-600' :
                      route.status === 'congested' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {route.status === 'clear' ? 'Light' :
                       route.status === 'congested' ? 'Heavy' : 'Blocked'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRoute === route.id && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Route Checkpoints:</h4>
                  <div className="space-y-2">
                    {route.checkpoints.map((checkpoint, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">{checkpoint}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      disabled={route.status === 'blocked'}
                    >
                      Start Navigation
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Share Route
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {currentPhase === 'before' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Preparedness Tip</h3>
                <p className="text-blue-700 text-sm">
                  Review evacuation routes now while roads are clear. Download offline maps and share routes with family members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhase === 'during' && emergencyLevel === 'critical' && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚨</div>
              <div>
                <h3 className="font-medium text-red-800 mb-1">Immediate Action Required</h3>
                <p className="text-red-700 text-sm mb-3">
                  Choose the clearest evacuation route immediately. Do not delay evacuation.
                </p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Start Emergency Evacuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};