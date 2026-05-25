import { createSlice } from "@reduxjs/toolkit";

import { Course } from "@/src/lib/getCourses";

type CoursesState = {
  isLoading: boolean;
  data: Course[];
  errors: Record<string, string> | null;
};

const initialState: CoursesState = {
  isLoading: false,
  data: [],
  errors: null,
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
  },
});

export const { getCoursesRequest, getCoursesSuccess, getCoursesFailure, purchaseRequest, purchaseSuccess, purchaseFailure } = coursesSlice.actions;
export default coursesSlice.reducer;
