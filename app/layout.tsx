import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import type React from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/components/conditional-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { AnnouncementProvider } from "@/contexts/announcement-context";
import { SubProfileProvider } from "@/contexts/sub-profile-context";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

// Initialize fonts
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Direktory - Home",
  description:
    "Find trusted service workers in your area. Connect with verified plumbers, electricians, cleaners, and more",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialDismissed =
    cookieStore.get("announcements-dismissed")?.value === "true";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnnouncementProvider initialDismissed={initialDismissed}>
            <SubProfileProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <ConditionalLayout>{children}</ConditionalLayout>
              </Suspense>
            </SubProfileProvider>
          </AnnouncementProvider>
          <Analytics />
          <Toaster position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
