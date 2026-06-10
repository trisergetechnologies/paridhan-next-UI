"use client";

import { Button } from "@/components/ui/button";
import { startGoogleOAuth } from "@/lib/googleOAuth";

type Props = {
  returnTo?: string;
  label?: string;
};

export default function GoogleSignInButton({
  returnTo,
  label = "Continue with Google",
}: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full h-11 gap-3"
      onClick={() => startGoogleOAuth({ returnTo })}
    >
      <GoogleIcon />
      {label}
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 29.082 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.017 0 9.553-1.928 12.99-5.07l-6.007-4.568C29.083 36 24.514 32 24 32c-5.084 0-9.645 3.343-11.267 8.018l6.571 4.819C9.656 39.663 16.318 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.007 4.568C36.795 39.203 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
