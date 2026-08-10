import { createSlice } from "@reduxjs/toolkit";

import { UserProfile } from "@/src/entities/common";
import {
  AuthChangePasswordRequest,
  AuthForgotPasswordRequest,
  AuthRegisterRequest,
  AuthResendCodeRequest,
  AuthResetPasswordRequest,
  AuthSignInRequest,
  AuthVerifyCodeRequest,
  AuthVerifyPhoneResponse,
  CreateChildRequest,
} from "@/src/entities/common/auth";

import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";
import { getStorageItem } from "@/src/utils/helpers/localStorage";

type AuthState = {
  user_profile: UserProfile | null;
  user: unknown | null;
  errors: Record<string, string> | null;
  isRegisterSuccess: boolean;
  isCodeSent: boolean;
  isCodeCorrect: boolean;
  verifyPhoneResponse: AuthVerifyPhoneResponse | null;
  isLoading: boolean;
  isLogoutLoading: false;
  isResetPasswordSuccess: boolean;
  isPersonalAccountChanged: boolean;
  isCreateChildLoading: boolean;
  isChildVerificationPending: boolean;
  childVerificationSessionToken: string | null;
  isLoggedIn: boolean;
  isPasswordChanged: boolean;
  isChildSuccessfullyCreated: boolean;
};

const initialState: AuthState = {
  user_profile: getStorageItem<UserProfile>(USER),
  user: null,
  errors: null,
  isCreateChildLoading: false,
  isChildVerificationPending: false,
  childVerificationSessionToken: null,
  isRegisterSuccess: false,
  isCodeSent: false,
  isCodeCorrect: false,
  verifyPhoneResponse: null,
  isLoading: false,
  isLogoutLoading: false,
  isResetPasswordSuccess: false,
  isPersonalAccountChanged: false,
  isLoggedIn: !!CookieHelper.getCookie(TOKEN_KEY) && !!CookieHelper.getCookie(REFRESH_TOKEN_KEY),
  isPasswordChanged: false,
  isChildSuccessfullyCreated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // payload нужен для саги, в редьюсере не используется
    loginRequest(state, action: { payload: AuthSignInRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    registerRequest(state, action: { payload: AuthRegisterRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    forgotPasswordRequest(state, action: { payload: AuthForgotPasswordRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
      state.isCodeSent = false;
    },
    verifyCodeRequest(state, action: { payload: AuthVerifyCodeRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
      state.isCodeCorrect = false;
    },
    resetPasswordRequest(state, action: { payload: AuthResetPasswordRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    resendCodeRequest(state, action: { payload: AuthResendCodeRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    logoutRequest(state) {
      state.isLoading = true;
      state.errors = null;
    },

    loginSuccess(state, action: { payload: UserProfile }) {
      state.isLoading = false;
      state.user_profile = action.payload;
      state.isLoggedIn = true;
    },
    registerSuccess(state) {
      state.isLoading = false;
      state.isRegisterSuccess = true;
    },
    forgotPasswordSuccess(state) {
      state.isLoading = false;
      state.isCodeSent = true;
    },
    verifyCodeSuccess(state, action: { payload: AuthVerifyPhoneResponse | null }) {
      state.isLoading = false;
      state.isCodeCorrect = true;
      state.verifyPhoneResponse = action.payload;
    },
    resetPasswordSuccess(state) {
      state.isLoading = false;
      state.isResetPasswordSuccess = true;
    },
    logoutSuccess(state) {
      state.isLoading = false;
      state.user = null;
      state.isLoggedIn = false;
    },

    profileRequest: (state) => {
      state.isLoading = true;
    },
    profileSuccess: (state, action) => {
      state.isLoading = false;
      state.user_profile = action.payload;
    },

    createChildRequest: (state, action: { payload: CreateChildRequest }) => {
      void action.payload;
      state.isCreateChildLoading = true;
      state.errors = null;
    },
    createChildVerificationPending: (state, action: { payload: string }) => {
      state.isCreateChildLoading = false;
      state.isChildVerificationPending = true;
      state.childVerificationSessionToken = action.payload;
      state.errors = null;
    },
    createChildSuccess: (state, action) => {
      state.isCreateChildLoading = false;
      state.isChildVerificationPending = false;
      state.childVerificationSessionToken = null;
      state.user_profile = {
        ...(state.user_profile as UserProfile),
        children: [...(state?.user_profile?.children || []), action.payload],
      };
      state.isChildSuccessfullyCreated = true;
    },
    verifyChildCodeRequest: (state, action: { payload: AuthVerifyCodeRequest }) => {
      void action.payload;
      state.isCreateChildLoading = true;
      state.errors = null;
    },
    resendChildCodeRequest: (state, action: { payload: AuthResendCodeRequest }) => {
      void action.payload;
      state.isCreateChildLoading = true;
      state.errors = null;
    },
    resendChildCodeSuccess: (state) => {
      state.isCreateChildLoading = false;
    },
    clearChildVerificationPending: (state) => {
      state.isChildVerificationPending = false;
      state.childVerificationSessionToken = null;
    },

    setUser(state, action: { payload: unknown | null }) {
      state.user = action.payload;
      state.isLoading = false;
    },
    setCodeSent(state, action: { payload: boolean }) {
      state.isCodeSent = action.payload;
    },
    setCodeCorrect(state, action: { payload: boolean }) {
      state.isCodeCorrect = action.payload;
    },
    setErrors(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
      state.isCreateChildLoading = false;
    },
    setLoggedIn(state, action: { payload: boolean }) {
      state.isLoggedIn = action.payload;
    },

    clearErrors(state) {
      state.errors = null;
    },
    clearRegister(state) {
      state.isRegisterSuccess = false;
      state.errors = null;
    },
    clearResetPassword(state) {
      state.isCodeCorrect = false;
      state.isCodeSent = false;
      state.isResetPasswordSuccess = false;
      state.verifyPhoneResponse = null;
      state.errors = null;
    },
    clearVerifyPhoneResponse(state) {
      state.verifyPhoneResponse = null;
    },
    clearPersonalAccountChanged(state) {
      state.isPersonalAccountChanged = false;
    },
    clearPasswordChanged(state) {
      state.isPasswordChanged = false;
    },
    clearChildSuccessfullyCreated(state) {
      state.isChildSuccessfullyCreated = false;
    },

    changePasswordRequest(state, action: { payload: AuthChangePasswordRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    changePasswordSuccess(state) {
      state.isLoading = false;
      state.isPasswordChanged = true;
    },
    changePasswordChildRequest(state, action: { payload: AuthChangePasswordRequest }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    changePasswordChildSuccess(state) {
      state.isLoading = false;
      state.isPasswordChanged = true;
    },
  },
});

export const {
  setUser,
  setErrors,
  setCodeSent,
  setCodeCorrect,
  setLoggedIn,
  loginRequest,
  loginSuccess,
  logoutRequest,
  logoutSuccess,
  registerRequest,
  registerSuccess,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  verifyCodeRequest,
  verifyCodeSuccess,
  resetPasswordRequest,
  resetPasswordSuccess,
  resendCodeRequest,

  createChildRequest,
  createChildVerificationPending,
  createChildSuccess,
  verifyChildCodeRequest,
  resendChildCodeRequest,
  resendChildCodeSuccess,
  clearChildVerificationPending,

  clearPersonalAccountChanged,
  clearErrors,
  clearRegister,
  clearResetPassword,
  clearVerifyPhoneResponse,
  clearPasswordChanged,
  clearChildSuccessfullyCreated,

  profileRequest,
  profileSuccess,

  changePasswordRequest,
  changePasswordSuccess,

  changePasswordChildRequest,
  changePasswordChildSuccess,
} = authSlice.actions;
export default authSlice.reducer;
