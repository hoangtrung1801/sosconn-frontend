'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Clock, MapPin, Phone, Star, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Types for volunteers and support requests
interface Volunteer {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  location: string;
  isAvailable: boolean;
  rating: number;
  completedTasks: number;
  phone?: string;
}

interface SupportRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  requesterName: string;
  timestamp: Date;
  status: 'open' | 'in_progress' | 'completed';
  volunteersNeeded: number;
}

// Mock data for volunteers
const mockVolunteers: Volunteer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    avatar: '',
    skills: ['Cứu thương', 'Lái xe', 'Điều phối'],
    location: 'Hải Châu, Đà Nẵng',
    isAvailable: true,
    rating: 4.8,
    completedTasks: 24,
    phone: '0905123456',
  },
  {
    id: '2',
    name: 'Trần Thị Mai',
    avatar: '',
    skills: ['Y tế', 'Tâm lý học', 'Ngoại ngữ'],
    location: 'Sơn Trà, Đà Nẵng',
    isAvailable: true,
    rating: 4.9,
    completedTasks: 18,
    phone: '0907654321',
  },
  {
    id: '3',
    name: 'Lê Minh Tú',
    avatar: '',
    skills: ['Xây dựng', 'Điện nước', 'Logistics'],
    location: 'Thanh Khê, Đà Nẵng',
    isAvailable: false,
    rating: 4.7,
    completedTasks: 31,
  },
  {
    id: '4',
    name: 'Phạm Thị Lan',
    avatar: '',
    skills: ['Nấu ăn', 'Chăm sóc trẻ em', 'Tổ chức'],
    location: 'Liên Chiểu, Đà Nẵng',
    isAvailable: true,
    rating: 4.6,
    completedTasks: 15,
    phone: '0903111222',
  },
];

// Mock data for support requests
const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    title: 'Cần hỗ trợ di dời đồ đạc',
    description: 'Gia đình cần hỗ trợ di dời đồ đạc khỏi khu vực ngập úng',
    location: 'Phước Mỹ, Sơn Trà',
    urgency: 'high',
    requesterName: 'Hoàng Văn Nam',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'open',
    volunteersNeeded: 3,
  },
  {
    id: '2',
    title: 'Hỗ trợ phân phát lương thực',
    description: 'Cần tình nguyện viên hỗ trợ phân phát lương thực cho người dân vùng bị ảnh hưởng',
    location: 'Hòa Bắc, Hòa Vang',
    urgency: 'medium',
    requesterName: 'UBND Xã Hòa Bắc',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'in_progress',
    volunteersNeeded: 5,
  },
];

export const VolunteersHub: React.FC = () => {
  const [volunteers] = useState<Volunteer[]>(mockVolunteers);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    skills: '',
    location: '',
    phone: '',
  });
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium' as SupportRequest['urgency'],
    volunteersNeeded: 1,
  });

  // Handle volunteer registration
  const handleVolunteerRegistration = () => {
    if (newVolunteer.name.trim() === '' || newVolunteer.skills.trim() === '') return;

    // In real app, this would call API
    alert('Đăng ký tình nguyện viên thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    setNewVolunteer({ name: '', skills: '', location: '', phone: '' });
    setIsVolunteerDialogOpen(false);
  };

  // Handle support request creation
  const handleCreateSupportRequest = () => {
    if (newRequest.title.trim() === '' || newRequest.description.trim() === '') return;

    const request: SupportRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      location: newRequest.location,
      urgency: newRequest.urgency,
      requesterName: 'Bạn',
      timestamp: new Date(),
      status: 'open',
      volunteersNeeded: newRequest.volunteersNeeded,
    };

    setSupportRequests(prev => [request, ...prev]);
    setNewRequest({ title: '', description: '', location: '', urgency: 'medium', volunteersNeeded: 1 });
    setIsRequestDialogOpen(false);
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

  // Get urgency color
  const getUrgencyColor = (urgency: SupportRequest['urgency']) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get status color
  const getStatusColor = (status: SupportRequest['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white';
      case 'in_progress': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Volunteers Hub - Trung tâm Tình nguyện viên</h2>
        <p className="text-gray-600">Kết nối tình nguyện viên và những người cần hỗ trợ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Tình nguyện viên</span>
                </CardTitle>
                
                <Dialog open={isVolunteerDialogOpen} onOpenChange={setIsVolunteerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-1" />
                      Đăng ký
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Đăng ký tình nguyện viên</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="volunteerName">Họ và tên</Label>
                        <Input
                          id="volunteerName"
                          value={newVolunteer.name}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerSkills">Kỹ năng</Label>
                        <Input
                          id="volunteerSkills"
                          value={newVolunteer.skills}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, skills: e.target.value }))}
                          placeholder="VD: Cứu thương, Lái xe, Y tế..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerLocation">Khu vực</Label>
                        <Input
                          id="volunteerLocation"
                          value={newVolunteer.location}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Nhập khu vực bạn có thể hỗ trợ"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volunteerPhone">Số điện thoại</Label>
                        <Input
                          id="volunteerPhone"
                          value={newVolunteer.phone}
                          onChange={(e) => setNewVolunteer(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Số điện thoại liên hệ"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setIsVolunteerDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button 
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                          onClick={handleVolunteerRegistration}
                        >
                          Đăng ký
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {volunteers.map((volunteer) => (
                  <motion.div
                    key={volunteer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={volunteer.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{volunteer.name}</h3>
                          <Badge 
                            variant={volunteer.isAvailable ? "default" : "secondary"}
                            className={volunteer.isAvailable ? "bg-green-500" : "bg-gray-500"}
                          >
                            {volunteer.isAvailable ? 'Sẵn sàng' : 'Bận'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{volunteer.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{volunteer.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {volunteer.completedTasks} nhiệm vụ
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {volunteer.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{volunteer.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {volunteer.isAvailable && volunteer.phone && (
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Hand className="h-5 w-5 text-orange-500" />
                  <span>Yêu cầu hỗ trợ</span>
                </CardTitle>
                
                <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-1" />
                      Tạo yêu cầu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Tạo yêu cầu hỗ trợ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="requestTitle">Tiêu đề</Label>
                        <Input
                          id="requestTitle"
                          value={newRequest.title}
                          onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Mô tả ngắn gọn về hỗ trợ cần thiết"
                        />
                      </div>
                      <div>
                        <Label htmlFor="requestDescription">Mô tả chi tiết</Label>
                        <Textarea
                          id="requestDescription"
                          value={newRequest.description}
                          onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Mô tả chi tiết về tình huống và loại hỗ trợ cần thiết"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="requestLocation">Vị trí</Label>
                        <Input
                          id="requestLocation"
                          value={newRequest.location}
                          onChange={(e) => setNewRequest(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Địa điểm cần hỗ trợ"
                        />
                      </div>
                      <div>
                        <Label htmlFor="requestUrgency">Mức độ khẩn cấp</Label>
                        <select
                          id="requestUrgency"
                          value={newRequest.urgency}
                          onChange={(e) => setNewRequest(prev => ({ ...prev, urgency: e.target.value as SupportRequest['urgency'] }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="low">Thấp</option>
                          <option value="medium">Trung bình</option>
                          <option value="high">Cao</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="volunteersNeeded">Số tình nguyện viên cần</Label>
                        <Input
                          id="volunteersNeeded"
                          type="number"
                          min="1"
                          max="10"
                          value={newRequest.volunteersNeeded}
                          onChange={(e) => setNewRequest(prev => ({ ...prev, volunteersNeeded: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setIsRequestDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button 
                          className="flex-1 bg-orange-500 hover:bg-orange-600"
                          onClick={handleCreateSupportRequest}
                        >
                          Tạo yêu cầu
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {supportRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900">{request.title}</h3>
                        <div className="flex space-x-2">
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency === 'high' ? 'Khẩn cấp' : 
                             request.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status === 'open' ? 'Mở' : 
                             request.status === 'in_progress' ? 'Đang thực hiện' : 'Hoàn thành'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{request.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{request.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(request.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Cần {request.volunteersNeeded} người</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Người yêu cầu: {request.requesterName}
                      </div>
                      
                      {request.status === 'open' && (
                        <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                          Tham gia hỗ trợ
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteersHub;
