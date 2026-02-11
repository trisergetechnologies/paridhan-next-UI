export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: "email" | "google";
}

/* -----------------------
   PAYLOADS
------------------------ */
export interface LoginPayload {
  email: string;
  password?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

/* -----------------------
   CONTEXT TYPE
------------------------ */
export interface AuthContextType {
  /* auth state */
  user: AuthUser | null;
  isAuthenticated: boolean;

  /* auth actions */
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;

  /* auth modal ui */
  authOpen: boolean;
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
  openAuth: (mode?: "signin" | "signup") => void;
  closeAuth: () => void;
}
