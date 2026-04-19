import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Promote Your Profile",
  description:
    "Boost your Direktory visibility and attract more customers with promotion options.",
};

export default function PromoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
