export const API_CONFIG = {
  BASE_URL: "https://twitter-x-backend-nine.vercel.app/api",
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  POSTS: {
    LIST: "/posts",
    CREATE: "/posts",
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    COMMENT: (id: string) => `/posts/${id}/comment`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
  },
  DEVICE_TOKENS: "/device-tokens",
};
