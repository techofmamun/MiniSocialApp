import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import {
    ApiResponse,
    Comment,
    CommentResponse,
    CreateCommentData,
    PaginatedResponse,
} from "../types";

export const commentService = {
  // Add a comment to a post
  async addComment(
    postId: string,
    data: CreateCommentData,
  ): Promise<CommentResponse> {
    const response = await apiClient.post<ApiResponse<CommentResponse>>(
      API_ENDPOINTS.POSTS.COMMENT(postId),
      data,
    );
    return response.data.data;
  },

  // Get comments for a post
  async getComments(
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get<
      ApiResponse<{ comments: Comment[]; pagination: any }>
    >(`${API_ENDPOINTS.POSTS.COMMENTS(postId)}?${params.toString()}`);

    return {
      data: response.data.data.comments,
      pagination: response.data.data.pagination,
    };
  },
};
