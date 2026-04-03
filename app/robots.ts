import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://direktory.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/bookings",
        "/messages",
        "/settings",
        "/profile",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
