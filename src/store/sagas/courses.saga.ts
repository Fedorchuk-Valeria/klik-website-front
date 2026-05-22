import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi } from "@/src/services/http";
import { getCoursesFailure, getCoursesRequest, getCoursesSuccess } from "@/src/store/slices/corses";
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

export const coursesWatchers = [fork(watchGetCourses)];
