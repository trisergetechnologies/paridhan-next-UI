"use client";

import { getBrowserApiBase } from "./publicApiBase";

let refreshPromise: Promise<boolean> | null = null;

const isNetworkError = (error: unknown) =>
  error instanceof TypeError || (error instanceof Error && /network|failed to fetch/i.test(error.message));

const doRefresh = async (): Promise<boolean> => {
  try {
    const base = getBrowserApiBase();
    if (!base) return false;
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
};

const queueRefresh = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  canRetry = true
): Promise<Response> => {
  try {
    const res = await fetch(input, {
      ...init,
      credentials: "include",
    });

    if (res.status !== 401 || !canRetry) return res;

    const refreshed = await queueRefresh();
    if (!refreshed) return res;

    return fetch(input, {
      ...init,
      credentials: "include",
    });
  } catch (error) {
    if (isNetworkError(error)) {
      const offlineErr = new Error("NETWORK_OFFLINE");
      (offlineErr as Error & { code?: string }).code = "NETWORK_OFFLINE";
      throw offlineErr;
    }
    throw error;
  }
};
