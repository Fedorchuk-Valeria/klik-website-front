import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
