import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your service bookings on Direktory.",
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
