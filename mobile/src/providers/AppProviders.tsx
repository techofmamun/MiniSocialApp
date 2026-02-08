import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { theme } from "../theme";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "./ToastProvider";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    },
    mutations: {
      retry: 0,
    },
  },
});

// Create persister for AsyncStorage
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <AuthProvider>
        <PaperProvider theme={theme}>
          <ToastProvider>{children}</ToastProvider>
        </PaperProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
};
