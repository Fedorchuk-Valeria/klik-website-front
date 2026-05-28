"use client";

import {useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import TextInput from "@/src/components/ui/TextInput";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Привет!<br/><br/>Я твой AI помощник.<br/><br/>Ответь на несколько вопросов, и я подберу для тебя оптимальное решение.<br/><br/>😄 Готовы?",
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fakeRequest = async (text: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`<strong>Спасибо за ваш вопрос 👋</strong><br /><br />Сейчас это тестовый ответ AI-помощника.`);
      }, 2000);
    });
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fakeRequest(trimmedMessage);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat">
      {isOpen && (
        <div className="chat__window">
          <div className="chat__header">
            <span className="chat__title">
              Текст Приветствия!
            </span>

            <span className="chat__text">
              Давайте настроим всё за несколько быстрых шагов.
            </span>

            <button
              className="chat__close"
              onClick={() => setIsOpen(false)}
            >
              <Icon
                className="chat__close-icon"
                name="close"
              />
            </button>
          </div>

          <div
            className="chat__messages"
            ref={messagesRef}
          >
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat__message chat__message--${item.sender}`}
              >
                <div className="chat__message-name">
                  {item.sender === "bot"
                    ? "Твой AI помощник"
                    : "Ты"}
                </div>

                <span
                  className="text"
                  dangerouslySetInnerHTML={{
                    __html: item.text,
                  }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="chat__loader">
                <span className="chat__loader-text">
                  Ответ готовится
                </span>

                <span className="chat__dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            )}
          </div>

          <div className="chat__counter">
            <span>Осталось:</span> 9/10 вопросов.
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
              <Icon
                className="chat__send-icon"
                name="arrow-long"
              />
            </button>
          </div>
        </div>
      )}

      <button
        className="chat__button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon
          className="chat__button-icon"
          name="chat"
        />
      </button>
    </div>
  );
}
