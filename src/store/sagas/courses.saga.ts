import { call, fork, put, takeLatest } from "redux-saga/effects";

import { CoursesApi } from "@/src/services/http";
import { normalizeCoursesPayload } from "@/src/utils/normalizeCoursesPayload";
import { getCoursesFailure, getCoursesRequest, getCoursesSuccess } from "../slices/corses";

function* workerGetCourses(): unknown {
  try {
    const response = yield call(CoursesApi.getCourses);

    yield put(getCoursesSuccess(normalizeCoursesPayload(response?.data)));
  } catch (error) {
    yield put(getCoursesFailure(error as Record<string, string> | null));
  }
}

function* watchGetCourses() {
  yield takeLatest(getCoursesRequest.type, workerGetCourses);
}

export const coursesWatchers = [fork(watchGetCourses)];
