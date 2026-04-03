import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Direktory account to find or offer trusted local services.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
