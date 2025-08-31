'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Plus, CheckCircle, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MapSelector from './MapSelector';
import CommentList from './CommentList';



// Types for community posts
interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  isConfirmed: boolean;
  urgency: 'low' | 'medium' | 'high';
}

// Mock data for community posts
const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Nguyễn Văn An',
      avatar: '',
      verified: true,
    },
    content: 'Khu vực cầu Trần Thị Lý đang có nguy cơ ngập úng do mưa lớn. Các phương tiện nên tránh đi qua khu vực này.',
    image: '',
    location: 'Cầu Trần Thị Lý, Đà Nẵng',
    coordinates: { lat: 16.0638, lng: 108.2287 },
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    likes: 15,
    comments: 8,
    isLiked: false,
    isConfirmed: true,
    urgency: 'high',
  },
  {
    id: '2',
    author: {
      name: 'Trần Thị Mai',
      avatar: '',
      verified: false,
    },
    content: 'Đang cần hỗ trợ lương thực cho khu vực bị cô lập ở xã Hòa Bắc. Liên hệ: 0905123456',
    location: 'Xã Hòa Bắc, Hòa Vang',
    coordinates: { lat: 16.0117, lng: 108.1019 },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 32,
    comments: 12,
    isLiked: true,
    isConfirmed: false,
    urgency: 'medium',
  },
  {
    id: '3',
    author: {
      name: 'Lê Minh Tú',
      avatar: '',
      verified: true,
    },
    content: 'Đội cứu hộ đã đến khu vực An Hải. Mọi người đã an toàn. Cảm ơn sự hỗ trợ của cộng đồng!',
    location: 'Quận Sơn Trà, Đà Nẵng',
    coordinates: { lat: 16.0844, lng: 108.2516 },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 48,
    comments: 20,
    isLiked: false,
    isConfirmed: true,
    urgency: 'low',
  },
];

export const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    urgency: 'medium' as CommunityPost['urgency'],
    image: null as File | null,
    imagePreview: '',
    coordinates: null as { lat: number; lng: number } | null,
  });

  // Handle like action
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  // Handle confirm action
  const handleConfirm = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isConfirmed: !post.isConfirmed }
        : post
    ));
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setNewPost(prev => ({
      ...prev,
      coordinates: { lat: location.lat, lng: location.lng },
      location: location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    }));
  };

  // Remove uploaded image
  const removeImage = () => {
    setNewPost(prev => ({
      ...prev,
      image: null,
      imagePreview: '',
    }));
  };

  // Handle create new post
  const handleCreatePost = () => {
    if (newPost.content.trim() === '') return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: 'Bạn',
        verified: false,
      },
      content: newPost.content,
      location: newPost.location,
      coordinates: newPost.coordinates || undefined,
      image: newPost.imagePreview || undefined,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isConfirmed: false,
      urgency: newPost.urgency,
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ 
      content: '', 
      location: '', 
      urgency: 'medium', 
      image: null, 
      imagePreview: '',
      coordinates: null,
    });
    setIsCreateDialogOpen(false);
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

  // Get urgency badge color
  const getUrgencyColor = (urgency: CommunityPost['urgency']) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Post Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bảng tin Cộng đồng</h2>
          <p className="text-gray-600">Chia sẻ thông tin và hỗ trợ lẫn nhau</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Đăng tin mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            <DialogHeader>
              <DialogTitle>Đăng tin mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Content */}
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  placeholder="Chia sẻ thông tin về tình hình thiên tai, yêu cầu hỗ trợ..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Hình ảnh (tùy chọn)</Label>
                <div className="mt-2">
                  {newPost.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={newPost.imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Map Section - 40% of form height */}
              <div>
                <Label>Chọn vị trí trên bản đồ</Label>
                <div className="mt-2 relative z-10" style={{ height: '250px' }}>
                  <MapSelector 
                    onLocationSelect={handleLocationSelect}
                    height="100%"
                    isVisible={isCreateDialogOpen}
                  />
                </div>
              </div>

              {/* Location Display */}
              {newPost.coordinates && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-800">Vị trí đã chọn:</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {newPost.location}
                  </p>
                  <p className="text-xs text-blue-500">
                    Tọa độ: {newPost.coordinates.lat.toFixed(6)}, {newPost.coordinates.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Manual Location Input */}
              <div>
                <Label htmlFor="location">Hoặc nhập địa điểm thủ công</Label>
                <Input
                  id="location"
                  placeholder="Nhập địa điểm cụ thể (tùy chọn)"
                  value={newPost.location}
                  onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* Urgency - dropdown với màu sắc đẹp hơn */}
              <div>
                <Label htmlFor="urgency">Mức độ khẩn cấp</Label>
                <select
                  id="urgency"
                  value={newPost.urgency}
                  onChange={(e) => setNewPost(prev => ({ ...prev, urgency: e.target.value as CommunityPost['urgency'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white text-gray-800 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  style={{
                    backgroundColor: newPost.urgency === 'low' ? '#f0fdf4' : 
                                   newPost.urgency === 'medium' ? '#fffbeb' : 
                                   newPost.urgency === 'high' ? '#fef2f2' : '#ffffff',
                    color: newPost.urgency === 'low' ? '#166534' : 
                           newPost.urgency === 'medium' ? '#a16207' : 
                           newPost.urgency === 'high' ? '#dc2626' : '#374151'
                  }}
                >
                  <option value="low" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                    Thấp
                  </option>
                  <option value="medium" style={{ backgroundColor: '#fffbeb', color: '#a16207' }}>
                    Trung bình
                  </option>
                  <option value="high" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                    Cao
                  </option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setNewPost({ 
                      content: '', 
                      location: '', 
                      urgency: 'medium', 
                      image: null, 
                      imagePreview: '',
                      coordinates: null,
                    });
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Đăng tin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                          {post.author.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                    </div>
                    <Badge className={getUrgencyColor(post.urgency)}>
                      {post.urgency === 'high' ? 'Khẩn cấp' : 
                       post.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-800 mb-4">{post.content}</p>
                  
                  {(post.location || post.coordinates) && (
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <div className="text-sm">
                        {post.location && <span>{post.location}</span>}
                        {post.coordinates && (
                          <div className="text-xs text-gray-500 mt-1">
                            Vị trí: {post.coordinates.lat.toFixed(6)}, {post.coordinates.lng.toFixed(6)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {post.image && (
                    <div className="mb-4">
                      <img 
                        src={post.image} 
                        alt="Post image" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 ${post.isConfirmed ? 'text-green-500' : 'text-gray-600'}`}
                      onClick={() => handleConfirm(post.id)}
                    >
                      <CheckCircle className={`h-4 w-4 ${post.isConfirmed ? 'fill-current' : ''}`} />
                      <span>{post.isConfirmed ? 'Đã xác nhận' : 'Xác nhận'}</span>
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <CommentList 
                    postId={post.id} 
                    initialCommentsCount={post.comments}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityFeed;
