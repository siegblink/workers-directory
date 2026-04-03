import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Become a Service Worker",
  description: "Join Direktory as a verified service worker and connect with customers in your area.",
};

export default function BecomeWorkerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
