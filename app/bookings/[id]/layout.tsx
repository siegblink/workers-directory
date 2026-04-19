import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Booking Details",
  description: "View the details of your service booking on Direktory.",
};

export default function BookingDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
