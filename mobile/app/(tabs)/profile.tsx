import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import { useLogout } from "../../src/hooks/useAuth";
import { useAuth, useToast } from "../../src/providers";

export default function ProfileScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutMutation.mutateAsync();
            showToast("Signed out successfully", "success");
            router.replace("/(auth)/login");
          } catch (error) {
            showToast("Failed to sign out", "error");
          }
        },
      },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.displayName.substring(0, 2).toUpperCase()}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <Text variant="headlineSmall" style={styles.displayName}>
            {user.displayName}
          </Text>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            @{user.username}
          </Text>
          {user.email && (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
            >
              {user.email}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            loading={logoutMutation.isPending}
            disabled={logoutMutation.isPending}
            icon="logout"
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
  },
  displayName: {
    marginTop: 16,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
  },
  logoutButton: {
    marginTop: 8,
  },
});
