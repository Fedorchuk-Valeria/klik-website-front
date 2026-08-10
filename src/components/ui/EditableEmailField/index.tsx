"use client";

import classNames from "classnames";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import Icon from "@/src/components/ui/Icon/Icon";
import TextInput from "@/src/components/ui/TextInput";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  clearEmailChangeSessionToken,
  clearErrors,
  emailChangeRequest,
} from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  value: string;
  childId?: number;
  className?: string;
  label?: string;
};

const EMAIL_REQUIRED = "Пожалуйста, заполните поле";
const EMAIL_INVALID = "Введите корректный email";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const EditableEmailField: FC<PropTypes> = ({
  value,
  childId,
  className,
  label = "E-mail",
}) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const openedSessionTokenRef = useRef<string | null>(null);
  const { errors, isEmailChangeLoading, emailChangeSessionToken } = useAppSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [clientError, setClientError] = useState<string | undefined>();

  if (emailChangeSessionToken && isEditing) {
    setIsEditing(false);
    setClientError(undefined);
  }

  useEffect(() => {
    if (!emailChangeSessionToken) {
      return;
    }

    if (openedSessionTokenRef.current === emailChangeSessionToken) {
      return;
    }

    openedSessionTokenRef.current = emailChangeSessionToken;
    const sessionToken = emailChangeSessionToken;

    dispatch(clearEmailChangeSessionToken());
    dispatch(
      showModal({
        modalType: ModalType.CONFIRM_CHILDREN_EMAIL,
        modalProps: {
          sessionToken,
          flow: "email_change",
        },
      })
    );
  }, [emailChangeSessionToken, dispatch]);

  const serverError = errors?.email ?? errors?.detail;
  const error = clientError ?? (isEditing ? serverError : undefined);

  const handleEdit = () => {
    dispatch(clearErrors());
    setClientError(undefined);
    setDraft(value);
    setIsEditing(true);
    queueMicrotask(() => {
      inputRef.current?.focus();
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
    setClientError(undefined);

    if (errors) {
      dispatch(clearErrors());
    }
  };

  const handleSave = () => {
    const nextEmail = draft.trim();

    if (nextEmail === (value ?? "").trim()) {
      setIsEditing(false);
      setClientError(undefined);
      dispatch(clearErrors());
      return;
    }

    if (!nextEmail) {
      setClientError(EMAIL_REQUIRED);
      return;
    }

    if (!isValidEmail(nextEmail)) {
      setClientError(EMAIL_INVALID);
      return;
    }

    dispatch(
      emailChangeRequest({
        email: nextEmail,
        childId,
      })
    );
  };

  return (
    <TextInput
      ref={inputRef}
      variant="outline"
      label={label}
      type="email"
      value={isEditing ? draft : value}
      readOnly={!isEditing}
      disabled={isEmailChangeLoading && isEditing}
      error={error}
      className={classNames("editable-email-field", className)}
      onChange={handleChange}
      addonAfter={
        <button
          type="button"
          className={classNames("editable-email-field__action", {
            "editable-email-field__action--disabled": isEmailChangeLoading,
          })}
          onClick={isEditing ? handleSave : handleEdit}
          disabled={isEmailChangeLoading}
          aria-label={isEditing ? "Сохранить email" : "Редактировать email"}
        >
          <Icon name={isEditing ? "success-circle" : "edit"} />
        </button>
      }
    />
  );
};

export default EditableEmailField;
