import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";

export const notificationService = {
  // Register device token for push notifications
  async registerDeviceToken(
    token: string,
    deviceType: "ios" | "android",
  ): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DEVICE_TOKENS, {
      token,
      deviceType,
    });
  },
};
