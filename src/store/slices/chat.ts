import { createSlice } from "@reduxjs/toolkit";

import { ChatResponse, SendChatMessageResponse } from "@/src/entities/common/chat";

type ChatState = {
  isLoading: boolean;
  data: ChatResponse | null;
  errors: Record<string, string> | null;
};

const initialState: ChatState = {
  isLoading: false,
  data: null,
  errors: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getChatRequest(state, action: { payload: { courseId: number; lessonId: number } }) {
      void action.payload;
      state.isLoading = true;
      state.errors = null;
    },
    getChatSuccess(state, action: { payload: ChatResponse }) {
      state.data = action.payload;
      state.isLoading = false;
    },
    getChatFailure(state, action: { payload: Record<string, string> | null }) {
      state.errors = action.payload;
      state.isLoading = false;
    },
    sendChatMessageRequest(
      state,
      action: { payload: { courseId: number; lessonId: number; message: string } }
    ) {
      void action.payload;
      state.data = {
        ...(state?.data || ({} as ChatResponse)),
        messages: [
          ...(state?.data?.messages || []),
          {
            id: Date.now(),
            role: "user",
            content: action.payload.message,
            created_at: new Date().toISOString(),
          },
        ],
      };
      state.isLoading = true;
      state.errors = null;
    },
    sendChatMessageSuccess(state, action: { payload: SendChatMessageResponse }) {
      state.data = {
        ...(state?.data || ({} as ChatResponse)),
        messages: [...(state?.data?.messages || []), action.payload.message],
        remaining_messages: action.payload.remaining_messages,
        daily_limit: action.payload.daily_limit,
      };
      state.isLoading = false;
    },
    sendChatMessageFailure(state, action: { payload: Record<string, string> | null }) {
      if (action?.payload?.message) {
        state.data = {
          ...(state?.data || ({} as ChatResponse)),
          messages: [
            ...(state?.data?.messages || []),
            (action?.payload as unknown as SendChatMessageResponse)?.message,
          ],
        };
      } else {
        state.errors = action.payload;
      }
      state.isLoading = false;
    },

    clearChat(state) {
      state.data = null;
      state.errors = null;
    },
  },
});

export const {
  getChatRequest,
  getChatSuccess,
  getChatFailure,
  sendChatMessageRequest,
  sendChatMessageSuccess,
  sendChatMessageFailure,
  clearChat,
} = chatSlice.actions;
export default chatSlice.reducer;
