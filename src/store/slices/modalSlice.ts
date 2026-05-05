import { createSlice } from "@reduxjs/toolkit";

type ModalState = {
  active: boolean;
  modalProps?: Record<string, unknown>;
  modalType: string | null;
};

const initialState: ModalState = {
  modalType: null,
  modalProps: {},
  active: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action: { payload: Record<string, unknown> }) {
      return {
        ...state,
        ...action.payload,
        active: true,
      };
    },
    hideModal(state) {
      return {
        ...state,
        modalType: null,
        modalProps: {},
        active: false,
      };
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
