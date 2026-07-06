import { call, fork, put, takeLatest } from "redux-saga/effects";

import { UserProfile } from "@/src/entities/common";
import {
  AuthChangePasswordRequest,
  AuthForgotPasswordRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
  AuthSignInRequest,
  AuthVerifyCodeRequest,
  CreateChildRequest,
  CreateChildResponse,
} from "@/src/entities/common/auth";
import { UsersApi } from "@/src/services/http";
import {
  changePasswordChildRequest,
  changePasswordChildSuccess,
  changePasswordRequest,
  changePasswordSuccess,
  createChildRequest,
  createChildSuccess,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  loginRequest,
  loginSuccess,
  logoutRequest,
  logoutSuccess,
  profileRequest,
  profileSuccess,
  registerRequest,
  registerSuccess,
  resendCodeRequest,
  resetPasswordRequest,
  resetPasswordSuccess,
  setErrors,
  verifyCodeRequest,
  verifyCodeSuccess,
} from "@/src/store/slices/auth";
import { PAGES, REFRESH_TOKEN_KEY, TOKEN_KEY, USER } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";
import localStorage from "@/src/utils/helpers/localStorage";

export const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function* workerAuthLogin({ payload }: { payload: AuthSignInRequest }): unknown {
  try {
    const response = yield call(UsersApi.signIn, payload);

    if (response?.data?.access) {
      CookieHelper.setCookie(TOKEN_KEY, response.data.access, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    if (response?.data?.refresh) {
      CookieHelper.setCookie(REFRESH_TOKEN_KEY, response.data.refresh, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    const profileResponse: { data: UserProfile } = yield call(UsersApi.me);

    const user = profileResponse?.data?.profile;

    localStorage.setStorageItem(USER, user);

    yield put(loginSuccess(response?.data?.user ?? null));
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthLogin() {
  yield takeLatest(
    loginRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthLogin
  );
}

function* workerAuthRegister({ payload }: { payload: AuthRegisterRequest }) {
  try {
    const response: { data: { session_token: string } } = yield call(UsersApi.register, payload);

    CookieHelper.setCookie(TOKEN_KEY, response.data.session_token, {
      path: "/",
      expires: new Date(Date.now() + MAX_AGE),
    });

    yield put(registerSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthRegister() {
  yield takeLatest(
    registerRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthRegister
  );
}

function* workerAuthForgotPassword({ payload }: { payload: AuthForgotPasswordRequest }) {
  try {
    const response: { data: { session_token: string } } = yield call(
      UsersApi.forgotPassword,
      payload
    );

    CookieHelper.setCookie(TOKEN_KEY, response.data.session_token, {
      path: "/",
      expires: new Date(Date.now() + MAX_AGE),
    });

    yield put(forgotPasswordSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthForgotPassword() {
  yield takeLatest(
    forgotPasswordRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthForgotPassword
  );
}

function* workerAuthVerifyCode({ payload }: { payload: AuthVerifyCodeRequest }) {
  try {
    yield call(UsersApi.verifyCode, payload);

    yield put(verifyCodeSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthVerifyCode() {
  yield takeLatest(
    verifyCodeRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthVerifyCode
  );
}

function* workerAuthResetPassword({ payload }: { payload: AuthResetPasswordRequest }) {
  try {
    const response: { data: { access: string; refresh: string; user: unknown } } = yield call(
      UsersApi.resetPassword,
      payload
    );

    if (response?.data?.access) {
      CookieHelper.setCookie(TOKEN_KEY, response.data.access, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    if (response?.data?.refresh) {
      CookieHelper.setCookie(REFRESH_TOKEN_KEY, response.data.refresh, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    yield put(resetPasswordSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthResetPassword() {
  yield takeLatest(
    resetPasswordRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthResetPassword
  );
}

function* workerAuthResendCode({ payload }: { payload: AuthVerifyCodeRequest }) {
  try {
    yield call(UsersApi.resendVerification, payload);

    yield put(forgotPasswordSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthResendCode() {
  yield takeLatest(
    resendCodeRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthResendCode
  );
}

function* workerAuthLogout() {
  try {
    //yield call(UsersApi.logout);
    yield put(logoutSuccess());

    CookieHelper.deleteCookie(TOKEN_KEY, { path: "/" });
    CookieHelper.deleteCookie(REFRESH_TOKEN_KEY, { path: "/" });

    localStorage.removeStorageItem(USER);
    window.location.href = PAGES.COURSES;
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchAuthLogout() {
  yield takeLatest(
    logoutRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerAuthLogout
  );
}

function* workerProfile() {
  try {
    const response: { data: UserProfile } = yield call(UsersApi.me);

    localStorage.setStorageItem(USER, response.data.profile);

    yield put(profileSuccess(response.data));
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchProfile() {
  yield takeLatest(
    profileRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerProfile
  );
}

function* workerChangePassword({ payload }: { payload: AuthChangePasswordRequest }) {
  try {
    yield call(UsersApi.changePassword, payload);

    yield put(changePasswordSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchChangePassword() {
  yield takeLatest(
    changePasswordRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerChangePassword
  );
}

function* workerCreateChild({ payload }: { payload: CreateChildRequest }) {
  try {
    const response: { data: CreateChildResponse } = yield call(UsersApi.createChild, payload);

    yield put(createChildSuccess(response.data.child));
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchCreateChild() {
  yield takeLatest(
    createChildRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerCreateChild
  );
}

function* workerChangeChildPassword({ payload }: { payload: AuthChangePasswordRequest }) {
  try {
    yield call(() => UsersApi.changeChildPassword(payload.id, payload));

    yield put(changePasswordChildSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchChangePasswordChild() {
  yield takeLatest(
    changePasswordChildRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerChangeChildPassword
  );
}

export const authWatchers = [
  fork(watchAuthLogin),
  fork(watchAuthRegister),
  fork(watchAuthForgotPassword),
  fork(watchAuthVerifyCode),
  fork(watchAuthResetPassword),
  fork(watchAuthResendCode),
  fork(watchAuthLogout),
  fork(watchProfile),
  fork(watchChangePassword),
  fork(watchCreateChild),
  fork(watchChangePasswordChild)
];
