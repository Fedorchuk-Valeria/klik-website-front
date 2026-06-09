import { call, fork, put, takeLatest } from "redux-saga/effects";

import { ChatResponse, SendChatMessageResponse } from "@/src/entities/common/chat";
import { ChatApi } from "@/src/services/http";
import {
  getChatFailure,
  getChatRequest,
  getChatSuccess,
  sendChatMessageFailure,
  sendChatMessageRequest,
  sendChatMessageSuccess,
} from "@/src/store/slices/chat";

function* workerGetChat(action: { payload: { courseId: number; lessonId: number } }) {
  try {
    const response: { data: ChatResponse } = yield call(
      ChatApi.getChat,
      action.payload.courseId,
      action.payload.lessonId
    );
    yield put(getChatSuccess(response.data));
  } catch (error) {
    yield put(getChatFailure(error as Record<string, string> | null));
  }
}

function* watchGetChat() {
  yield takeLatest(
    getChatRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerGetChat
  );
}

function* workerSendChatMessage(action: {
  payload: { courseId: number; lessonId: number; message: string };
}) {
  try {
    const response: { data: SendChatMessageResponse } = yield call(
      ChatApi.sendChatMessage,
      action.payload.courseId,
      action.payload.lessonId,
      action.payload.message
    );

    yield put(sendChatMessageSuccess(response.data));
  } catch (error) {
    yield put(sendChatMessageFailure(error as Record<string, string> | null));
  }
}

function* watchSendChatMessage() {
  yield takeLatest(
    sendChatMessageRequest.type as unknown as Parameters<typeof takeLatest>[0],
    workerSendChatMessage
  );
}

export const chatWatchers = [fork(watchGetChat), fork(watchSendChatMessage)];
