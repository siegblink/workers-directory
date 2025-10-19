"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navigation and Footer on authentication pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return (
    <>
      {!isAuthPage && <Navigation />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
