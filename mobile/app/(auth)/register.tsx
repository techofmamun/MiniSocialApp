import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSignup } from "../../src/hooks/useAuth";
import { useToast } from "../../src/providers";
import { validateEmail, validateUsername } from "../../src/utils/validation";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [secureText, setSecureText] = useState(true);

  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const signupMutation = useSignup();

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      showToast(usernameValidation.message || "Invalid username", "error");
      return;
    }

    if (displayName.trim().length < 2) {
      showToast("Display name must be at least 2 characters", "error");
      return;
    }

    try {
      await signupMutation.mutateAsync({
        email,
        password,
        username,
        displayName,
      });
      showToast("Registration successful!", "success");
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create account. Please try again.";
      showToast(errorMessage, "error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            Create Account
          </Text>
          <Text
            variant="titleMedium"
            style={[styles.subtitle, { color: theme.colors.onBackground }]}
          >
            Join TwitterX today
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            disabled={signupMutation.isPending}
          />

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
            disabled={signupMutation.isPending}
          />

          <TextInput
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            mode="outlined"
            style={styles.input}
            disabled={signupMutation.isPending}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={secureText}
            right={
              <TextInput.Icon
                icon={secureText ? "eye" : "eye-off"}
                onPress={() => setSecureText(!secureText)}
              />
            }
            style={styles.input}
            disabled={signupMutation.isPending}
            onSubmitEditing={handleRegister}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={signupMutation.isPending}
            disabled={signupMutation.isPending}
            style={styles.button}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={signupMutation.isPending}
            style={styles.linkButton}
          >
            Already have an account? Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 16,
  },
});
