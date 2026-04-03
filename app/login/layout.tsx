import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Direktory account.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
