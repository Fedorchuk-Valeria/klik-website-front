"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useRef } from "react";

import { confirmCodeValidationSchema } from "@/src/components/Login/validationSchema";
import Button from "@/src/components/ui/Button/Button";
import CodeInput from "@/src/components/ui/CodeInput";

import { RootStore } from "@/src/store";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { resendCodeRequest, verifyCodeRequest } from "@/src/store/slices/auth";
import { PAGES, QUERY_PARAMS, TOKEN_KEY } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";

const ConfirmCodeContent = () => {
  const codeInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { isCodeCorrect, isLoading, errors } = useAppSelector((state: RootStore) => state.auth);
  const form = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: confirmCodeValidationSchema,
    onSubmit: (values) => {
      const sessionToken = CookieHelper.getCookie(TOKEN_KEY);

      if (sessionToken) {
        dispatch(
          verifyCodeRequest({
            session_token: sessionToken,
            code: values.code,
          })
        );
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    void form.setFieldValue(name, value, true);
  };

  const handleResendCode = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const sessionToken = CookieHelper.getCookie(TOKEN_KEY);

    if (sessionToken) {
      dispatch(
        resendCodeRequest({
          session_token: sessionToken,
        })
      );
    }
  };

  useEffect(() => {
    if (errors) {
      form.setFieldError("code", errors.detail);
    }
  }, [errors]);

  useEffect(() => {
    if (isCodeCorrect) {
      if (searchParams.get(QUERY_PARAMS.IS_RESET_PASSWORD)) {
        router.push(PAGES.SET_NEW_PASSWORD);
      } else {
        router.push(PAGES.HOME);
      }
    }
  }, [isCodeCorrect, searchParams]);

  useEffect(() => {
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  return (
    <div className="login-page__form-content confirm-code-page">
      <p className="login-page__form-title--red">Подтверждение номера</p>

      <span className="login-page__text">Введите код из SMS. Он действителен 2 минуты.</span>

      <form className="login-page__form" onSubmit={form.handleSubmit}>
        <CodeInput
          name="code"
          value={form.values.code}
          error={form.errors.code}
          onChange={handleChange}
          className="confirm-code-page__code-input"
          disabled={isLoading}
          ref={codeInputRef}
        />

        <Button
          withArrow
          type="submit"
          variant="main-green-dark"
          className="login-page__form-button"
          disabled={isLoading}
        >
          Отправить код
        </Button>

        <p className="login-page__after-text">
          Не пришел код?
          <Link href={"#"} onClick={handleResendCode} className="login-page__form-link">
            Отправить код еще раз.
          </Link>
        </p>
      </form>
    </div>
  );
};

const ConfirmCodePage = () => (
  <Suspense
    fallback={
      <div className="login-page__form-content confirm-code-page">
        <p className="login-page__form-title--red">Подтверждение номера</p>
      </div>
    }
  >
    <ConfirmCodeContent />
  </Suspense>
);

export default ConfirmCodePage;
