import { call, fork, put, takeLatest } from "redux-saga/effects";

import { ProfileApi } from "@/src/services/http";
import {
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

export const profileWatchers = [fork(watchGetPartners)];
