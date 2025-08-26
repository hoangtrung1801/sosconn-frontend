'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Types for safety check data
interface SafetyCheckData {
  totalCheckIns: number;
  recentCheckIns: {
    id: string;
    name: string;
    location: string;
    timestamp: Date;
  }[];
  areaStats: {
    area: string;
    checkIns: number;
    total: number;
  }[];
}

// Mock data for safety check
const mockSafetyData: SafetyCheckData = {
  totalCheckIns: 1247,
  recentCheckIns: [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      location: 'Quận Hải Châu',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Trần Thị Mai',
      location: 'Quận Sơn Trà',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Lê Minh Tú',
      location: 'Quận Thanh Khê',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
  ],
  areaStats: [
    { area: 'Hải Châu', checkIns: 312, total: 450 },
    { area: 'Sơn Trà', checkIns: 298, total: 380 },
    { area: 'Thanh Khê', checkIns: 256, total: 320 },
    { area: 'Liên Chiểu', checkIns: 189, total: 280 },
    { area: 'Ngũ Hành Sơn', checkIns: 192, total: 250 },
  ],
};

export const SafetyCheck: React.FC = () => {
  const [safetyData, setSafetyData] = useState<SafetyCheckData>(mockSafetyData);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle safety check-in
  const handleSafetyCheckIn = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsCheckedIn(true);
      setSafetyData(prev => ({
        ...prev,
        totalCheckIns: prev.totalCheckIns + 1,
        recentCheckIns: [
          {
            id: Date.now().toString(),
            name: 'Bạn',
            location: 'Vị trí hiện tại',
            timestamp: new Date(),
          },
          ...prev.recentCheckIns.slice(0, 2),
        ],
      }));
      setIsLoading(false);
    }, 2000);
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Safety Check - Kiểm tra An toàn</h2>
        <p className="text-gray-600">Cập nhật tình trạng an toàn của bạn để thông báo cho người thân</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Safety Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <span>Báo cáo An toàn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {!isCheckedIn ? (
                <>
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full"
                        onClick={handleSafetyCheckIn}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Đang gửi...</span>
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="h-6 w-6 mr-2" />
                            Tôi an toàn
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-gray-600">
                    Nhấn để thông báo bạn đang an toàn và cho người thân biết tình trạng của bạn
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-green-100 p-4 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Đã báo cáo an toàn!</h3>
                    <p className="text-green-600 text-sm">
                      Thông tin của bạn đã được gửi đến trung tâm ứng phó khẩn cấp
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsCheckedIn(false)}
                  >
                    Báo cáo lại
                  </Button>
                </motion.div>
              )}

              {/* Total Check-ins Counter */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    {safetyData.totalCheckIns.toLocaleString()}
                  </span>
                </div>
                <p className="text-blue-600 text-sm">người đã báo cáo an toàn</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Báo cáo gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {safetyData.recentCheckIns.map((checkIn) => (
                  <motion.div
                    key={checkIn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{checkIn.name}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{checkIn.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatTimeAgo(checkIn.timestamp)}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Area Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span>Thống kê theo khu vực</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safetyData.areaStats.map((area, index) => {
                const percentage = Math.round((area.checkIns / area.total) * 100);
                return (
                  <motion.div
                    key={area.area}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{area.area}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {area.checkIns}/{area.total}
                        </span>
                        <Badge 
                          variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SafetyCheck;
