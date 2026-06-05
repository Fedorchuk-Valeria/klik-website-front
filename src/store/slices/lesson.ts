import { createSlice } from "@reduxjs/toolkit";

import {
  Lesson,
  LessonTest,
  LessonTestBody,
  LessonTestQuestion,
  LessonTestResult,
  PassedTest,
} from "@/src/lib/getCourses";

type LessonState = {
  isLoading: boolean;
  isTestLoading: boolean;
  data: Lesson | null;
  test: LessonTest | null;
  result: LessonTestResult | null;
  review: LessonTestQuestion[] | null;
  errors: Record<string, string> | null;
};

const initialState: LessonState = {
  isLoading: false,
  isTestLoading: false,
  data: null,
  errors: null,
  test: null,
  review: null,
  result: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    getLessonRequest(state, action: { payload: { coursePk: number; lessonPk: number } }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
      state.test = null;
      state.review = null;
      state.result = null;
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
    getLessonTestSuccess(state, action: { payload: LessonTest | PassedTest }) {
      if (action.payload.status === "passed") {
        state.review = (action.payload as PassedTest).review;
        state.result = (action.payload as PassedTest).result;
      } else {
        state.test = action.payload as LessonTest;
      }
      state.isTestLoading = false;
    },
    getLessonTestFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isTestLoading = false;
    },

    sendTestAnswersRequest(
      state,
      action: { payload: { coursePk: number; lessonPk: number; body: LessonTestBody } }
    ) {
      void action.payload;
      state.isTestLoading = true;
      state.errors = null;
    },
    sendTestAnswersSuccess(state, action: { payload: PassedTest }) {
      state.review = action.payload.review;
      state.result = action.payload.result;
      state.isTestLoading = false;
    },
    sendTestAnswersFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isTestLoading = false;
    },

    clearTestResult(state) {
      state.test = null;
      state.result = null;
      state.review = null;
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
  sendTestAnswersRequest,
  sendTestAnswersSuccess,
  sendTestAnswersFailure,
  clearTestResult,
} = lessonSlice.actions;
export default lessonSlice.reducer;
