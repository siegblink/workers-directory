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

  const appPages = [
    "/profile",
    "/dashboard",
    "/bookings",
    "/credits",
    "/settings",
    "/search",
    "/messages",
  ];

  // Pages that should hide only the footer (keep navigation)
  const hideFooterPages =
    appPages.includes(pathname) || pathname.startsWith("/worker/");

  return (
    <>
      {!isAuthPage && <Navigation />}
      <main>{children}</main>
      {!isAuthPage && !hideFooterPages && <Footer />}
    </>
  );
}
