import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { AuthTokens } from "@/types/user";
import { STORAGE_KEYS } from "../constants/key_strings";

const API_ENDPOINTS ={
  MAIN: process.env.NEXT_PUBLIC_API_URL || "https://warehouse.bizpro.com.np",
  AUTH: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://192.168.1.28:8000/api"
} 

class ApiClient {
  private authclient: AxiosInstance;
  private mainclient: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.mainclient = axios.create({
      baseURL: API_ENDPOINTS.MAIN,
      headers: {
        "Content-Type": "application/json",
      },
    });

     this.authclient = axios.create({
      baseURL: API_ENDPOINTS.AUTH,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const token = this.getAccessToken();
    if (token) {
       this.authclient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.mainclient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('✅ Token set on initialization');
    }

      this.setupInterceptors(this.authclient);
    this.setupInterceptors(this.mainclient);
  }

  private setupInterceptors(client: AxiosInstance) {
    // Response interceptor - catches 401 errors and refreshes token
    client.interceptors.response.use(
      (response) => response, // Success - do nothing
      
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Only handle 401 errors
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // Don't retry if the failing request is the refresh endpoint itself
        if (originalRequest?.url?.includes('/token/refresh/')) {
          console.log('❌ Refresh token is invalid - redirecting to login');
          this.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // Don't retry if we've already tried once
        if (originalRequest?._retry) {
          console.log('❌ Already retried - giving up');
          return Promise.reject(error);
        }

        // Mark this request as retried
        if (originalRequest) {
          originalRequest._retry = true;
        }

        try {
          console.log('🔄 Access token expired, refreshing...');

          // If already refreshing, wait for that promise
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshAccessToken();
          }

          const newAccessToken = await this.refreshPromise;
          this.refreshPromise = null;

          // Update default header
          this.authclient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          this.mainclient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          // Retry original request with new token
          if (originalRequest?.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }

          console.log('✅ Token refreshed successfully, retrying request');
          return client.request(originalRequest!);

        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          this.refreshPromise = null;
          this.clearTokens();
          
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          
          return Promise.reject(refreshError);
        }
      }
    );
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      console.log('Calling refresh endpoint...');

      // Use raw axios to avoid interceptor recursion
      const response = await axios.post(
        `${API_ENDPOINTS.AUTH}/auth/token/refresh/`,
        { refresh: refreshToken }, // Django SimpleJWT format
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Refresh response:', response.data);

      // Extract new access token
      const newAccessToken = response.data?.access;

      if (!newAccessToken) {
        throw new Error("No access token in refresh response");
      }

      // Store new token
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      }

      console.log('✅ New access token stored');
      return newAccessToken;
      
    } catch (error: any) {
      console.error("Token refresh error details:", error.response?.data);
      throw error;
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  public setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
    
    console.log('=== SETTING TOKENS ===');
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    
       this.authclient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    this.mainclient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    
    console.log('✅ Tokens stored and axios header updated');
  }

  public setCookies = async (
    name: string,
    value: string,
    expires : number | null | undefined = 1
  ): Promise<void> => {
    if (typeof window !== "undefined" && "cookieStore" in window) {
      const expirationDate = 
      typeof expires === "number"
      ? Date.now() + expires * 60 * 60 * 1000: undefined

      return (cookieStore as any).set({
        name,
        value,
        expires: expirationDate
      })
      
    }
    return Promise.reject(
      new Error("cookies is nto avialable in the current environment")
    )
  }

  public deleteCookies(name: string): Promise<void> {
    if (typeof window !== "undefined" && "cookieStore" in window) {
      // @ts-ignore
      return (cookieStore as any).delete(name);
    }
    return Promise.reject(
      new Error("cookieStore is not available in the current environment.")
    );
  }


  public clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
     delete this.authclient.defaults.headers.common['Authorization'];
    delete this.mainclient.defaults.headers.common['Authorization'];
    console.log('🗑️ Tokens cleared');
  }

 async authGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.authclient.get<T>(url, config);
    return response.data;
  }

  async authPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.authclient.post<T>(url, data, config);
    return response.data;
  }

  // Main API Methods (other endpoints)
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.mainclient.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.mainclient.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.mainclient.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.mainclient.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.mainclient.delete<T>(url, config);
    return response.data;
  }
}
export const apiClient = new ApiClient();
export default ApiClient;