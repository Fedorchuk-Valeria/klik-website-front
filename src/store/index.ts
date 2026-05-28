import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "./sagas";

import authReducer from "./slices/auth";
import coursesReducer from "./slices/corses";
import lessonReducer from "./slices/lesson";
import modalReducer from "./slices/modalSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    courses: coursesReducer,
    lesson: lessonReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
