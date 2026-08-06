import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi, UsersApi } from "@/src/services/http";
import { Course } from "@/src/lib/getCourses";
import { buildApiUrl } from "@/src/utils/buildApiUrl";
import { API_URL, COURSES_PAGE_SIZE, QUERY_PARAMS } from "@/src/utils/constant";
import { QueryHelper } from "@/src/utils/helpers";
import {
  getCoursesFailure,
  getCoursesRequest,
  getCoursesSuccess,
  getCurrentCourseFailure,
  getCurrentCourseRequest,
  getCurrentCourseSuccess,
  purchaseFailure,
  purchaseOfflineFailure, purchaseOfflinePreviewFailure, purchaseOfflinePreviewRequest, purchaseOfflinePreviewSuccess,
  purchaseOfflineRequest, purchaseOfflineSuccess,
  purchaseRequest,
  purchaseSuccess,
} from "@/src/store/slices/corses";
import {PurchasePayload} from "@/src/services/http/courses";
import { normalizeCoursesResponse } from "@/src/utils/normalizeCoursesPayload";

export interface PurchaseOfflinePayload {
  child_id?: number;
  offline_group_id?: number;
  return_url: string;
}

export interface PurchaseOfflinePreviewPayload {
  child_id?: number;
  offline_group_id?: number;
  branch_id?: number;
  program_title?: string;
}

function* workerGetCourses(action: { payload: { query: string; append?: boolean } }): unknown {
  try {
    const endpoint = `/courses/${action.payload.query}`;
    const fullUrl = buildApiUrl(endpoint);

    console.log("[CoursesPage] client API request", {
      apiBase: API_URL ?? "(not set)",
      endpoint,
      fullUrl: fullUrl || "(empty)",
      append: action.payload.append ?? false,
    });

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
    const endpoint = `/courses/${action.payload}/`;
    const fullUrl = buildApiUrl(endpoint);

    console.log("[CoursePage] client API request", {
      apiBase: API_URL ?? "(not set)",
      endpoint,
      fullUrl: fullUrl || "(empty)",
      courseId: action.payload,
    });

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

function* workerPurchaseOfflinePreview(action: { payload: PurchaseOfflinePreviewPayload }): unknown {
  try {
    const response = yield call(UsersApi.purchaseOfflinePreview, action.payload);

    yield put(purchaseOfflinePreviewSuccess(response?.data));

  } catch (error) {
    yield put(purchaseOfflinePreviewFailure(error as Record<string, string> | null));
  }
}

function* watchPurchaseOfflinePreview() {
  yield takeLatest(
    purchaseOfflinePreviewRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerPurchaseOfflinePreview
  );
}

function* workerPurchaseOffline(action: { payload: PurchaseOfflinePayload }): unknown {
  try {
    const response = yield call(UsersApi.purchaseOffline, action.payload);

    yield put(purchaseOfflineSuccess());

    if (response?.data?.form_url) {
      window.location.href = response.data.form_url;
    }
  } catch (error) {
    yield put(purchaseOfflineFailure(error as Record<string, string> | null));
  }
}

function* watchPurchaseOffline() {
  yield takeLatest(
    purchaseOfflineRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerPurchaseOffline
  );
}

export const coursesWatchers = [
  fork(watchGetCourses),
  fork(watchMockPurchase),
  fork(watchGetCurrentCourse),
  fork(watchPurchaseOfflinePreview),
  fork(watchPurchaseOffline),
];
