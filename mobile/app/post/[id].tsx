import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Avatar, Divider, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommentInput } from "../../src/components/comment/CommentInput";
import { LoadingSpinner } from "../../src/components/common/LoadingSpinner";
import { PostCard } from "../../src/components/post/PostCard";
import { useComments } from "../../src/hooks/useComments";
import { useDeletePost, usePost } from "../../src/hooks/usePosts";
import { useAuth, useToast } from "../../src/providers";
import { Comment } from "../../src/types";
import { formatTimeAgo } from "../../src/utils/time";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: post, isLoading, error } = usePost(id!);
  const deletePostMutation = useDeletePost();
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useComments(id!);

  const comments = commentsData?.pages.flatMap((page) => page.data) || [];

  const handleDelete = async () => {
    if (!post) return;

    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePostMutation.mutateAsync(post.id);
              showToast("Post deleted successfully", "success");
              router.back();
            } catch (error: any) {
              showToast(error.message || "Failed to delete post", "error");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Avatar.Text
        size={32}
        label={item.displayName.substring(0, 2).toUpperCase()}
        style={{ backgroundColor: theme.colors.secondary }}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text variant="labelMedium" style={styles.username}>
            {item.displayName}
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            @{item.username}
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            · {formatTimeAgo(item.createdAt)}
          </Text>
        </View>
        <Text variant="bodyMedium">{item.text}</Text>
      </View>
    </View>
  );

  const renderHeader = () => {
    if (!post) return null;

    const canDelete = user?.id === post.userId;

    return (
      <>
        <PostCard
          post={post}
          onDelete={canDelete ? handleDelete : undefined}
          showDelete={canDelete}
          isPressable={false}
        />
        <Divider style={styles.divider} />
        <View style={styles.commentsHeader}>
          <Text variant="titleMedium" style={styles.commentsTitle}>
            Comments ({post.commentsCount || 0})
          </Text>
        </View>
      </>
    );
  };

  const renderEmpty = () => {
    if (isLoadingComments) {
      return (
        <View style={styles.emptyContainer}>
          <LoadingSpinner />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          No comments yet. Be the first to comment!
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetching || comments.length === 0) return null;
    return (
      <View style={styles.footer}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Failed to load post
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <View style={styles.contentContainer}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (hasNextPage && !isFetching) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
        {user && <CommentInput postId={id!} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    marginVertical: 8,
  },
  commentsHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  commentsTitle: {
    marginBottom: 0,
  },
  commentContainer: {
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  footer: {
    paddingVertical: 16,
  },
});
