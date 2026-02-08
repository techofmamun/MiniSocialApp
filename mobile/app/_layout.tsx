import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppProviders } from "../src/providers";

function AppContent() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Feed",
          }}
        />
        <Stack.Screen
          name="post/create"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Create Post",
          }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{
            headerShown: true,
            title: "Post",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
