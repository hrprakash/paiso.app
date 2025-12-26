
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
   USER_UUID: "user_uuid",
} as const;

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/signin/",
  REGISTER: "/api/auth/signup/",
  LOGOUT: "/api/auth/logout/",
  REFRESH_TOKEN: "/api/v1/auth/token/refresh/",
  CURRENT_USER: "/api/auth/me/",
} as const;