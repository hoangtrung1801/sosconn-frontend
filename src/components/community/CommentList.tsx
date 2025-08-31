'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Comment } from '@/types';
import { getCommentsByPostId, mockComments } from '@/lib/mock-data/comment-data';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/lib/auth/permissions';
import { Link } from '@tanstack/react-router';

interface CommentListProps {
  postId: string;
  initialCommentsCount?: number;
  className?: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  initialCommentsCount = 0,
  className = ""
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { hasPermission } = usePermissions();

  // Load comments when component mounts or postId changes
  useEffect(() => {
    const postComments = getCommentsByPostId(postId);
    const commentsWithReplies = postComments.map(comment => ({
      ...comment,
      replies: mockComments.filter(c => c.parentId === comment.id)
    }));
    setComments(commentsWithReplies);
  }, [postId]);

  // Calculate total comments count (including replies)
  const totalCommentsCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  // Handle new comment submission
  const handleCommentSubmit = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      author: {
        id: 'current-user',
        name: 'Bạn',
        verified: false,
      },
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
    setShowCommentForm(false);
  };

  // Handle comment like
  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      // Handle reply likes
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    }));
  };

  // Handle comment reply
  const handleCommentReply = (parentCommentId: string, content: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      postId,
      parentId: parentCommentId,
      author: {
        id: 'current-user',
        name: 'Bạn',
        verified: false,
      },
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));
  };

  // Handle comment edit
  const handleCommentEdit = (commentId: string, newContent: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: newContent,
          edited: true,
          editedAt: new Date()
        };
      }
      // Handle reply edits
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              content: newContent,
              edited: true,
              editedAt: new Date()
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    }));
  };

  // Handle comment delete
  const handleCommentDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => {
      if (comment.id === commentId) {
        return false;
      }
      // Handle reply deletes
      if (comment.replies) {
        comment.replies = comment.replies.filter(reply => reply.id !== commentId);
      }
      return true;
    }));
  };

  const displayCount = totalCommentsCount || initialCommentsCount;

  return (
    <div className={className}>
      {/* Comments toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 p-2"
        onClick={() => setShowComments(!showComments)}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{displayCount}</span>
        <span className="hidden sm:inline">
          {displayCount === 1 ? 'bình luận' : 'bình luận'}
        </span>
        {showComments ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 pt-4 mt-4"
          >
            {/* Comment form */}
            <div className="mb-4">
              {hasPermission(Permission.COMMENT_POST) ? (
                showCommentForm ? (
                  <CommentForm
                    onSubmit={handleCommentSubmit}
                    onCancel={() => setShowCommentForm(false)}
                    placeholder="Viết bình luận..."
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-gray-500 hover:bg-gray-50"
                    onClick={() => setShowCommentForm(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Viết bình luận...
                  </Button>
                )
              ) : (
                <Link to="/auth/login" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-gray-500 hover:bg-gray-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Đăng nhập để bình luận...
                  </Button>
                </Link>
              )}
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              <AnimatePresence>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={handleCommentLike}
                    onReply={handleCommentReply}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                    replies={comment.replies}
                  />
                ))}
              </AnimatePresence>

              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có bình luận nào</p>
                  <p className="text-sm">Hãy là người đầu tiên bình luận!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentList;
