import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Direktory account password.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
