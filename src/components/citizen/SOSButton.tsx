import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MapPin, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const SOSButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSOSPress = () => {
    setIsPressed(true);
    setCountdown(5);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerSOS = () => {
    // Simulate SOS actions
    console.log('🚨 SOS ACTIVATED');
    console.log('📍 GPS Location sent');
    console.log('📞 Emergency call initiated');
    console.log('📸 Camera activated for evidence');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsPressed(false);
      setCountdown(0);
    }, 3000);
  };

  const cancelSOS = () => {
    setIsPressed(false);
    setCountdown(0);
  };

  if (isPressed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <Card className="w-80 border-red-500">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 text-6xl mb-4">🚨</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">
              SOS ALERT ACTIVATING
            </h2>
            <div className="text-6xl font-bold text-red-600 mb-4">
              {countdown}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Emergency services will be contacted automatically
            </p>
            <div className="space-y-2 text-xs text-gray-500 mb-4">
              <div className="flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>GPS location will be shared</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Phone className="h-3 w-3" />
                <span>Emergency call will be made</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Camera className="h-3 w-3" />
                <span>Camera will activate for evidence</span>
              </div>
            </div>
            <Button 
              onClick={cancelSOS}
              variant="outline" 
              className="w-full border-gray-400"
            >
              Cancel SOS
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={handleSOSPress}
        size="lg"
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg animate-pulse"
      >
        <div className="text-center">
          <AlertTriangle className="h-6 w-6 mb-1" />
          <div className="text-xs font-bold">SOS</div>
        </div>
      </Button>
    </div>
  );
};