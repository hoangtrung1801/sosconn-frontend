'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useGlobalStore from '@/store/useGlobalStore';
import { User } from '@/types';
import { useAuth } from '@/hooks/use-permissions';

// Mock users for testing
const mockUsers: (User | null)[] = [
  null, // Guest user
  {
    id: 'user-1',
    email: 'user@sosconn.vn',
    username: 'user1',
    fullName: 'Người dùng thường',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mod-1',
    email: 'moderator@sosconn.vn',
    username: 'mod1',
    fullName: 'Điều phối viên',
    role: 'moderator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    email: 'admin@sosconn.vn',
    username: 'admin1',
    fullName: 'Quản trị viên',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const UserSwitcher: React.FC = () => {
  const { login, logout } = useGlobalStore();
  const { user, role } = useAuth();

  const handleUserSwitch = (mockUser: User | null) => {
    if (mockUser) {
      login(mockUser);
    } else {
      logout();
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'moderator':
        return 'bg-orange-500 text-white';
      case 'user':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleText = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'Quản trị viên';
      case 'moderator':
        return 'Điều phối viên';
      case 'user':
        return 'Người dùng';
      default:
        return 'Khách';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Test Phân Quyền</CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Hiện tại:</span>
          <Badge className={getRoleColor(role)}>
            {getRoleText(role)}
          </Badge>
          {user && (
            <span className="text-sm text-gray-500">({user.fullName})</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {mockUsers.map((mockUser, index) => (
          <Button
            key={index}
            variant={
              (mockUser?.id === user?.id) || (!mockUser && !user) 
                ? "default" 
                : "outline"
            }
            size="sm"
            className="w-full justify-start"
            onClick={() => handleUserSwitch(mockUser)}
          >
            <Badge 
              className={`mr-2 ${getRoleColor(mockUser?.role || 'guest')}`}
              variant="secondary"
            >
              {getRoleText(mockUser?.role || 'guest')}
            </Badge>
            {mockUser?.fullName || 'Khách (chưa đăng nhập)'}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserSwitcher;
