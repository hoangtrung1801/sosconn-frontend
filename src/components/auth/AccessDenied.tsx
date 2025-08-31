'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { AccessLevel } from '@/lib/auth/permissions';
import { useAuth } from '@/hooks/use-permissions';

interface AccessDeniedProps {
  requiredLevel: AccessLevel;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredLevel }) => {
  const { user, role } = useAuth();

  const getLevelText = (level: AccessLevel) => {
    switch (level) {
      case AccessLevel.ADMIN:
        return 'Quản trị viên';
      case AccessLevel.MODERATOR:
        return 'Điều phối viên';
      case AccessLevel.USER:
        return 'Người dùng đã đăng nhập';
      default:
        return 'Người dùng';
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ShieldX className="h-8 w-8 text-red-600" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Không có quyền truy cập
            </h1>
            
            <p className="text-gray-600">
              Bạn không có quyền truy cập vào trang này
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current vs Required Level */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quyền hiện tại:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getRoleText(role)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quyền yêu cầu:</span>
                <span className="text-sm font-medium text-red-600">
                  {getLevelText(requiredLevel)}
                </span>
              </div>
            </div>

            {/* Information */}
            <div className="text-center text-sm text-gray-600">
              {requiredLevel === AccessLevel.ADMIN ? (
                <div className="space-y-2">
                  <p>Trang này chỉ dành cho quản trị viên hệ thống.</p>
                  <p>Liên hệ với quản trị viên để được cấp quyền truy cập.</p>
                </div>
              ) : requiredLevel === AccessLevel.MODERATOR ? (
                <div className="space-y-2">
                  <p>Trang này chỉ dành cho điều phối viên và quản trị viên.</p>
                  <p>Liên hệ với quản trị viên để được nâng cấp quyền.</p>
                </div>
              ) : (
                <p>Vui lòng đăng nhập để truy cập trang này.</p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/home" className="w-full">
                <Button variant="default" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay về trang chủ
                </Button>
              </Link>

              {requiredLevel !== AccessLevel.PUBLIC && (
                <div className="flex space-x-3">
                  <Link to="/community" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Cộng đồng
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open('mailto:admin@sosconn.vn', '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Liên hệ
                  </Button>
                </div>
              )}
            </div>

            {/* User info */}
            {user && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Đăng nhập với tài khoản: <span className="font-medium">{user.email}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
