import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeService } from "../services/likeService";
import { Post } from "../types";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likeService.toggleLike(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot previous values
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      // Optimistically update all posts queries (feed, filtered feeds)
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
                      likedByUser: !post.likedByUser,
                      likesCount: post.likedByUser
                        ? post.likesCount - 1
                        : post.likesCount + 1,
                    }
                  : post,
              ),
            })),
          };
        },
      );

      // Optimistically update single post detail page
      queryClient.setQueryData<Post>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likedByUser: !old.likedByUser,
          likesCount: old.likedByUser ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      return { previousPosts, previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
    onSettled: () => {
      // Don't refetch - optimistic update is enough
      // Only refetch if there was an error (handled in onError)
    },
  });
};
