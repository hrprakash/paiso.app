// lib/api/auth.ts
import { apiClient } from "../utils/client";
import {  User, LoginCredentials, ResendVerificationRequest, ResendVerificationResponse, LoginResponse,  VerifyEmailRequest, VerifyEmailResponse, RegisterCredentials, RegisterResponse, SendEmailOTPRequest, SendEmailOTPResponse, VerifyEmailOTPResponse, ForgotPasswordRequest, ForgotPasswordResponse } from "@/types/user";
import { refresh } from "next/cache";
import { STORAGE_KEYS } from "../constants/key_strings";


export const authApi = {

login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.authPost<LoginResponse>(
    "/auth/signin/",
    credentials
  );
  
  console.log("=== LOGIN DEBUG ===");
  console.log("Full response:", response);
  console.log("response.data:", response.data);
  console.log("response.data.tokens:", response.data.tokens);
  console.log("Access token:", response.data.tokens?.accessToken);
  console.log("Refresh token:", response.data.tokens?.refreshToken);

  const { accessToken, refreshToken } = response.data.tokens;
  
  console.log("Extracted - Access:", accessToken);
  console.log("Extracted - Refresh:", refreshToken);
  
  apiClient.setTokens(response.data.tokens);
  
  // Check if tokens were actually saved
  console.log("After setTokens - localStorage access:", 
    localStorage.getItem('access_token')
  );
  console.log("After setTokens - localStorage refresh:", 
    localStorage.getItem('refresh_token')
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA, 
      JSON.stringify(response.data.user)
    );
  }
  apiClient.setCookies(STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken)

  return response;
},

register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.authPost<RegisterResponse>(
      "/auth/register/",
      credentials
    );



     if (response.data?.user?.uuid && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER_UUID, response.data.user.uuid);
    }
    return response;
  } catch (error: any) {
    console.error("❌ Registration error:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Payload sent:", credentials);
    throw error;
  }
},

  sendEmailOTP: async (uuid: string) : Promise <SendEmailOTPResponse> => {
try {
  console.log("sending otp to user:", uuid);
  const response = await apiClient.authPost<SendEmailOTPResponse>(
     `/auth/${uuid}/send-email-otp/`,
     {}
  )
  console.log("otp send successfulu");
  return response
  
} catch (error: any) {
  console.log("error sendin otp", error?.response?.data);
  throw error
}
  },

verifyEmailOTP: async (uuid : string, otp:number): Promise<VerifyEmailOTPResponse> => {
    try {
        console.log(' verification otp send email to ', uuid);
        const response = await apiClient.authPost<VerifyEmailOTPResponse>(
            `/auth/${uuid}/verify-email-otp/`,
             { otp : otp}
        )
        console.log("verification response", response);
        return response
        
    }catch(error: any){
        console.error("verification error", error?.response?.data);
        throw error
    }
},


  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.authPost<ForgotPasswordResponse>(
      "/auth/forgot-password/",
      { email }
    );
    return response;
  },


  getUserUUID: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.USER_UUID);
  },

  logout: async (): Promise<void> => {
    
      apiClient.clearTokens();
      apiClient.deleteCookies(STORAGE_KEYS.ACCESS_TOKEN)
    
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userStr ? JSON.parse(userStr) : null;
  },
};