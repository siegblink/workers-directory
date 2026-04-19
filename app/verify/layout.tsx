import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Verify your email address to activate your Direktory account.",
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
