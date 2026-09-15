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
import {
  clearVerifyPhoneResponse,
  resendCodeRequest,
  verifyCodeRequest,
} from "@/src/store/slices/auth";

import { PAGES, PENDING_ADMIN_REVIEW_STATUS, QUERY_PARAMS, TOKEN_KEY } from "@/src/utils/constant";
import { AuthRedirectHelper, CookieHelper } from "@/src/utils/helpers";

const ConfirmCodeContent = () => {
  const codeInputRef = useRef<HTMLInputElement>(null);
  const hasRedirectedRef = useRef(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { isCodeCorrect, isLoading, errors, isLoggedIn, verifyPhoneResponse } = useAppSelector(
    (state: RootStore) => state.auth
  );
  const form = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: confirmCodeValidationSchema,
    onSubmit: (values) => {
      const sessionToken = CookieHelper.getCookie(TOKEN_KEY);

      console.log("sessionToken=", sessionToken);

      console.log("ALL cookies:", document.cookie);

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
    void form.setFieldValue(name, value);
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
    if (!isCodeCorrect || hasRedirectedRef.current) {
      return;
    }

    if (searchParams.get(QUERY_PARAMS.IS_RESET_PASSWORD)) {
      hasRedirectedRef.current = true;
      router.push(PAGES.SET_NEW_PASSWORD);
      return;
    }

    if (verifyPhoneResponse?.status === PENDING_ADMIN_REVIEW_STATUS) {
      hasRedirectedRef.current = true;
      CookieHelper.deleteCookie(TOKEN_KEY, { path: "/" });
      dispatch(clearVerifyPhoneResponse());
      router.push(PAGES.LOGIN);
      return;
    }

    if (!isLoggedIn) {
      console.log("!isLoggedIn");
      //CookieHelper.deleteCookie(TOKEN_KEY, { path: "/" });
      //return;
    }

    hasRedirectedRef.current = true;
    dispatch(clearVerifyPhoneResponse());

    const returnTo = AuthRedirectHelper.consumeAuthReturnTo();
    router.push(returnTo ?? PAGES.COURSES);
  }, [dispatch, isCodeCorrect, isLoggedIn, router, searchParams, verifyPhoneResponse]);

  useEffect(() => {
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  return (
    <div className="login-page__form-content confirm-code-page">
      <p className="login-page__form-title--red">Подтверждение номера</p>

      <span className="login-page__text">
        Введите код, отправленный вам на E-mail, указанный при регистрации. Код действителен 2
        минуты.
      </span>

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
