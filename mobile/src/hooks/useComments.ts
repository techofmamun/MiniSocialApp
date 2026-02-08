import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import { commentService } from "../services/commentService";
import { Comment, CreateCommentData, Post } from "../types";

// Get comments with infinite scroll
export const useComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      commentService.getComments(postId, pageParam, 20),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });
};

// Add comment mutation
export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: CreateCommentData) =>
      commentService.addComment(postId, data),
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous values
      const previousComments = queryClient.getQueryData(["comments", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        postId,
        userId: user?.id || "",
        username: user?.username || "",
        displayName: user?.displayName || "",
        text: newComment.text,
        createdAt: new Date().toISOString(),
      };

      // Optimistically add comment to comments list
      queryClient.setQueriesData<{ pages: any[] }>(
        { queryKey: ["comments", postId] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [optimisticComment, ...page.data],
                  }
                : page,
            ),
          };
        },
      );

      // Update comment count in single post view
      queryClient.setQueryData<Post>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          commentsCount: old.commentsCount + 1,
          comments: [optimisticComment, ...(old.comments || [])],
        };
      });

      // Update comment count in posts feed
      queryClient.setQueriesData<{ pages: any[] }>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post: Post) =>
                post.id === postId
                  ? {
                      ...post,
                      commentsCount: post.commentsCount + 1,
                    }
                  : post,
              ),
            })),
          };
        },
      );

      return { previousComments, previousPost, previousPosts };
    },
    onError: (err, newComment, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments,
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
