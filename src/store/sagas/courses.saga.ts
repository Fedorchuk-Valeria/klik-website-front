import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi } from "@/src/services/http";
import {
  getCoursesFailure,
  getCoursesRequest,
  getCoursesSuccess,
  getCurrentCourseFailure,
  getCurrentCourseRequest,
  getCurrentCourseSuccess,
  purchaseFailure,
  purchaseRequest,
  purchaseSuccess,
} from "@/src/store/slices/corses";
import { normalizeCoursesPayload } from "@/src/utils/normalizeCoursesPayload";
import {PurchasePayload} from "@/src/services/http/courses";

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

function* workerGetCurrentCourse(action: { payload: number | string }): unknown {
  try {
    const response = yield call(CoursesApi.getCurrentCourse, action.payload);
    yield put(getCurrentCourseSuccess(response?.data));
  } catch (error) {
    yield put(getCurrentCourseFailure(error as Record<string, string> | null));
  }
}

function* watchGetCurrentCourse() {
  yield takeLatest(
    getCurrentCourseRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetCurrentCourse
  );
}

function* workerPurchase(action: { payload: PurchasePayload }): unknown {
  try {
    const response = yield call(CoursesApi.purchase, action.payload);

    yield put(purchaseSuccess());

    if (response?.data?.form_url) {
      window.location.href = response.data.form_url;
    }
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
  fork(watchGetCurrentCourse),
];
