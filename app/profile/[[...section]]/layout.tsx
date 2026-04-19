import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your public Direktory service worker profile.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
