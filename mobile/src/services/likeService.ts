import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { ApiResponse, LikeResponse } from "../types";

export const likeService = {
  // Toggle like on a post
  async toggleLike(postId: string): Promise<LikeResponse> {
    const response = await apiClient.post<ApiResponse<LikeResponse>>(
      API_ENDPOINTS.POSTS.LIKE(postId),
    );
    return response.data.data;
  },
};
