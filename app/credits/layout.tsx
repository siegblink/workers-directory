import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Credits & Plans",
  description: "View and purchase Direktory credits to boost your visibility and unlock premium features.",
};

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
