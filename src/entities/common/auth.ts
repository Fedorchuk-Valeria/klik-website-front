export type AuthSignInRequest = {
  username: string;
  password: string;
};

export type AuthRegisterRequest = {
  phone: string;
  full_name: string;
  password: string;
  confirm_password: string;
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
