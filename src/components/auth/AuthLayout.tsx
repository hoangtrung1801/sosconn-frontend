'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, MapPin, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo & Brand */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start space-x-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  SOSConn
                </h1>
                <p className="text-sm text-gray-500">Emergency Management System</p>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Kết nối cộng đồng trong{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                thời khẩn cấp
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Hệ thống quản lý khẩn cấp toàn diện, giúp cộng đồng kết nối, 
              chia sẻ thông tin và hỗ trợ lẫn nhau trong những tình huống khó khăn.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Cộng đồng</h3>
              <p className="text-sm text-gray-600">Kết nối và hỗ trợ lẫn nhau</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Bản đồ</h3>
              <p className="text-sm text-gray-600">Theo dõi tình hình thời gian thực</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Cảnh báo</h3>
              <p className="text-sm text-gray-600">Thông báo khẩn cấp nhanh chóng</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">An toàn</h3>
              <p className="text-sm text-gray-600">Bảo vệ và hỗ trợ cộng đồng</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-100"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Người dùng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">500+</div>
              <div className="text-sm text-gray-600">Cứu hộ thành công</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Hỗ trợ</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                    SOSConn
                  </h1>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            
            {children}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
