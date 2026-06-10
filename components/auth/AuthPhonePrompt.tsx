"use client";

import { useAuth } from "@/context/AuthContext";
import { PROMPT_PHONE_KEY } from "@/lib/authPhonePrompt";
import AddMobileModal from "./AddMobileModal";
import { useEffect } from "react";

export default function AuthPhonePrompt() {
  const {
    user,
    isAuthLoading,
    phoneModalOpen,
    openPhoneModal,
    closePhoneModal,
    updatePhone,
    savingPhone,
  } = useAuth();

  useEffect(() => {
    if (isAuthLoading || !user) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(PROMPT_PHONE_KEY) !== "1") return;
    sessionStorage.removeItem(PROMPT_PHONE_KEY);
    if (!user.phone) {
      openPhoneModal();
    }
  }, [user, isAuthLoading, openPhoneModal]);

  return (
    <AddMobileModal
      open={phoneModalOpen}
      saving={savingPhone}
      onSave={updatePhone}
      onSkip={closePhoneModal}
    />
  );
}
