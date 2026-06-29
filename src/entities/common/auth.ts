import { UserProfileRole } from ".";

export type AuthSignInRequest = {
  phone: string;
  password: string;
};

export type AuthRegisterRequest = {
  phone: string;
  full_name: string;
  password: string;
  confirm_password: string;
  branch_id?: string
};

export type AuthVerifyCodeRequest = {
  session_token: string;
  code: string;
};

export type AuthResetPasswordRequest = {
  session_token: string;
  password: string;
  confirm_password: string;
};

export type AuthGetCodeRequest = {
  phone: string;
};

export type AuthResendCodeRequest = {
  session_token: string;
};

export type AuthForgotPasswordRequest = {
  phone: string;
};

export type AuthChangePasswordRequest = {
  password: string;
  confirm_password: string;
};

export type CreateChildRequest = {
  full_name: string;
  phone: string;
  birth_date: string;
  password: string;
};

export type CreateChildResponse = {
  detail: string;
  child: {
    id: number;
    role: UserProfileRole;
    full_name: string;
    phone: string;
    birth_date: string;
    marketing_consent: boolean;
  };
};
