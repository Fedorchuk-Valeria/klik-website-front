import { call, fork, put, takeLatest } from "redux-saga/effects";

import { UserProfileChilds } from "@/src/entities/common";
import { ProfileApi, UsersApi } from "@/src/services/http";
import { API_URL } from "@/src/utils/constant";
import { buildApiUrl } from "@/src/utils/buildApiUrl";
import {
  getCurrentChildFailure,
  getCurrentChildRequest,
  getCurrentChildSuccess,
  getPartnersFailure,
  getPartnersRequest,
  getPartnersSuccess, getPaymentHistoryFailure, getPaymentHistoryRequest, getPaymentHistorySuccess,
  Partner, PaymentHistoryResponse,
} from "@/src/store/slices/profile";
import {PayloadAction} from "@reduxjs/toolkit";
import {QueryParams} from "@/src/services/http/users";

function* workerGetPartners() {
  try {
    const response: { data: { results: Partner[] } } = yield call(ProfileApi.partners);

    yield put(getPartnersSuccess(response.data.results));
  } catch (error) {
    yield put(getPartnersFailure(error as Record<string, string> | null));
  }
}

function* watchGetPartners() {
  yield takeLatest(
    getPartnersRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetPartners
  );
}

function* workerGetCurrentChild(action: { payload: number }) {
  const childId = action.payload;
  const configuredBaseUrl = API_URL ?? "";
  const apiUrl = buildApiUrl(`/users/children/${childId}/`);

  console.log("[getCurrentChild] start", {
    childId,
    configuredBaseUrl: configuredBaseUrl || "(not set)",
    apiUrl: apiUrl || "(empty)",
  });

  try {
    const response: { data: UserProfileChilds } = yield call(
      UsersApi.getChildProfileByParent,
      childId
    );

    console.log("[getCurrentChild] success", {
      childId,
      apiUrl,
      full_name: response.data?.profile?.full_name,
    });

    yield put(getCurrentChildSuccess(response.data));
  } catch (error) {
    console.error("[getCurrentChild] failed", {
      childId,
      apiUrl,
      configuredBaseUrl: configuredBaseUrl || "(not set)",
      error,
    });

    yield put(getCurrentChildFailure(error as Record<string, string> | null));
  }
}

function* watchGetCurrentChild() {
  yield takeLatest(
    getCurrentChildRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetCurrentChild
  );
}
function* workerGetPaymentHistory(
  action: PayloadAction<QueryParams | undefined>
) {
  try {
    const response: { data: PaymentHistoryResponse } = yield call(
      () => UsersApi.getPaymentHistory(action.payload)
    );
    yield put(getPaymentHistorySuccess(response.data.results));
  } catch (error) {
    yield put(getPaymentHistoryFailure(error as Record<string, string> | null));
  }
}

function* watchGetPaymentHistory() {
  yield takeLatest(
    getPaymentHistoryRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetPaymentHistory
  );
}

export const profileWatchers = [fork(watchGetPartners), fork(watchGetCurrentChild), fork(watchGetPaymentHistory)];
