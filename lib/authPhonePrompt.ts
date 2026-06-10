export const PROMPT_PHONE_KEY = "paridhan_prompt_phone";

export function markPhonePromptAfterAuth() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROMPT_PHONE_KEY, "1");
}

export function userNeedsPhone(phone?: string | null) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length !== 10;
}
