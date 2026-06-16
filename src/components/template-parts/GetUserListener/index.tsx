"use client";

import { useAppDispatch } from "@/src/store/hooks";
import { profileRequest } from "@/src/store/slices/auth";
import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";
import { getStorageItem } from "@/src/utils/helpers/localStorage";
import { useEffect } from "react";

const GetUserListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = getStorageItem(USER);

    if (
      !user &&
      !!CookieHelper.getCookie(TOKEN_KEY) &&
      !!CookieHelper.getCookie(REFRESH_TOKEN_KEY)
    ) {
      dispatch(profileRequest());
    }
  }, []);

  return null;
};

export default GetUserListener;
