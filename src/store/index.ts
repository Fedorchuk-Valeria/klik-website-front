import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootSaga } from "./sagas";

import authReducer from "./slices/auth";
import chatReducer from "./slices/chat";
import coursesReducer from "./slices/corses";
import lessonReducer from "./slices/lesson";
import modalReducer from "./slices/modalSlice";
import profileReducer from "./slices/profile";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    courses: coursesReducer,
    lesson: lessonReducer,
    chat: chatReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
