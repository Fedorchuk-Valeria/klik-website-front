export interface ChatResponse {
  course_id: number;
  lesson_id: number;
  messages: ChatMessage[];
  remaining_messages: number;
  daily_limit: number;
  reset_at: string;
  welcome_message: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface SendChatMessageRequest {
  message: string;
}

export interface SendChatMessageResponse {
  answer: string;
  message: ChatMessage;
  remaining_messages: number;
  daily_limit: number;
  reset_at: string;
  limit_exceeded: boolean;
}
