import { Redirect } from "expo-router";
import { LoadingSpinner } from "../src/components/common/LoadingSpinner";
import { useAuth } from "../src/providers/AuthProvider";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
