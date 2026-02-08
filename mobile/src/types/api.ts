// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface CommentResponse {
  comment: any;
  commentsCount: number;
}
