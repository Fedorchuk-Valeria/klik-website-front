import { createSlice } from "@reduxjs/toolkit";

import { Meta } from "@/src/entities/common";
import { Course } from "@/src/lib/getCourses";
import { COURSES_PAGE_SIZE } from "@/src/utils/constant";

type GetCoursesRequestPayload = {
  query: string;
  append?: boolean;
};

type GetCoursesSuccessPayload = {
  data: Course[];
  meta: Meta;
  append?: boolean;
};

type InitCoursesFromSSRPayload = {
  data: Course[];
  meta: Meta;
};

type CoursesState = {
  isLoading: boolean;
  data: Course[];
  currentCourse: Course | null;
  errors: Record<string, string> | null;
  meta: Meta;
};

const initialState: CoursesState = {
  isLoading: false,
  data: [],
  errors: null,
  currentCourse: null,
  meta: {
    page: 1,
    page_size: COURSES_PAGE_SIZE,
    total_count: 0,
    total_pages: 0,
  },
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    getCoursesRequest(state, action: { payload: GetCoursesRequestPayload }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getCoursesSuccess(state, action: { payload: GetCoursesSuccessPayload }) {
      const { data, meta, append } = action.payload;

      if (append && data.length === 0) {
        state.meta = {
          ...state.meta,
          total_pages: state.meta.page,
        };
        state.isLoading = false;
        return;
      }

      state.data = append ? [...state.data, ...data] : data;
      state.meta = meta;
      state.isLoading = false;
    },
    getCoursesFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },
    initCoursesFromSSR(state, action: { payload: InitCoursesFromSSRPayload }) {
      state.data = action.payload.data;
      state.meta = action.payload.meta;
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
    purchaseRequest(state, action: { payload: number }) {
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
      state.meta = initialState.meta;
    },
  },
});

export const {
  getCoursesRequest,
  getCoursesSuccess,
  getCoursesFailure,
  initCoursesFromSSR,
  getCurrentCourseRequest,
  getCurrentCourseSuccess,
  getCurrentCourseFailure,
  purchaseRequest,
  purchaseSuccess,
  purchaseFailure,
  clearCourses,
} = coursesSlice.actions;
export default coursesSlice.reducer;
