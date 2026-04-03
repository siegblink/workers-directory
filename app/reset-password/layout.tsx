import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Direktory account.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
