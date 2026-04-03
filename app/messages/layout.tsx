import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Messages",
  description: "Chat with service workers and customers on Direktory.",
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
