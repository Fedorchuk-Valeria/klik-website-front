import classNames from "classnames";
import { useFormik } from "formik";
import { ChangeEvent, FC, useEffect, useRef } from "react";

import { confirmCodeValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import CodeInput from "@/src/components/ui/CodeInput";
import Modal from "@/src/components/ui/Modal";

import { ModalType } from "@/src/entities/common";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  clearChildSuccessfullyCreated,
  clearEmailChangeSuccess,
  clearErrors,
  resendChildCodeRequest,
  verifyChildCodeRequest,
} from "@/src/store/slices/auth";
import { showModal } from "@/src/store/slices/modalSlice";

type PropTypes = {
  isVisible: boolean;
  sessionToken: string;
  flow?: "create_child" | "email_change";
  className?: string;
};

const WidgetModalConfirmChildrenEmail: FC<PropTypes> = ({
  className,
  isVisible,
  sessionToken,
  flow = "create_child",
}) => {
  const codeInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const {
    isCreateChildLoading,
    isEmailChangeLoading,
    isChildSuccessfullyCreated,
    isEmailChangeSuccess,
    errors: childErrors,
  } = useAppSelector((state) => state.auth);

  const isBusy = isCreateChildLoading || isEmailChangeLoading;

  const form = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: confirmCodeValidationSchema,
    onSubmit: (values) => {
      dispatch(
        verifyChildCodeRequest({
          session_token: sessionToken,
          code: values.code,
        })
      );
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value);
  };

  const handleResendCode = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(
      resendChildCodeRequest({
        session_token: sessionToken,
      })
    );
  };

  useEffect(() => {
    if (childErrors) {
      form.setFieldError("code", childErrors.detail ?? childErrors.code);
    }
  }, [childErrors]);

  useEffect(() => {
    if (isChildSuccessfullyCreated) {
      dispatch(clearChildSuccessfullyCreated());
      dispatch(
        showModal({
          modalType: ModalType.SUCCESSFULLY,
          modalProps: {
            autoCloseDelayMs: 3000,
            type: "success",
            icon: "success-circle",
            text: "Профиль ребёнка успешно создан",
          },
        })
      );
    }
  }, [isChildSuccessfullyCreated, dispatch]);

  useEffect(() => {
    if (!isEmailChangeSuccess || flow !== "email_change") {
      return;
    }

    dispatch(clearEmailChangeSuccess());
    dispatch(
      showModal({
        modalType: ModalType.SUCCESSFULLY,
        modalProps: {
          autoCloseDelayMs: 3000,
          type: "success",
          icon: "success-circle",
          text: "Email успешно изменён.",
        },
      })
    );
  }, [isEmailChangeSuccess, flow, dispatch]);

  useEffect(() => {
    if (isVisible) {
      form.resetForm();
      dispatch(clearErrors());

      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }
  }, [isVisible, dispatch]);

  return (
    <Modal
      isClose
      isVisible={isVisible}
      isHideBg={true}
      className={classNames("modal-children modal-children--confirm", className)}
      showCloseButton={true}
    >
      <div className="modal__title">Подтверждение E-mail</div>

      <div className="modal-children__body">
        <span className="modal-children__description">
          Введите код, отправленный вам на новый E-mail. Код действителен 2 минуты.
        </span>

        <form onSubmit={form.handleSubmit}>
          <CodeInput
            name="code"
            value={form.values.code}
            error={form.errors.code}
            onChange={handleChange}
            className="modal-children__code-input"
            disabled={isBusy}
            ref={codeInputRef}
          />

          <Button
            withArrow
            type="submit"
            variant="main-green-dark"
            className="modal-children__submit"
            disabled={isBusy}
          >
            Отправить код
          </Button>

          <p className="modal-children__resend">
            Не пришел код?
            <a href="#" onClick={handleResendCode} className="modal-children__resend-link">
              Отправить код еще раз.
            </a>
          </p>
        </form>
      </div>
    </Modal>
  );
};

export default WidgetModalConfirmChildrenEmail;
