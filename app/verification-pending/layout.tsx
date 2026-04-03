import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Check Your Email",
  description: "A verification email has been sent to your inbox.",
};

export default function VerificationPendingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
