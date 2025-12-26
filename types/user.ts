
export interface User {
  id: string;
  phone: string;
  first_name: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  company_info?: object
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RegisterResponse {
  sucess: boolean,
  message: string;
  data?:{
    user: {
      uuid: string,
      id: string;
      email: string;
      first_name: string;
      last_name: String
      is_verified: boolean
    };
  }
  tokens: AuthTokens;
}


export interface VerifyEmailRequest {
    token: string
    email: string
}

export interface VerifyEmailResponse {
    success: boolean
    message: string
    data?:{
        user?: User
    }
}
export interface ResendVerificationRequest {
  email: string
}

export interface ResendVerificationResponse {
  success: boolean,
  message: string
}


export interface SendEmailOTPRequest {
  otp: number;
}

export interface SendEmailOTPResponse {
  otp: number;
  success?: boolean;
  message?: string;
}

export interface VerifyEmailOTPRequest {
  otp: number;
}

export interface VerifyEmailOTPResponse {
  otp: number;
  success?: boolean;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}
