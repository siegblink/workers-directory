// ─── Date / time ─────────────────────────────────────────────────────────────

export function formatBookingDate(dateString: string | null): string {
  if (!dateString) return "Date TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatBookingTime(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatJoinedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatLongDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMessageTime(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Relative time ───────────────────────────────────────────────────────────

/** Compact relative time: "Just now", "5m ago", "2h ago", "3d ago" */
export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/** Verbose relative time: "Today", "Yesterday", "3 days ago", "2 weeks ago" */
export function formatRelativeDate(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

// ─── Domain-specific ─────────────────────────────────────────────────────────

export function formatBudget(min: number | null, max: number | null): string {
  if (!min && !max) return "Budget open";
  if (min && max) return `₱${min.toLocaleString()} – ₱${max.toLocaleString()}`;
  if (min) return `From ₱${min.toLocaleString()}`;
  return `Up to ₱${max!.toLocaleString()}`;
}

export function formatResponseTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60) return `Within ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  return `Within ${hours} hour${hours > 1 ? "s" : ""}`;
}
