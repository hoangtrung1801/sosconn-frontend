'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronDown, ChevronRight, Star, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Types for knowledge articles
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  rating: number;
  userRating?: number;
  totalRatings: number;
  lastUpdated: Date;
  tags: string[];
}

// Mock data for knowledge articles
const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Ứng phó với lũ lụt',
    content: `
**Trước khi có lũ:**
• Chuẩn bị túi khẩn cấp với nước uống, thực phẩm khô, đèn pin, radio, thuốc men
• Biết đường sơ tán và điểm tập trung an toàn
• Bảo quản giấy tờ quan trọng ở nơi cao và khô ráo

**Khi có lũ:**
• Di chuyển ngay đến nơi cao hơn
• Tránh xa các dây điện và thiết bị điện
• Không lái xe qua vùng nước ngập
• Nghe radio để cập nhật thông tin

**Sau lũ:**
• Kiểm tra nhà cửa và hệ thống điện trước khi sử dụng
• Vệ sinh và khử trùng khu vực bị ngập
• Chú ý sức khỏe và uống nước sạch`,
    category: 'Thiên tai',
    rating: 4.7,
    totalRatings: 156,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['lũ lụt', 'sơ tán', 'an toàn'],
  },
  {
    id: '2',
    title: 'Chuẩn bị cho mùa bão',
    content: `
**Chuẩn bị từ trước:**
• Theo dõi dự báo thời tiết thường xuyên
• Cắt tỉa cây xanh quanh nhà
• Gia cố mái nhà, cửa sổ
• Chuẩn bị đèn pin, nến, radio pin

**Khi bão đến gần:**
• Tích trữ nước sạch và thực phẩm
• Sạc đầy các thiết bị điện tử
• Di chuyển xe cộ, đồ đạc vào nơi an toàn
• Không ra ngoài trừ trường hợp khẩn cấp

**Trong bão:**
• Ở trong nhà, tránh xa cửa sổ
• Ngắt điện và gas
• Liên lạc với gia đình và bạn bè
• Nghe theo hướng dẫn của chính quyền`,
    category: 'Thiên tai',
    rating: 4.8,
    totalRatings: 203,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    tags: ['bão', 'chuẩn bị', 'phòng chống'],
  },
  {
    id: '3',
    title: 'Sơ cứu cơ bản',
    content: `
**Nguyên tắc chung:**
• Đảm bảo an toàn cho bản thân trước
• Gọi cấp cứu 115 ngay lập tức
• Không di chuyển người bị thương nặng

**Sơ cứu vết thương:**
• Rửa tay sạch trước khi xử lý
• Dùng khăn sạch ấn vào vết thương để cầm máu
• Băng bó nhẹ nhàng, không quá chặt

**CPR cơ bản:**
• Đặt bàn tay ở giữa ngực
• Ấn mạnh 5-6cm với tần suất 100-120 lần/phút
• Thổi ngạt miệng đối miệng 2 lần sau 30 lần ấn tim`,
    category: 'Y tế',
    rating: 4.9,
    totalRatings: 89,
    lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    tags: ['sơ cứu', 'cpr', 'y tế'],
  },
  {
    id: '4',
    title: 'Phòng chống cháy nổ',
    content: `
**Phòng ngừa:**
• Kiểm tra hệ thống điện định kỳ
• Không để vật dễ cháy gần nguồn nhiệt
• Lắp đặt thiết bị báo cháy
• Chuẩn bị bình chữa cháy

**Khi có cháy:**
• Gọi cứu hỏa 114 ngay lập tức
• Sử dụng khăn ướt che mũi miệng
• Bò thấp để thoát khỏi khói
• Đóng cửa lại để ngăn lửa lan

**Chữa cháy ban đầu:**
• Ngắt nguồn điện
• Dùng nước cho cháy thường
• Dùng bột khô cho cháy điện
• Không dùng nước cho cháy dầu mỡ`,
    category: 'An toàn',
    rating: 4.6,
    totalRatings: 134,
    lastUpdated: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    tags: ['cháy nổ', 'phòng chống', 'an toàn'],
  },
];

const categories = ['Tất cả', 'Thiên tai', 'Y tế', 'An toàn'];

export const KnowledgeHub: React.FC = () => {
  const [articles] = useState<KnowledgeArticle[]>(mockKnowledgeArticles);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  // Filter articles based on category and search term
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Toggle article expansion
  const toggleArticle = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  // Handle rating
  const handleRating = (articleId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [articleId]: rating }));
    // In real app, this would send rating to API
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hôm nay';
    } else if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    } else {
      return `${Math.floor(diffInDays / 30)} tháng trước`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Knowledge Hub - Kho Kiến thức</h2>
        <p className="text-gray-600">Hướng dẫn ứng phó với các tình huống khẩn cấp</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm hướng dẫn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy hướng dẫn nào phù hợp</p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="cursor-pointer" onClick={() => toggleArticle(article.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedArticles.has(article.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{article.rating}</span>
                        <span className="text-xs text-gray-500">({article.totalRatings})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {expandedArticles.has(article.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="prose prose-sm max-w-none">
                        {article.content.split('\n').map((line, lineIndex) => {
                          if (line.trim() === '') return <br key={lineIndex} />;
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <h4 key={lineIndex} className="font-semibold text-gray-900 mt-4 mb-2">
                                {line.slice(2, -2)}
                              </h4>
                            );
                          }
                          if (line.startsWith('•')) {
                            return (
                              <li key={lineIndex} className="text-gray-700 ml-4">
                                {line.slice(1).trim()}
                              </li>
                            );
                          }
                          return (
                            <p key={lineIndex} className="text-gray-700 mb-2">
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Rating Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Cập nhật: {formatTimeAgo(article.lastUpdated)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Đánh giá:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(article.id, star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  star <= (userRatings[article.id] || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                } hover:text-yellow-400 transition-colors`}
                              />
                            </button>
                          ))}
                          {userRatings[article.id] && (
                            <span className="text-sm text-gray-600 ml-2">
                              Bạn đã đánh giá: {userRatings[article.id]} sao
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeHub;
