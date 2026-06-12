import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi } from "@/src/services/http";
import { Course } from "@/src/lib/getCourses";
import { COURSES_PAGE_SIZE, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";
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
import { normalizeCoursesResponse } from "@/src/utils/normalizeCoursesPayload";

function* workerGetCourses(action: { payload: { query: string; append?: boolean } }): unknown {
  try {
    const response = yield call(CoursesApi.getCourses, action.payload.query);
    const queryParams = QueryHelper.getFromQueryString(action.payload.query);
    const { data, meta } = normalizeCoursesResponse<Course>(response?.data, {
      page: Number(queryParams[QUERY_PARAMS.PAGE]) || 1,
      page_size: Number(queryParams[QUERY_PARAMS.PAGE_SIZE]) || COURSES_PAGE_SIZE,
    });

    yield put(
      getCoursesSuccess({
        data,
        meta,
        append: action.payload.append,
      })
    );
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

    console.log(response);

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
