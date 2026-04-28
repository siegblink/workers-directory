import { cache } from "react";
import type { Metadata } from "next";
import type React from "react";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

type WorkerSeoRow = {
  profession: string | null;
  location: string | null;
  average_rating: string | null;
  review_count: string | null;
  jobs_completed: number | null;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  user_data: {
    firstname?: string;
    lastname?: string;
    profile_pic_url?: string | null;
    city?: string | null;
    state?: string | null;
    bio?: string | null;
  } | null;
};

type ReviewRow = {
  rating_value: number | null;
  review_comment: string | null;
  created_at: string;
  customer:
    | { firstname: string; lastname: string }
    | { firstname: string; lastname: string }[]
    | null;
};

const fetchWorkerSeoData = cache(
  async (id: string): Promise<WorkerSeoRow | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workers_with_details")
      .select(
        "profession, location, average_rating, review_count, jobs_completed, hourly_rate_min, hourly_rate_max, user_data",
      )
      .eq("id", id)
      .maybeSingle();
    return data as WorkerSeoRow | null;
  },
);

async function fetchTopReviews(id: string): Promise<ReviewRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ratings")
    .select(
      "rating_value, review_comment, created_at, customer:users(firstname, lastname)",
    )
    .eq("worker_id", id)
    .not("review_comment", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);
  return (data as ReviewRow[]) ?? [];
}

function buildPriceRange(
  min: number | null,
  max: number | null,
): string | undefined {
  if (!min) return undefined;
  if (!max || max === min) return `₱${min}/hr`;
  return `₱${min}–₱${max}/hr`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchWorkerSeoData(id);

  if (!data) {
    return { title: "Worker Profile" };
  }

  const ud = data.user_data;
  const name =
    ud?.firstname && ud?.lastname ? `${ud.firstname} ${ud.lastname}` : null;
  const profession = data.profession ?? "Service Worker";
  const title = name ? `${name} – ${profession}` : profession;

  const location =
    data.location ??
    (ud ? [ud.city, ud.state].filter(Boolean).join(", ") || null : null);
  const rating = parseFloat(data.average_rating ?? "0") || 0;
  const reviewCount = parseInt(data.review_count ?? "0", 10) || 0;
  const jobsDone = data.jobs_completed ?? 0;

  const bookingClause = `Book ${name ?? "a verified service worker"}, a ${profession}${location ? ` in ${location}` : ""}, on Direktory.`;
  const statsClause = [
    jobsDone > 0 ? `${jobsDone} jobs completed` : null,
    rating > 0 && reviewCount > 0
      ? `★ ${rating.toFixed(1)}/5 (${reviewCount} review${reviewCount !== 1 ? "s" : ""})`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const description = statsClause
    ? `${bookingClause} ${statsClause}.`
    : bookingClause;

  return {
    title,
    description,
    openGraph: {
      title: `${title} – Direktory`,
      description,
      images: ud?.profile_pic_url ? [ud.profile_pic_url] : undefined,
    },
    twitter: {
      card: "summary",
      title: `${title} – Direktory`,
      description,
    },
  };
}

export default async function WorkerLayout({ children, params }: Props) {
  const { id } = await params;

  const [data, reviews] = await Promise.all([
    fetchWorkerSeoData(id),
    fetchTopReviews(id),
  ]);

  if (!data) {
    return <>{children}</>;
  }

  const ud = data.user_data;
  const name =
    ud?.firstname && ud?.lastname ? `${ud.firstname} ${ud.lastname}` : null;
  const profession = data.profession ?? "Service Worker";
  const rating = parseFloat(data.average_rating ?? "0") || 0;
  const reviewCount = parseInt(data.review_count ?? "0", 10) || 0;
  const location =
    data.location ??
    (ud ? [ud.city, ud.state].filter(Boolean).join(", ") || null : null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://direktory.com";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name ? `${name} – ${profession}` : profession,
    description:
      ud?.bio ??
      `${name ?? "Service worker"} is a verified ${profession}${location ? ` in ${location}` : ""} available for hire on Direktory.`,
    image: ud?.profile_pic_url ?? undefined,
    url: `${siteUrl}/worker/${id}`,
    priceRange: buildPriceRange(data.hourly_rate_min, data.hourly_rate_max),
    address: {
      "@type": "PostalAddress",
      addressLocality:
        ud?.city ?? (location ? location.split(",")[0].trim() : undefined),
      addressRegion: ud?.state ?? undefined,
      addressCountry: "PH",
    },
  };

  if (rating > 0 && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (reviews.length > 0) {
    jsonLd.review = reviews.map((r) => {
      const customer = Array.isArray(r.customer) ? r.customer[0] : r.customer;
      const authorName = customer
        ? `${customer.firstname} ${customer.lastname[0]}.`
        : "Anonymous";
      return {
        "@type": "Review",
        author: { "@type": "Person", name: authorName },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating_value ?? 5),
          bestRating: "5",
          worstRating: "1",
        },
        reviewBody: r.review_comment ?? undefined,
        datePublished: r.created_at.split("T")[0],
      };
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
