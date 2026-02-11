"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // days
    sameSite: "strict",
    secure: true,
  });
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
