// Post types for the Mini Social Feed App
export interface Post {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  commentsCount: number;
  username: string;
  displayName: string;
  photoURL?: string | null;
  likedByUser: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  text: string;
  createdAt: string;
}

export interface CreatePostData {
  text: string;
}

export interface CreateCommentData {
  text: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}
