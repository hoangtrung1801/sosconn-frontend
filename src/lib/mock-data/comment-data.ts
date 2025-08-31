import { Comment } from '@/types';

export const mockComments: Comment[] = [
  // Comments for post 1
  {
    id: 'comment-1',
    postId: '1',
    author: {
      id: 'user-1',
      name: 'Lê Thị Hoa',
      avatar: '',
      verified: false,
    },
    content: 'Cảm ơn thông tin! Tôi đang ở gần khu vực này, sẽ tránh đi qua.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    likes: 3,
    isLiked: false,
    replies: [
      {
        id: 'comment-1-1',
        postId: '1',
        parentId: 'comment-1',
        author: {
          id: 'user-2',
          name: 'Nguyễn Văn An',
          avatar: '',
          verified: true,
        },
        content: 'Đúng rồi, mọi người hãy cẩn thận! Có thể đi đường khác an toàn hơn.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        likes: 1,
        isLiked: true,
      }
    ]
  },
  {
    id: 'comment-2',
    postId: '1',
    author: {
      id: 'user-3',
      name: 'Trần Minh Tuấn',
      avatar: '',
      verified: false,
    },
    content: 'Tôi vừa đi qua khu vực này 30 phút trước, nước đã lên khá cao rồi. Mọi người không nên đi qua!',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    likes: 8,
    isLiked: false,
    replies: []
  },
  {
    id: 'comment-3',
    postId: '1',
    author: {
      id: 'user-4',
      name: 'Phạm Thị Mai',
      avatar: '',
      verified: true,
    },
    content: 'Cảnh báo quan trọng! Đã thông báo lên lực lượng chức năng để có biện pháp xử lý.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    likes: 12,
    isLiked: true,
    replies: [
      {
        id: 'comment-3-1',
        postId: '1',
        parentId: 'comment-3',
        author: {
          id: 'user-5',
          name: 'Đinh Văn Long',
          avatar: '',
          verified: false,
        },
        content: 'Cảm ơn chị Mai! Hy vọng sẽ được xử lý sớm.',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        likes: 2,
        isLiked: false,
      }
    ]
  },

  // Comments for post 2
  {
    id: 'comment-4',
    postId: '2',
    author: {
      id: 'user-6',
      name: 'Hoàng Thị Lan',
      avatar: '',
      verified: false,
    },
    content: 'Tôi có thể hỗ trợ một số lương thực khô. Liên hệ: 0901234567',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: 'comment-4-1',
        postId: '2',
        parentId: 'comment-4',
        author: {
          id: 'user-7',
          name: 'Trần Thị Mai',
          avatar: '',
          verified: false,
        },
        content: 'Cảm ơn chị Lan! Tôi sẽ liên hệ ngay.',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        likes: 1,
        isLiked: false,
      }
    ]
  },
  {
    id: 'comment-5',
    postId: '2',
    author: {
      id: 'user-8',
      name: 'Ngô Văn Đức',
      avatar: '',
      verified: true,
    },
    content: 'Đội tình nguyện của chúng tôi có thể hỗ trợ vận chuyển. Đang chuẩn bị xuất phát.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    likes: 15,
    isLiked: true,
    replies: []
  },

  // Comments for post 3
  {
    id: 'comment-6',
    postId: '3',
    author: {
      id: 'user-9',
      name: 'Võ Thị Thu',
      avatar: '',
      verified: false,
    },
    content: 'Thật tuyệt vời! Cảm ơn anh Tú và đội cứu hộ. Mọi người đều bình an là điều quan trọng nhất.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 20,
    isLiked: false,
    replies: [
      {
        id: 'comment-6-1',
        postId: '3',
        parentId: 'comment-6',
        author: {
          id: 'user-10',
          name: 'Lê Minh Tú',
          avatar: '',
          verified: true,
        },
        content: 'Cảm ơn mọi người! Chúng ta cần đoàn kết trong những lúc khó khăn như thế này.',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        likes: 8,
        isLiked: false,
      }
    ]
  }
];

// Helper functions for comment operations
export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId && !comment.parentId);
};

export const getRepliesByCommentId = (commentId: string): Comment[] => {
  return mockComments.filter(comment => comment.parentId === commentId);
};

export const getCommentById = (commentId: string): Comment | undefined => {
  return mockComments.find(comment => comment.id === commentId);
};
