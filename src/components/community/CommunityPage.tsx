'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Hand, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import community components
import CommunityFeed from './CommunityFeed';
import SafetyCheck from './SafetyCheck';
import VolunteersHub from './VolunteersHub';
import KnowledgeHub from './KnowledgeHub';
import ChatbotWidget from './ChatbotWidget';

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community - Cộng đồng SOSConn
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kết nối cộng đồng trong thời điểm khẩn cấp. Chia sẻ thông tin, hỗ trợ lẫn nhau và cùng vượt qua khó khăn.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger 
                value="feed" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Bảng tin</span>
              </TabsTrigger>
              <TabsTrigger 
                value="safety" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">An toàn</span>
              </TabsTrigger>
              <TabsTrigger 
                value="volunteers" 
                className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Hand className="h-4 w-4" />
                <span className="hidden sm:inline">Tình nguyện</span>
              </TabsTrigger>
              <TabsTrigger 
                value="knowledge" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Kiến thức</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="min-h-96">
              <TabsContent value="feed" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommunityFeed />
                </motion.div>
              </TabsContent>

              <TabsContent value="safety" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SafetyCheck />
                </motion.div>
              </TabsContent>

              <TabsContent value="volunteers" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VolunteersHub />
                </motion.div>
              </TabsContent>

              <TabsContent value="knowledge" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <KnowledgeHub />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>

      {/* Chatbot Widget - Always visible */}
      <ChatbotWidget />
    </div>
  );
};

export default CommunityPage;
