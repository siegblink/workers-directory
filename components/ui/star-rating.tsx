import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number | null | undefined;
  fallback?: string;
  className?: string;
};

export function StarRating({ rating, fallback = "—", className }: StarRatingProps) {
  if (!rating) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        {fallback}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-medium tabular-nums">{rating}</span>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    </span>
  );
}
