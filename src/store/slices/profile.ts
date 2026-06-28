import { UserProfileChilds } from "@/src/entities/common";
import { createSlice } from "@reduxjs/toolkit";

export type Partner = {
  id: number;
  name: string;
  description: string;
  logo: string;
};

type ProfileState = {
  isLoading: boolean;
  partners: Partner[] | null;
  currentChild: UserProfileChilds | null;
  errors: Record<string, string> | null;
};

const initialState: ProfileState = {
  isLoading: false,
  partners: null,
  errors: null,
  currentChild: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getPartnersRequest(state) {
      state.isLoading = true;
      state.errors = null;
    },
    getPartnersSuccess(state, action: { payload: Partner[] }) {
      state.partners = action.payload;
      state.isLoading = false;
    },
    getPartnersFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },

    getCurrentChildRequest(state, action: { payload: number }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getCurrentChildSuccess(state, action: { payload: UserProfileChilds }) {
      state.currentChild = action.payload;
      state.isLoading = false;
    },
    getCurrentChildFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },

    clearCurrentChild(state) {
      state.currentChild = null;
      state.errors = null;
    },
    clearPartners(state) {
      state.partners = null;
      state.errors = null;
    },
  },
});

export const {
  getPartnersRequest,
  getPartnersSuccess,
  getPartnersFailure,
  getCurrentChildRequest,
  getCurrentChildSuccess,
  getCurrentChildFailure,
  clearPartners,
  clearCurrentChild,
} = profileSlice.actions;
export default profileSlice.reducer;
