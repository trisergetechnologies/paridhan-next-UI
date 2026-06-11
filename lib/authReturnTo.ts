const AUTH_RETURN_KEY = "paridhan_auth_return";

const isSafeReturnPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//");

/** Remember where to send the user after sign-in (survives Google OAuth redirect). */
export function saveAuthReturnTo(path: string) {
  if (typeof window === "undefined" || !isSafeReturnPath(path)) return;
  sessionStorage.setItem(AUTH_RETURN_KEY, path);
}

export function peekAuthReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(AUTH_RETURN_KEY);
  return stored && isSafeReturnPath(stored) ? stored : null;
}

export function consumeAuthReturnTo(): string | null {
  const stored = peekAuthReturnTo();
  if (stored) sessionStorage.removeItem(AUTH_RETURN_KEY);
  return stored;
}

/** Explicit returnTo → sessionStorage → current page (except OAuth callback). */
export function resolveAuthReturnTo(explicit?: string | null): string {
  if (explicit && isSafeReturnPath(explicit)) return explicit;

  const stored = peekAuthReturnTo();
  if (stored) return stored;

  if (typeof window !== "undefined") {
    const { pathname, search } = window.location;
    if (pathname && !pathname.startsWith("/auth/google/callback")) {
      return `${pathname}${search}`;
    }
  }

  return "/";
}
