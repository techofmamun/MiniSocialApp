export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { valid: true };
};

export const validateUsername = (
  username: string,
): { valid: boolean; message?: string } => {
  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { valid: true };
};

export const validatePostText = (
  text: string,
): { valid: boolean; message?: string } => {
  if (text.trim().length === 0) {
    return { valid: false, message: "Post cannot be empty" };
  }
  if (text.length > 280) {
    return { valid: false, message: "Post cannot exceed 280 characters" };
  }
  return { valid: true };
};
