import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export const TabHeader: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <IconButton icon="twitter" iconColor={theme.colors.primary} size={32} />
      <IconButton
        icon="plus-circle-outline"
        size={28}
        onPress={() => router.push("/post/create")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
