import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import { postService } from "../services/postService";
import { CreatePostData, Post } from "../types";

// Get posts with infinite scroll
export const usePosts = (username?: string) => {
  return useInfiniteQuery({
    queryKey: ["posts", username],
    queryFn: ({ pageParam = 1 }) =>
      postService.getPosts(pageParam, 10, username),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

// Get a single post
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically add new post to the top of the feed
      queryClient.setQueriesData<{ pages: any[] }>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old || !user) return old;

          // Create optimistic post
          const optimisticPost: Post = {
            id: `temp-${Date.now()}`,
            userId: user.id,
            text: newPost.text,
            likesCount: 0,
            commentsCount: 0,
            username: user.username,
            displayName: user.displayName,
            createdAt: new Date().toISOString(),
            likedByUser: false,
            comments: [],
          };

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [optimisticPost, ...page.data],
                  }
                : page,
            ),
          };
        },
      );

      return { previousPosts };
    },
    onSuccess: (newPostFromServer) => {
      queryClient.setQueriesData<{ pages: any[] }>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: page.data.map((post: Post) =>
                      post.id.startsWith("temp-") ? newPostFromServer : post,
                    ),
                  }
                : page,
            ),
          };
        },
      );
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
  });
};

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically remove post from feed
      queryClient.setQueriesData<{ pages: any[] }>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((post: Post) => post.id !== postId),
            })),
          };
        },
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
