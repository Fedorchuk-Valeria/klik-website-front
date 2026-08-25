import { call, fork, put, select, takeLatest } from "redux-saga/effects";

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
  CourseAccessNotification,
  CreateChildRequest,
  CreateChildResponse,
  EmailChangeRequest,
  EmailChangeResponse,
} from "@/src/entities/common/auth";
import { UsersApi } from "@/src/services/http";
import { RootStore } from "@/src/store";
import {
  changePasswordChildRequest,
  changePasswordChildSuccess,
  changePasswordRequest,
  changePasswordSuccess,
  createChildRequest,
  createChildSuccess,
  createChildVerificationPending,
  emailChangeRequest,
  emailChangeSuccess,
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
  resendChildCodeRequest,
  resendChildCodeSuccess,
  resendCodeRequest,
  resetPasswordRequest,
  resetPasswordSuccess,
  setErrors,
  updateProfileEmail,
  verifyChildCodeRequest,
  verifyCodeRequest,
  verifyCodeSuccess,
} from "@/src/store/slices/auth";
import { updateCurrentChildEmail } from "@/src/store/slices/profile";
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

    yield put(
      loginSuccess({
        ...profileResponse?.data,
        course_access_notification: response?.data
          ?.course_access_notification as CourseAccessNotification,
      })
    );
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
    const response: { data: AuthVerifyPhoneResponse } = yield call(UsersApi.verifyCode, payload);
    const data = response?.data;

    if (data?.access) {
      CookieHelper.setCookie(TOKEN_KEY, data.access, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    if (data?.refresh) {
      CookieHelper.setCookie(REFRESH_TOKEN_KEY, data.refresh, {
        path: "/",
        expires: new Date(Date.now() + MAX_AGE),
      });
    }

    if (data?.access && data?.refresh) {
      const profileResponse: { data: UserProfile } = yield call(UsersApi.me);
      const profile: UserProfile = {
        ...profileResponse.data,
        account_data_notification:
          data.account_data_notification ?? profileResponse.data.account_data_notification,
        course_access_notification:
          data.course_access_notification ?? profileResponse.data.course_access_notification,
      };

      localStorage.setStorageItem(USER, profile.profile);
      yield put(loginSuccess(profile));
    }

    yield put(verifyCodeSuccess(data ?? null));
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
    const response: {
      data: CreateChildResponse & { session_token?: string };
    } = yield call(UsersApi.createChild, payload);

    if (response.data.session_token) {
      yield put(createChildVerificationPending(response.data.session_token));
      return;
    }

    if (response.data.child) {
      yield put(createChildSuccess(response.data.child));
    }
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

function* workerVerifyChildCode({ payload }: { payload: AuthVerifyCodeRequest }) {
  try {
    const response: { data: AuthVerifyPhoneResponse } = yield call(UsersApi.verifyCode, payload);
    const data = response.data;

    if (data.flow === "email_change" && data.email) {
      const emailChangeChildId: number | null = yield select(
        (state: RootStore) => state.auth.emailChangeChildId
      );

      yield put(
        updateProfileEmail({
          email: data.email,
          childId: emailChangeChildId ?? undefined,
        })
      );

      if (emailChangeChildId != null) {
        yield put(updateCurrentChildEmail(data.email));
      } else {
        const userProfile: UserProfile | null = yield select(
          (state: RootStore) => state.auth.user_profile
        );

        if (userProfile?.profile) {
          localStorage.setStorageItem(USER, {
            ...userProfile.profile,
            email: data.email,
          });
        }
      }

      return;
    }

    if (data.child) {
      yield put(createChildSuccess(data.child));
    }
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* workerEmailChange({ payload }: { payload: EmailChangeRequest }) {
  try {
    const response: { data: EmailChangeResponse } =
      payload.childId != null
        ? yield call(UsersApi.changeChildEmail, payload.childId, { email: payload.email })
        : yield call(UsersApi.changeMyEmail, { email: payload.email });

    yield put(
      emailChangeSuccess({
        session_token: response.data.session_token,
        target: payload.childId != null ? "child" : "me",
        childId: payload.childId,
      })
    );
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchEmailChange() {
  yield takeLatest(
    emailChangeRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerEmailChange
  );
}

function* watchVerifyChildCode() {
  yield takeLatest(
    verifyChildCodeRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerVerifyChildCode
  );
}

function* workerResendChildCode({ payload }: { payload: AuthResendCodeRequest }) {
  try {
    yield call(UsersApi.resendVerification, payload);

    yield put(resendChildCodeSuccess());
  } catch (error) {
    yield put(setErrors(error as Record<string, string> | null));
  }
}

function* watchResendChildCode() {
  yield takeLatest(
    resendChildCodeRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerResendChildCode
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
  fork(watchVerifyChildCode),
  fork(watchResendChildCode),
  fork(watchChangePasswordChild),
  fork(watchEmailChange),
];
