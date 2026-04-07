import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts",
  description: "Manage your account of Paridhan Emporium",
};

/** Nested layout only — root `app/layout.tsx` owns `<html>` / `<body>`. */
export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
