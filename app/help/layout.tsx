import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers to common questions and get support for using Direktory.",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
