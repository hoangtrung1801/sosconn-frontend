'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, MoreHorizontal, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Comment } from '@/types';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isReply?: boolean;
  replies?: Comment[];
  currentUserId?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
  replies = [],
  currentUserId = 'current-user', // Mock current user ID
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ`;
    return `${Math.floor(diffInMinutes / 1440)} ngày`;
  };

  // Check if current user owns this comment
  const isOwner = comment.author.id === currentUserId;

  const handleReplySubmit = (content: string) => {
    onReply(comment.id, content);
    setShowReplyForm(false);
  };

  const handleEditSubmit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={`${isReply ? 'ml-8' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <div className="flex space-x-3">
          {/* Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
              {comment.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Comment Bubble */}
            <div className="bg-gray-50 rounded-lg px-3 py-2 relative">
              {/* Author and timestamp */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {comment.author.name}
                </span>
                {comment.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.timestamp)}
                </span>
                {comment.edited && (
                  <span className="text-xs text-gray-400">(đã chỉnh sửa)</span>
                )}
              </div>

              {/* Comment text or edit form */}
              {isEditing ? (
                <CommentForm
                  onSubmit={handleEditSubmit}
                  onCancel={handleEditCancel}
                  placeholder="Chỉnh sửa bình luận..."
                  initialValue={comment.content}
                  isEditing={true}
                  className="mt-2"
                />
              ) : (
                <p className="text-gray-800 text-sm leading-relaxed">
                  {comment.content}
                </p>
              )}

              {/* Actions dropdown - only show for comment owner */}
              {isOwner && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Action buttons */}
            {!isEditing && (
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 ${
                    comment.isLiked ? 'text-red-500' : 'text-gray-500'
                  } hover:bg-gray-100`}
                  onClick={() => onLike(comment.id)}
                >
                  <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                  <span className={comment.likes > 0 ? 'ml-1' : ''}>Thích</span>
                </Button>

                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Trả lời
                  </Button>
                )}

                {replies.length > 0 && !isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {showReplies ? (
                      <ChevronUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ChevronDown className="h-3 w-3 mr-1" />
                    )}
                    {replies.length} trả lời
                  </Button>
                )}
              </div>
            )}

            {/* Reply form */}
            <AnimatePresence>
              {showReplyForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  <CommentForm
                    onSubmit={handleReplySubmit}
                    onCancel={() => setShowReplyForm(false)}
                    placeholder={`Trả lời ${comment.author.name}...`}
                    isReply={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Replies */}
        <AnimatePresence>
          {showReplies && replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-3"
            >
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isReply={true}
                  currentUserId={currentUserId}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CommentItem;
