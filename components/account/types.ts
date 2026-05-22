export type Address = {
  slug: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type AccountTabId =
  | "profile"
  | "addresses"
  | "password"
  | "help"
  | "support";

export const ACCOUNT_TABS: {
  id: AccountTabId;
  label: string;
  placeholder?: boolean;
}[] = [
  { id: "profile", label: "Profile details" },
  { id: "addresses", label: "Addresses" },
  { id: "password", label: "Change password" },
  { id: "help", label: "Help?", placeholder: true },
  { id: "support", label: "Support", placeholder: true },
];

export function parseAccountTab(value: string | null): AccountTabId | null {
  if (
    value === "profile" ||
    value === "addresses" ||
    value === "password" ||
    value === "help" ||
    value === "support"
  ) {
    return value;
  }
  return null;
}
