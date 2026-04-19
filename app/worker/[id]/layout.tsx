import type { Metadata } from "next";
import type React from "react";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("workers_with_details")
    .select("profession, user_data")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return { title: "Worker Profile" };
  }

  const userData = data.user_data as {
    firstname?: string;
    lastname?: string;
  } | null;
  const name =
    userData?.firstname && userData?.lastname
      ? `${userData.firstname} ${userData.lastname}`
      : null;
  const profession = data.profession ?? "Service Worker";
  const title = name ? `${name} – ${profession}` : profession;

  return {
    title,
    description: `Book ${name ?? "a verified service worker"} on Direktory. ${profession} available for hire in your area.`,
    openGraph: {
      title: `${title} – Direktory`,
      description: `Book ${name ?? "a verified service worker"} on Direktory. ${profession} available for hire in your area.`,
    },
    twitter: {
      card: "summary",
      title: `${title} – Direktory`,
    },
  };
}

export default function WorkerLayout({ children }: Props) {
  return <>{children}</>;
}
