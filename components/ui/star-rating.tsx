import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-medium tabular-nums">{rating}</span>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    </span>
  );
}
