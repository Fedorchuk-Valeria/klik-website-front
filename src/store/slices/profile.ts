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
  errors: Record<string, string> | null;
};

const initialState: ProfileState = {
  isLoading: false,
  partners: null,
  errors: null,
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

    clearPartners(state) {
      state.partners = null;
      state.errors = null;
    },
  },
});

export const { getPartnersRequest, getPartnersSuccess, getPartnersFailure, clearPartners } =
  profileSlice.actions;
export default profileSlice.reducer;
