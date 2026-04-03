import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your bookings, earnings, and worker profile from your Direktory dashboard.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
