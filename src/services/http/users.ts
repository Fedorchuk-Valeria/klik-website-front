import {
  AuthChangePasswordRequest,
  AuthForgotPasswordRequest,
  AuthRegisterRequest,
  AuthResendCodeRequest,
  AuthResetPasswordRequest,
  AuthSignInRequest,
  AuthVerifyCodeRequest,
  CreateChildRequest,
} from "@/src/entities/common/auth";
import { GET, POST } from "@/src/utils/http";

const baseUrl = "/users";

export const signIn = (data: AuthSignInRequest) => POST(`${baseUrl}/login/`, data);

export const register = (data: AuthRegisterRequest) => POST(`${baseUrl}/register/`, data);

export const forgotPassword = (data: AuthForgotPasswordRequest) =>
  POST(`${baseUrl}/forgot-password/`, data);

export const verifyCode = (data: AuthVerifyCodeRequest) => POST(`${baseUrl}/verify-phone/`, data);

export const resendVerification = (data: AuthResendCodeRequest) =>
  POST(`${baseUrl}/resend-code/`, data);

export const resetPassword = (data: AuthResetPasswordRequest) =>
  POST(`${baseUrl}/reset-password/`, data);

export const changePassword = (data: AuthChangePasswordRequest) =>
  POST(`${baseUrl}/change-password/`, data);

export const logout = () => POST(`${baseUrl}/logout/`);

export const me = () => GET(`${baseUrl}/me/`);

export const createChild = (body: CreateChildRequest) => POST(`${baseUrl}/children/`, body);

export const getChildProfileByParent = (childId: number) => GET(`${baseUrl}/children/${childId}/`);
