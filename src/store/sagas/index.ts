import { all } from "redux-saga/effects";

import { authWatchers } from "./auth.saga";
import { coursesWatchers } from "./courses.saga";
import { lessonWatchers } from "./lesson.saga";

export function* rootSaga() {
  yield all([...authWatchers, ...coursesWatchers, ...lessonWatchers]);
}
