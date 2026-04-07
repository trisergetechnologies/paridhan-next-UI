"use client";

import { authFetch } from "@/lib/authFetch";
import { useToast } from "./ToastContext";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================= TYPES ================= */

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "staff" | "seller";
  activeRole?: "customer" | "admin" | "staff" | "seller";
  roles?: ("customer" | "admin" | "staff" | "seller")[];
  avatar?: string;
  wishlist?: string[];
  addresses?: any[];
  isEmailVerified: boolean;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

type LoginPayload = {
  email: string;
  password: string;
  requestedRole?: "customer" | "admin" | "staff" | "seller";
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isOffline: boolean;
  authDegraded: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  signup: (payload: SignUpPayload)=> Promise<void>;
  refreshUser: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [authDegraded, setAuthDegraded] = useState(false);

  const isAuthenticated = Boolean(user);

  /* ================= INIT ================= */
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setAuthDegraded(false);
      refreshUser();
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isOffline) return;
    const timer = window.setInterval(async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        setAuthDegraded(false);
      } catch {
        setAuthDegraded(true);
      }
    }, 25 * 60 * 1000);

    return () => window.clearInterval(timer);
  }, [isAuthenticated, isOffline]);

  /* ================= LOGIN ================= */
const login = async (payload: { email: string; password: string; requestedRole?: "customer" | "admin" | "staff" | "seller" }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      requestedRole: payload.requestedRole || "customer",
    }),
  });

  const json = await res.json();

  if (!json.success) {
    showToast(json.message || "Login failed", "error");
    throw new Error(json.message || "Login failed");
  }

  setAuthDegraded(false);
  setIsOffline(false);
  await refreshUser();
};

const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!json.success) {
    showToast(json.message || "Signup failed", "error");
    throw new Error(json.message || "Signup failed");
  }

  setAuthDegraded(false);
  setIsOffline(false);
  await refreshUser();
};

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // No-op: keep local cleanup deterministic.
    }
    setUser(null);
    showToast("Logged out", "info");
    setAuthDegraded(false);
    setIsAuthLoading(false);
  };

  /* ================= FETCH PROFILE ================= */
  const refreshUser = async () => {
    try {
      setIsAuthLoading(true);

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          setAuthDegraded(false);
          return;
        }
        if (res.status >= 500 || res.status === 429) {
          setAuthDegraded(true);
          return;
        }
        throw new Error("Unexpected auth response");
      }

      const json = await res.json();
      if (json.success) {
        setUser(json.data);
        setIsOffline(false);
        setAuthDegraded(false);
      }
    } catch (error) {
      const err = error as Error & { code?: string };
      if (err.code === "NETWORK_OFFLINE") {
        setIsOffline(true);
        setAuthDegraded(true);
        return;
      }
      console.error("Auth error:", error);
      // Do not force logout on non-auth failures.
      setAuthDegraded(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  /* ================= PROVIDER ================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        isOffline,
        authDegraded,
        login,
        logout,
        signup,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
