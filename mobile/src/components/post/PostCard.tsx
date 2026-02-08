import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper";
import { useLikePost } from "../../hooks/useLikes";
import { Post } from "../../types";
import { formatTimeAgo } from "../../utils/time";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  showDelete?: boolean;
  isPressable?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  showDelete = false,
  isPressable = true,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const likePostMutation = useLikePost();

  const handlePress = () => {
    router.push(`/post/${post.id}`);
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    likePostMutation.mutate(post.id);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };

  const getAvatarText = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!isPressable}
    >
      <View style={styles.avatarContainer}>
        {post.photoURL ? (
          <Avatar.Image size={48} source={{ uri: post.photoURL }} />
        ) : (
          <Avatar.Text
            size={48}
            label={getAvatarText(post.displayName)}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text variant="titleSmall" style={styles.displayName}>
              {post.displayName}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              @{post.username} · {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
          {showDelete && onDelete && (
            <IconButton
              icon="delete-outline"
              size={20}
              onPress={handleDelete}
            />
          )}
        </View>

        <Text variant="bodyMedium" style={styles.text}>
          {post.text}
        </Text>

        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <IconButton
              onPress={handleLike}
              icon={post.likedByUser ? "heart" : "heart-outline"}
              size={20}
              iconColor={
                post.likedByUser
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant
              }
            />
            {post.likesCount > 0 && (
              <Text
                variant="bodyMedium"
                style={{
                  color: post.likedByUser
                    ? theme.colors.error
                    : theme.colors.onSurfaceVariant,
                }}
              >
                {post.likesCount}
              </Text>
            )}
          </View>

          <View style={styles.actionButton}>
            <IconButton
              icon="comment-outline"
              size={20}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={handlePress}
              disabled={!isPressable}
            />
            {post.commentsCount > 0 && (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {post.commentsCount}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 8,
  },
  avatarContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontWeight: "bold",
  },
  text: {
    marginTop: 4,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
