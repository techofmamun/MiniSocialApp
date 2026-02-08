import { API_ENDPOINTS } from "../config/api";
import { apiClient, removeAuthToken, setAuthToken } from "../lib/apiClient";
import {
  ApiResponse,
  AuthResponse,
  LoginData,
  SignupData,
  User,
} from "../types";

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );

    const authData = response.data.data;
    await setAuthToken(authData.token);
    return authData;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data,
    );

    const authData = response.data.data;
    await setAuthToken(authData.token);
    return authData;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await removeAuthToken();
  },
};
