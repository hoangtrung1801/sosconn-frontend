'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
  initialValue?: string;
  isEditing?: boolean;
  className?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Viết bình luận...",
  isReply = false,
  initialValue = "",
  isEditing = false,
  className = ""
}) => {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setIsFocused(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setIsFocused(false);
    onCancel?.();
  };

  const shouldShowActions = isFocused || content.trim() || isReply || isEditing;

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="flex space-x-3">
        {!isReply && !isEditing && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              B
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={`resize-none border-gray-200 focus:border-blue-500 ${
              isReply || isEditing ? 'min-h-[80px]' : 'min-h-[60px]'
            }`}
            rows={isReply || isEditing ? 3 : 2}
          />
          
          {shouldShowActions && (
            <div className="flex items-center justify-end space-x-2 mt-2">
              {(isReply || isEditing || onCancel) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Hủy
                </Button>
              )}
              
              <Button
                type="submit"
                size="sm"
                disabled={!content.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="h-4 w-4 mr-1" />
                {isEditing ? 'Cập nhật' : isReply ? 'Trả lời' : 'Bình luận'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
