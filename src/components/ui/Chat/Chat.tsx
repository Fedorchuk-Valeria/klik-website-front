"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import TextInput from "@/src/components/ui/TextInput";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getChatRequest, sendChatMessageRequest } from "@/src/store/slices/chat";
import Markdown from "react-markdown";

export default function Chat() {
  const { id, lessonId } = useParams();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector((store: RootStore) => store.chat);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages, isLoading]);

  useEffect(() => {
    if (id && lessonId) {
      dispatch(getChatRequest({ courseId: Number(id), lessonId: Number(lessonId) }));
    }
  }, [id, lessonId, dispatch]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    dispatch(
      sendChatMessageRequest({
        courseId: Number(id) || 0,
        lessonId: Number(lessonId) || 0,
        message: trimmedMessage,
      })
    );
    setMessage("");
  };

  return (
    <div className="chat">
      {isOpen && (
        <div className="chat__window">
          <div className="chat__header">
            <span className="chat__title">Привет, чем могу помочь?</span>

            <span className="chat__text">Давайте настроим всё за несколько быстрых шагов.</span>

            <button className="chat__close" onClick={() => setIsOpen(false)}>
              <Icon className="chat__close-icon" name="close" />
            </button>
          </div>

          <div className="chat__messages" ref={messagesRef}>
            {data?.messages?.map((item) => (
              <div key={item.id} className={`chat__message chat__message--${item.role}`}>
                <div className="chat__message-name">
                  {item.role === "assistant" ? "Твой AI помощник" : "Ты"}
                </div>

                <span className="text">
                  <Markdown>{item.content}</Markdown>
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="chat__loader">
                <span className="chat__loader-text">Ответ готовится</span>

                <span className="chat__dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            )}
          </div>

          <div className="chat__counter">
            <span>Осталось:</span> {data?.remaining_messages}/{data?.daily_limit} вопросов.
          </div>

          <div className="chat__footer">
            <TextInput
              variant="outline"
              name="message"
              placeholder="Напиши вопрос ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="chat__input"
              disabled={isLoading}
              label={undefined}
            />

            <button
              className="chat__send"
              disabled={!message.trim() || isLoading}
              onClick={handleSend}
            >
              <Icon className="chat__send-icon" name="arrow-long" />
            </button>
          </div>
        </div>
      )}

      <button className="chat__button" onClick={() => setIsOpen((prev) => !prev)}>
        <Icon className="chat__button-icon" name="ai-bot" />
      </button>
    </div>
  );
}
