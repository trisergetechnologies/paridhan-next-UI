import GoogleOAuthCallbackContent from "./GoogleOAuthCallbackContent";
import { Suspense } from "react";

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground text-center">Completing Google sign-in...</p>
        </div>
      }
    >
      <GoogleOAuthCallbackContent />
    </Suspense>
  );
}
