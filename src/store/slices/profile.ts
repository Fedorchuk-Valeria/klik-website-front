import { UserProfileChilds } from "@/src/entities/common";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface PaymentHistory {
  id: number;
  external_id: string;

  child_full_name: string;

  course_id: number;
  course_title: string;
  program_title: string;

  amount: number;
  currency: string;

  status: string;
  source: string;

  created_at: string;
  paid_at: string;
  payment_date: string;

  receipt_download_url: string;
  contract_download_url: string | null;
}

export interface PaymentHistoryResponse {
  results: PaymentHistory[];
}

export type Partner = {
  id: number;
  name: string;
  description: string;
  logo: string;
};

type PaymentHistoryQuery = Record<string, unknown>;

type ProfileState = {
  isLoading: boolean;
  partners: Partner[] | null;
  currentChild: UserProfileChilds | null;
  errors: Record<string, string> | null;
  paymentHistory: PaymentHistory[] | null;
};

const initialState: ProfileState = {
  isLoading: false,
  partners: null,
  errors: null,
  currentChild: null,
  paymentHistory: null,
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
    getPaymentHistoryRequest(state, action: PayloadAction<PaymentHistoryQuery | undefined>) {
      state.isLoading = true;
      state.errors = null;
    },

    getPaymentHistorySuccess(state, action: { payload: PaymentHistory[] }) {
      state.paymentHistory = action.payload;
      state.isLoading = false;
    },

    getPaymentHistoryFailure(
      state,
      action: { payload: Record<string, string> | null }
    ) {
      state.errors = action.payload;
      state.isLoading = false;
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
  getPaymentHistoryRequest,
  getPaymentHistorySuccess,
  getPaymentHistoryFailure
} = profileSlice.actions;
export default profileSlice.reducer;
