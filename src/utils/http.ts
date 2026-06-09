import Axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from "axios";

import { API_URL, PAGES, REFRESH_TOKEN_KEY, TOKEN_KEY } from "@/src/utils/constant";
import { CookieHelper } from "@/src/utils/helpers";
import { HttpStatus } from "../entities/common";

interface CustomAxiosConfig extends AxiosRequestConfig {
  skipRedirects?: boolean;
}

const defaultConfig = {
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

const http = Axios.create(defaultConfig);
const refreshTokenService = Axios.create(defaultConfig);
http.interceptors.request.use((config) => {
  const token = CookieHelper.getCookie(TOKEN_KEY);

  if (token && config.headers) {
    config.headers.set?.("Authorization", normalizeToken(token));
  }

  return config;
});

let refreshTokenPromise: Promise<unknown>;
let isRefreshFinished = true;

export function normalizeToken(token = ""): string {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

export function normalizeRequestPath(url: string | undefined): string {
  let path = url?.split("?")?.[0] ?? "";

  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path;
}

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error: AxiosError<unknown>) => {
    if (error.response?.status === HttpStatus.Unauthorized) {
      if (CookieHelper.getCookie(REFRESH_TOKEN_KEY)) {
        const originalRequest = error.config;

        if (isRefreshFinished) {
          isRefreshFinished = false;

          refreshTokenPromise = refreshTokenService({
            method: "POST",
            url: "/users/refresh/",
            headers: {
              ...defaultConfig.headers,
              "Content-Type": "application/json",
            },
            data: {
              refresh: CookieHelper.getCookie(REFRESH_TOKEN_KEY),
            },
          })
            .then((response: { data: { access: string } }) => {
              isRefreshFinished = true;

              CookieHelper.setCookie(TOKEN_KEY, response.data.access, {
                path: "/",
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              });

              (originalRequest?.headers as AxiosRequestHeaders).Authorization =
                `Bearer ${response.data.access}`;

              return http(originalRequest as AxiosRequestConfig);
            })
            .catch((err: AxiosError<unknown>) => {
              isRefreshFinished = true;

              if (err.response?.status === HttpStatus.Unauthorized) {
                window.location.href = PAGES.HOME;
              } else {
                throw err;
              }
            });

          return refreshTokenPromise;
        }

        return refreshTokenPromise.then(() => {
          return http(originalRequest as AxiosRequestConfig);
        });
      }
      if (error.response?.status === HttpStatus.Unauthorized) {
        window.location.href = PAGES.HOME;

        return Promise.reject();
      }
    } else if (error.response?.status === HttpStatus.Forbidden) {
      window.location.href = PAGES.HOME;
    } else if (error.response?.status === HttpStatus.NotFound) {
      window.location.replace(PAGES.NOT_FOUND);
    } else if (
      error.response?.status === HttpStatus.ManyRequests ||
      error.response?.status === HttpStatus.InternalServerError ||
      error.response?.status === HttpStatus.LargeRequest
    ) {
      if (error.response?.status === HttpStatus.InternalServerError) {
        (error.response.data as { message: string }).message = "Error 500";
      }

      return Promise.reject(error.response?.data as string);
    } else if (error.response?.status === HttpStatus.UnprocessableEntity) {
      return error.response?.data;
    }

    return Promise.reject(error?.response?.data);
  }
);

function GET(url: string, config: CustomAxiosConfig = {}) {
  return http.get(url, {
    ...config,
    headers: {
      ...config?.headers,
    },
  });
}

function POST<T>(url: string, body?: T, config: CustomAxiosConfig = {}) {
  return http.post(url, body, {
    ...config,
    headers: {
      ...config?.headers,
    },
  });
}

function PUT<T>(url: string, body: T, config: CustomAxiosConfig = {}) {
  return http.put(url, body, {
    ...config,
    headers: {
      ...config?.headers,
    },
  });
}

function PATCH<T>(url: string, body: T, config: CustomAxiosConfig = {}) {
  return http.patch(url, body, {
    ...config,
    headers: {
      ...config?.headers,
    },
  });
}

function DELETE(url: string, config: CustomAxiosConfig = {}) {
  return http.delete(url, {
    ...config,
    headers: {
      ...config?.headers,
    },
  });
}

export { DELETE, GET, PATCH, POST, PUT };

export default http;
