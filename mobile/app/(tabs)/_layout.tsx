import { useNotifications } from "@/src/hooks/useNotifications";
import { Tabs } from "expo-router";
import { IconButton } from "react-native-paper";
import { TabHeader } from "../../src/components/common/TabHeader";

export default function TabsLayout() {
  useNotifications();
  return (
    <Tabs
      screenOptions={{
        header: () => <TabHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <IconButton
              icon={focused ? "home" : "home-outline"}
              iconColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconButton
              icon={focused ? "account" : "account-outline"}
              iconColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
