import { call, fork, put, takeLatest } from "redux-saga/effects";

import { Lesson, LessonTest, LessonTestBody, PassedTest } from "@/src/lib/getCourses";
import { CoursesApi } from "@/src/services/http";
import {
  getLessonFailure,
  getLessonRequest,
  getLessonSuccess,
  getLessonTestFailure,
  getLessonTestRequest,
  getLessonTestSuccess,
  sendTestAnswersFailure,
  sendTestAnswersRequest,
  sendTestAnswersSuccess,
} from "@/src/store/slices/lesson";

function* workerGetLesson({ payload }: { payload: { coursePk: number; lessonPk: number } }) {
  try {
    const response: { data: Lesson } = yield call(
      CoursesApi.getLesson,
      payload.coursePk,
      payload.lessonPk
    );

    yield put(getLessonSuccess(response.data));
  } catch (error) {
    yield put(getLessonFailure(error as Record<string, string> | null));
  }
}

function* watchGetLesson() {
  yield takeLatest(
    getLessonRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetLesson
  );
}

function* workerGetLessonTest({ payload }: { payload: { coursePk: number; lessonPk: number } }) {
  try {
    const response: { data: LessonTest } = yield call(
      CoursesApi.getLessonTest,
      payload.coursePk,
      payload.lessonPk
    );

    yield put(getLessonTestSuccess(response.data));
  } catch (error) {
    yield put(getLessonTestFailure(error as Record<string, string> | null));
  }
}

function* watchGetLessonTest() {
  yield takeLatest(
    getLessonTestRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetLessonTest
  );
}

function* workerSendTestAnswers({
  payload,
}: {
  payload: { coursePk: number; lessonPk: number; body: LessonTestBody };
}) {
  try {
    const response: { data: PassedTest } = yield call(
      CoursesApi.sendTestAnswers,
      payload.coursePk,
      payload.lessonPk,
      payload.body
    );

    yield put(sendTestAnswersSuccess(response.data));
  } catch (error) {
    yield put(sendTestAnswersFailure(error as Record<string, string> | null));
  }
}

function* watchSendTestAnswers() {
  yield takeLatest(
    sendTestAnswersRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerSendTestAnswers
  );
}

export const lessonWatchers = [
  fork(watchGetLesson),
  fork(watchGetLessonTest),
  fork(watchSendTestAnswers),
];
