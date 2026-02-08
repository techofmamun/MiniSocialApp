import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { notificationService } from "../services/notificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const useNotifications = () => {
  const { user } = useAuth();
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;

      if (data.type === "like" && data.postId) {
        router.push(`/post/${data.postId}` as any);
      } else if (data.type === "comment" && data.postId) {
        router.push(`/post/${data.postId}` as any);
      }
    },
    [router],
  );

  const registerForPushNotifications = async () => {
    try {
      if (!Device.isDevice) {
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const deviceType = Platform.OS === "ios" ? "ios" : "android";
      await notificationService.registerDeviceToken(tokenData.data, deviceType);
    } catch {
      // Silent fail
    }
  };

  useEffect(() => {
    if (user) {
      registerForPushNotifications();
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Notification received in foreground
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse(response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user, handleNotificationResponse]);

  return {
    registerForPushNotifications,
  };
};
