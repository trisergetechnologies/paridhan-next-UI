"use client";

import { getToken, removeToken, setToken } from "@/lib/tokenHelper";
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
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  signup: (payload: SignUpPayload)=> Promise<void>;
  refreshUser: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  /* ================= INIT ================= */
  useEffect(() => {
    const token = getToken();
    if (token) {
      refreshUser();
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  /* ================= LOGIN ================= */
const login = async (payload: { email: string; password: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Login failed");
  }

  setToken(json.data.token);
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Signup failed");
  }

  setToken(json.data.token);
  await refreshUser();
};

  /* ================= LOGOUT ================= */
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthLoading(false);
  };

  /* ================= FETCH PROFILE ================= */
  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        logout();
        return;
      }

      setIsAuthLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Authentication failed");
      }

      setUser(json.data);
    } catch (error) {
      console.error("Auth error:", error);
      logout();
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
