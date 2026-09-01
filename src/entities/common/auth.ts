import { PENDING_ADMIN_REVIEW_STATUS } from "@/src/utils/constant";
import { UserProfileRole } from ".";

export type AuthSignInRequest = {
  phone: string;
  password: string;
};

export type AuthRegisterRequest = {
  phone: string;
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  branch_id?: string;
};

export type AuthVerifyCodeRequest = {
  session_token: string;
  code: string;
};

export type CourseAccessNotification = {
  show: boolean;
  title: string;
  message: string;
  course_id: number;
  course_title: string;
  parent_full_name: string;
};

export type AccountDataNotification = {
  show: boolean;
  parent_full_name: string;
  children: {
    id: number;
    full_name: string;
  }[];
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
  email: string;
};

export type AuthChangePasswordRequest = {
  id?: string;
  password: string;
  confirm_password: string;
};

export type CreateChildRequest = {
  email: string;
  full_name: string;
  phone: string;
  birth_date: string;
  password: string;
};

export type CreateChildPendingResponse = {
  detail: string;
  session_token: string;
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

export type AuthVerifyPhoneResponse = {
  flow: string;
  role?: UserProfileRole;
  access?: string;
  refresh?: string;
  course_access_notification?: CourseAccessNotification | null;
  account_data_notification?: AccountDataNotification | null;
  detail?: string;
  email?: string;
  child?: CreateChildResponse["child"];
  crm_id?: string;
  status?: typeof PENDING_ADMIN_REVIEW_STATUS;
};

export type EmailChangeRequest = {
  email: string;
  childId?: number;
};

export type EmailChangeResponse = {
  detail: string;
  session_token: string;
  flow: "email_change" | string;
};
