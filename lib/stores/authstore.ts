// store/authStore.ts
import { create } from "zustand";
import { authApi } from "@/lib/api/auth";
import { User, LoginCredentials, RegisterCredentials, RegisterResponse, LoginResponse } from "@/types/user";
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  register: (credentials: RegisterCredentials) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  checkAuth: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  error: null,

  initialize: () => {
    console.log('🔐 Initializing auth state...');
    
    const user = authApi.getCurrentUser();
    
    if (user) {
      console.log('✅ User found in storage:', user);
      set({
        user,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } else {
      console.log('⚠️ No user found in storage');
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

// Store stays the same - throws errors
login: async (credentials): Promise<LoginResponse> => {
  set({ isLoading: true, error: null });
  try {
    const response = await authApi.login(credentials);
    
    if (response.data && response.data.user) {
      set({ 
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null
      });
      return response; // Return LoginResponse
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error: any) {
    let errorMsg = "Login failed";
    
    // Safe error extraction
    try {
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data?.detail) {
          errorMsg = data.detail;
        } else if (data?.message) {
          errorMsg = data.message;
        }
      } else if (error?.message) {
        errorMsg = error.message;
      }
    } catch (parseError) {
      console.error("Error parsing error:", parseError);
    }
    
    set({ 
      error: errorMsg,
      isLoading: false,
      isAuthenticated: false
    });
    
    throw new Error(errorMsg); // Throw with clean message
  }
},
  register: async (credentials ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(credentials);
      set({ isLoading: false, error: null });
      
      return response;
    } catch (error: any) {
      let errorMsg = "Registration failed";
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMsg = Object.values(errors).flat().join(", ");
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      set({ 
        error: errorMsg,
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user , isInitialized : true });
  },


  clearError: () => {
    set({ error: null });
  },
    checkAuth: () => {
    const user = authApi.getCurrentUser();
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      isInitialized: true
    });
  },
}));