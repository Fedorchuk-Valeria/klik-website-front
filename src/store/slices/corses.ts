import { createSlice } from "@reduxjs/toolkit";

import { Course } from "@/src/lib/getCourses";
import {PurchasePayload} from "@/src/services/http/courses";

type CoursesState = {
  isLoading: boolean;
  data: Course[];
  currentCourse: Course | null;
  errors: Record<string, string> | null;
};

const initialState: CoursesState = {
  isLoading: false,
  data: [],
  errors: null,
  currentCourse: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    getCoursesRequest(state, action: { payload: string }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getCoursesSuccess(state, action: { payload: Course[] }) {
      state.data = action.payload;
      state.isLoading = false;
    },
    getCoursesFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },
    getCurrentCourseRequest(state, action: { payload: number }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getCurrentCourseSuccess(state, action: { payload: Course }) {
      state.currentCourse = action.payload;
      state.isLoading = false;
    },
    getCurrentCourseFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },
    purchaseRequest(state, action: { payload: PurchasePayload }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },

    purchaseSuccess(state) {
      state.isLoading = false;
    },

    purchaseFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },

    clearCourses(state) {
      state.data = [];
      state.isLoading = false;
      state.errors = null;
      state.currentCourse = null;
    },
  },
});

export const {
  getCoursesRequest,
  getCoursesSuccess,
  getCoursesFailure,
  getCurrentCourseRequest,
  getCurrentCourseSuccess,
  getCurrentCourseFailure,
  purchaseRequest,
  purchaseSuccess,
  purchaseFailure,
  clearCourses,
} = coursesSlice.actions;
export default coursesSlice.reducer;
