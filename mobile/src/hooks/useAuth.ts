import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import { authService } from "../services/authService";
import { LoginData, SignupData } from "../types";

// Login mutation
export const useLogin = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (authResponse) => {
      setUser(authResponse.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Signup mutation
export const useSignup = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: (authResponse) => {
      setUser(authResponse.user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });
};
