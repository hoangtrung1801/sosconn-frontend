export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: CommentAuthor;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  parentId?: string; // For nested replies
  replies?: Comment[];
  isEditing?: boolean;
  edited?: boolean;
  editedAt?: Date;
}

export interface CommentLike {
  id: string;
  commentId: string;
  userId: string;
  timestamp: Date;
}

export interface CommentForm {
  content: string;
  parentId?: string;
}

export interface CommentActions {
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onToggleReplies: (commentId: string) => void;
}
