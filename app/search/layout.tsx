import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Find Service Workers",
  description:
    "Search for verified local service workers — plumbers, electricians, cleaners, and more.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
