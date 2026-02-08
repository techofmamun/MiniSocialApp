import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { IconButton, TextInput, useTheme } from "react-native-paper";
import { useAddComment } from "../../hooks/useComments";

interface CommentInputProps {
  postId: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({ postId }) => {
  const theme = useTheme();
  const [text, setText] = useState("");
  const addCommentMutation = useAddComment(postId);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await addCommentMutation.mutateAsync({ text: text.trim() });
      setText("");
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View
        style={[styles.container, { borderTopColor: theme.colors.outline }]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          mode="flat"
          style={styles.input}
          disabled={addCommentMutation.isPending}
          multiline
          maxLength={280}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSubmit}
          disabled={!text.trim() || addCommentMutation.isPending}
          loading={addCommentMutation.isPending}
          iconColor={
            text.trim() ? theme.colors.primary : theme.colors.onSurfaceDisabled
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
