import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Edit Gallery",
  description: "Add and manage portfolio photos on your Direktory worker profile.",
};

export default function GalleryEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
