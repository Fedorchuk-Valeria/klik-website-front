import { createSlice } from "@reduxjs/toolkit";

import { Lesson, LessonTest } from "@/src/lib/getCourses";

type LessonState = {
  isLoading: boolean;
  isTestLoading: boolean;
  data: Lesson | null;
  test: LessonTest | null;
  errors: Record<string, string> | null;
};

const initialState: LessonState = {
  isLoading: false,
  isTestLoading: false,
  data: null,
  errors: null,
  test: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    getLessonRequest(state, action: { payload: { coursePk: number; lessonPk: number } }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getLessonSuccess(state, action: { payload: Lesson }) {
      state.data = action.payload;
      state.isLoading = false;
    },
    getLessonFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },

    getLessonTestRequest(state, action: { payload: { coursePk: number; lessonPk: number } }) {
      void action.payload;
      state.isTestLoading = true;
      state.errors = null;
    },
    getLessonTestSuccess(state, action: { payload: LessonTest }) {
      state.test = action.payload;
      state.isTestLoading = false;
    },
    getLessonTestFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isTestLoading = false;
    },
  },
});

export const {
  getLessonRequest,
  getLessonSuccess,
  getLessonFailure,
  getLessonTestRequest,
  getLessonTestSuccess,
  getLessonTestFailure,
} = lessonSlice.actions;
export default lessonSlice.reducer;
