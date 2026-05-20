import {
  AuthForgotPasswordRequest,
  AuthRegisterRequest,
  AuthResendCodeRequest,
  AuthResetPasswordRequest,
  AuthSignInRequest,
  AuthVerifyCodeRequest,
} from "@/src/entities/common/auth";
import { POST } from "@/src/utils/http";

const baseUrl = "/users";

export const signIn = (data: AuthSignInRequest) => POST(`${baseUrl}/sign-in/`, data);

export const register = (data: AuthRegisterRequest) => POST(`${baseUrl}/register/`, data);

export const forgotPassword = (data: AuthForgotPasswordRequest) =>
  POST(`${baseUrl}/forgot-password/`, data);

export const verifyCode = (data: AuthVerifyCodeRequest) => POST(`${baseUrl}/verify-phone/`, data);

export const resendVerification = (data: AuthResendCodeRequest) =>
  POST(`${baseUrl}/resend-code/`, data);

export const resetPassword = (data: AuthResetPasswordRequest) =>
  POST(`${baseUrl}/reset-password/`, data);

export const logout = () => POST(`${baseUrl}/logout/`);
