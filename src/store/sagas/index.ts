import { all } from "redux-saga/effects";

import { authWatchers } from "./auth.saga";
import { coursesWatchers } from "./courses.saga";

export function* rootSaga() {
  yield all([...authWatchers, ...coursesWatchers]);
}
