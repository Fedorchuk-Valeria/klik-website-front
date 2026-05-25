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
  },
});

export const { getCoursesRequest, getCoursesSuccess, getCoursesFailure } = coursesSlice.actions;
export default coursesSlice.reducer;
