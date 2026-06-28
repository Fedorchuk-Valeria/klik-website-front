import { call, fork, put, takeLatest } from "redux-saga/effects";

import { UserProfileChilds } from "@/src/entities/common";
import { ProfileApi, UsersApi } from "@/src/services/http";
import {
  getCurrentChildFailure,
  getCurrentChildRequest,
  getCurrentChildSuccess,
  getPartnersFailure,
  getPartnersRequest,
  getPartnersSuccess,
  Partner,
} from "@/src/store/slices/profile";

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
  try {
    const response: { data: UserProfileChilds } = yield call(
      UsersApi.getChildProfileByParent,
      action.payload
    );
    yield put(getCurrentChildSuccess(response.data));
  } catch (error) {
    yield put(getCurrentChildFailure(error as Record<string, string> | null));
  }
}

function* watchGetCurrentChild() {
  yield takeLatest(
    getCurrentChildRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetCurrentChild
  );
}

export const profileWatchers = [fork(watchGetPartners), fork(watchGetCurrentChild)];
