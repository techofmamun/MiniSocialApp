import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useCreatePost } from "../../src/hooks/usePosts";
import { useAuth, useToast } from "../../src/providers";
import { validatePostText } from "../../src/utils/validation";

export default function CreatePostScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const createPostMutation = useCreatePost();

  const handlePost = useCallback(async () => {
    const validation = validatePostText(text);
    if (!validation.valid) {
      showToast(validation.message || "Invalid post", "error");
      return;
    }

    if (!user) {
      showToast("You must be logged in to post", "error");
      return;
    }

    try {
      await createPostMutation.mutateAsync({ text: text.trim() });
      showToast("Post created successfully!", "success");
      router.back();
    } catch (error: any) {
      showToast(error.message || "Failed to create post", "error");
    }
  }, [text, user, createPostMutation, router, showToast]);

  const characterCount = text.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;
  const canPost = !createPostMutation.isPending && text.trim() && !isOverLimit;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handlePost}
          disabled={createPostMutation.isPending || !canPost}
        >
          <Text
            variant="labelLarge"
            style={{
              color: canPost ? theme.colors.primary : theme.colors.secondary,
              textAlign: "center",
              paddingHorizontal: 16,
              borderWidth: Platform.OS === "ios" ? 0 : 1,
              paddingVertical: Platform.OS === "ios" ? 0 : 4,
              borderRadius: 8,
              borderColor: canPost
                ? theme.colors.primary
                : theme.colors.secondary,
            }}
          >
            Post{createPostMutation.isPending ? "ing..." : ""}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    handlePost,
    createPostMutation.isPending,
    canPost,
    theme.colors.primary,
    theme.colors.secondary,
  ]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.centerContainer}>
        <View style={styles.content}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's happening?"
            multiline
            style={styles.input}
            autoFocus
            disabled={createPostMutation.isPending}
            mode="flat"
          />
          <View style={styles.footer}>
            <Text
              variant="labelMedium"
              style={{
                color: isOverLimit
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant,
              }}
            >
              {characterCount} / {maxCharacters}
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    padding: 16,
    width: "100%",
    maxWidth: 600,
  },
  input: {
    minHeight: "30%",
    fontSize: 18,
    backgroundColor: "transparent",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 8,
  },
});
