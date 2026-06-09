/* eslint-disable import/no-anonymous-default-export */

type CookieOptions = {
  domain?: string;
  expires?: Date | number | string;
  path?: string;
  samesite?: boolean;
  secure?: boolean;
};

function getCookie(name: string, cookieString?: string) {
  if (typeof document === "undefined" && !cookieString) return undefined;

  const matches = (cookieString || document?.cookie).match(
    new RegExp(`(?:^|; )${name.replace(/([\\.$?*|{}()[]\\\/\+^])/g, "\\$1")}=([^;]*)`)
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const newOptions = {
    ...options,
  };

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const optionKey in newOptions) {
    updatedCookie += `; ${optionKey}`;
    const optionValue = newOptions[optionKey as keyof CookieOptions];

    if (optionValue !== true) {
      updatedCookie += `=${optionValue}`;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name: string, options: CookieOptions = {}) {
  setCookie(name, "", {
    path: "/",
    expires: new Date(0).toUTCString(),
    ...options,
  });
}

export default {
  getCookie,
  setCookie,
  deleteCookie,
};
