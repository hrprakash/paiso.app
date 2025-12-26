// lib/utils/publicClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://warehouse.bizpro.com.np/api";

console.log('🌐 Public API Client initialized with URL:', API_BASE_URL);

class PublicApiClient {
  private client: AxiosInstance;
  private Keyclient: AxiosInstance;

  constructor() {
    this.Keyclient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Api-Key HiAHwYwb.tuXbemM8kYtyOUhqbAbsgwcXEU4Eu9ow"
      },
      timeout: 30000, // 10 second timeout
    });

        this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for debugging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.params) {
          console.log('📦 Params:', config.params);
        }
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for debugging
    this.Keyclient.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          console.error(`❌ ${error.response.status} ${error.config?.url}`, error.response.data);
        } else if (error.request) {
          console.error('❌ No response received:', error.message);
          console.error('Server might be down or unreachable');
        } else {
          console.error('❌ Request setup error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }


  async Keyget<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.Keyclient.get<T>(url, config);
    return response.data;
  }
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const publicApiClient = new PublicApiClient();