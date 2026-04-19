import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Suggest a Job Category",
  description:
    "Don't see your trade listed? Suggest a new job category for Direktory.",
};

export default function SuggestJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
