import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi } from "@/src/services/http";
import {
  getCoursesFailure,
  getCoursesRequest,
  getCoursesSuccess,
  purchaseFailure,
  purchaseRequest, purchaseSuccess
} from "@/src/store/slices/corses";
import { normalizeCoursesPayload } from "@/src/utils/normalizeCoursesPayload";

function* workerGetCourses(action: { payload: string }): unknown {
  try {
    const response = yield call(CoursesApi.getCourses, action.payload);

    yield put(getCoursesSuccess(normalizeCoursesPayload(response?.data)));
  } catch (error) {
    yield put(getCoursesFailure(error as Record<string, string> | null));
  }
}

function* watchGetCourses() {
  yield takeLatest(
    getCoursesRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetCourses
  );
}

function* workerPurchase(action: { payload: number }): unknown {
  try {
    const response = yield call(
      CoursesApi.purchase,
      action.payload
    );

    yield put(purchaseSuccess());

    /*if (response?.data?.payment_url) {
      console.log('repsonse=', response);
      window.location.href = response.data.payment_url;
    }*/
  } catch (error) {
    yield put(purchaseFailure(error as Record<string, string> | null));
  }
}

function* watchMockPurchase() {
  yield takeLatest(
    purchaseRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerPurchase
  );
}

export const coursesWatchers = [
  fork(watchGetCourses),
  fork(watchMockPurchase),
];
