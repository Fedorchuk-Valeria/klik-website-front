import { all } from "redux-saga/effects";

import { authWatchers } from "./auth.saga";
import { chatWatchers } from "./chat";
import { coursesWatchers } from "./courses.saga";
import { lessonWatchers } from "./lesson.saga";
import { profileWatchers } from "./profile.saga";

export function* rootSaga() {
  yield all([
    ...authWatchers,
    ...coursesWatchers,
    ...lessonWatchers,
    ...chatWatchers,
    ...profileWatchers,
  ]);
}
