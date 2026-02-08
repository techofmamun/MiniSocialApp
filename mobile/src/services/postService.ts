import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { ApiResponse, CreatePostData, PaginatedResponse, Post } from "../types";

export const postService = {
  // Get all posts (paginated)
  async getPosts(
    page = 1,
    limit = 10,
    username?: string,
  ): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (username) {
      params.append("username", username);
    }

    const response = await apiClient.get<
      ApiResponse<{ posts: Post[]; pagination: any }>
    >(`${API_ENDPOINTS.POSTS.LIST}?${params.toString()}`);

    return {
      data: response.data.data.posts,
      pagination: response.data.data.pagination,
    };
  },

  // Create a new post
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await apiClient.post<ApiResponse<{ post: Post }>>(
      API_ENDPOINTS.POSTS.CREATE,
      data,
    );
    return response.data.data.post;
  },

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(postId));
  },

  // Get a single post by ID
  async getPost(postId: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<{ post: Post }>>(
      `${API_ENDPOINTS.POSTS.LIST}/${postId}`,
    );
    return response.data.data.post;
  },
};
