import {
  AuthForgotPasswordRequest,
  AuthRegisterRequest,
  AuthResendCodeRequest,
  AuthResetPasswordRequest,
  AuthSignInRequest,
  AuthVerifyCodeRequest,
} from "@/src/entities/common/auth";
import { createSlice } from "@reduxjs/toolkit";
import {UserProfile} from "@/src/entities/common";

type AuthState = {
  user_profile: UserProfile | null;
  user: unknown | null;
  errors: Record<string, string> | null;
  isRegisterSuccess: boolean;
  isCodeSent: boolean;
  isCodeCorrect: boolean;
  isLoading: boolean;
  isLogoutLoading: false;
  isResetPasswordSuccess: boolean;
  isPersonalAccountChanged: boolean;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user_profile: null,
  user: null,
  errors: null,
  isRegisterSuccess: false,
  isCodeSent: false,
  isCodeCorrect: false,
  isLoading: false,
  isLogoutLoading: false,
  isResetPasswordSuccess: false,
  isPersonalAccountChanged: false,
  isLoggedIn: false,
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

    loginSuccess(state, action: { payload: unknown }) {
      state.isLoading = false;
      state.user = action.payload;
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
    verifyCodeSuccess(state) {
      state.isLoading = false;
      state.isCodeCorrect = true;
    },
    resetPasswordSuccess(state) {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.isResetPasswordSuccess = true;
    },
    logoutSuccess(state) {
      state.isLoading = false;
      state.user = null;
      state.isLoggedIn = false;
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
    },
    setLoggedIn(state, action: { payload: boolean }) {
      state.isLoggedIn = action.payload;
    },

    clearRegister(state) {
      state.isRegisterSuccess = false;
      state.errors = null;
    },
    clearResetPassword(state) {
      state.isCodeCorrect = false;
      state.isCodeSent = false;
      state.isResetPasswordSuccess = false;
      state.errors = null;
    },
    clearPersonalAccountChanged(state) {
      state.isPersonalAccountChanged = false;
    },
    profileRequest: (state) => {
      state.isLoading = true;
    },

    profileSuccess: (state, action) => {
      state.isLoading = false;
      state.user_profile = action.payload;
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

  clearPersonalAccountChanged,

  clearRegister,
  clearResetPassword,

  profileRequest,
  profileSuccess,
} = authSlice.actions;
export default authSlice.reducer;
