"use client";

import { Eye, MessageSquarePlus, Star } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { useState } from "react";
import { AnonymousReviewModal } from "@/components/anonymous-review-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 20;

type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string | null | undefined;
};

type WorkerTestimonialsProps = {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  workerId: string;
  workerName: string;
};

function formatRelativeDate(dateString: string): string {
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

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="border-b last:border-0 pb-6 last:pb-0">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={review.avatar || undefined} alt={review.author} />
          <AvatarFallback>{review.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-foreground">{review.author}</p>
              <p className="text-sm text-muted-foreground">{review.date}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-foreground leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export function WorkerTestimonials({
  rating,
  reviewCount,
  reviews,
  workerId,
  workerName,
}: WorkerTestimonialsProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetReviews, setSheetReviews] = useState<Review[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetPage, setSheetPage] = useState(0);
  const [sheetHasMore, setSheetHasMore] = useState(true);

  async function loadSheetReviews(page: number) {
    setSheetLoading(true);
    const supabase = createClient();
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("ratings")
      .select(
        "id, rating_value, review_comment, created_at, customer:users(firstname, lastname, profile_pic_url)",
      )
      .eq("worker_id", workerId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data) {
      const mapped = data
        .filter((r) => r.rating_value != null && r.review_comment)
        .map((r) => {
          const customer = Array.isArray(r.customer)
            ? r.customer[0]
            : r.customer;
          const name = customer
            ? `${(customer as { firstname: string; lastname: string }).firstname} ${(customer as { firstname: string; lastname: string }).lastname[0]}.`
            : "Anonymous";
          return {
            id: r.id,
            author: name,
            rating: r.rating_value as number,
            date: formatRelativeDate(r.created_at),
            comment: r.review_comment as string,
            avatar: (customer as { profile_pic_url: string | null } | null)
              ?.profile_pic_url,
          };
        });

      setSheetReviews((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
      setSheetHasMore(data.length === PAGE_SIZE);
      setSheetPage(page);
    }

    setSheetLoading(false);
  }

  function handleOpenSheet() {
    setSheetOpen(true);
    loadSheetReviews(0);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSheetReviews([]);
      setSheetPage(0);
      setSheetHasMore(true);
    }
  }

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Testimonials
          </h3>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-foreground">{rating}</span>
            <span className="text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReviewModalOpen(true)}
          >
            <MessageSquarePlus />
            Leave a Review
          </Button>
          {reviewCount > reviews.length && (
            <Button variant="outline" size="sm" onClick={handleOpenSheet}>
              <Eye />
              View All Reviews
            </Button>
          )}
        </div>
      </CardContent>

      <AnonymousReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        workerId={workerId}
        workerName={workerName}
      />

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pr-6">
            <SheetTitle>Reviews for {workerName}</SheetTitle>
            <SheetDescription>
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-6">
            {sheetLoading && sheetReviews.length === 0 ? (
              <div className="flex justify-center py-12">
                <Spinner className="size-6" />
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {sheetReviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>

                {sheetHasMore && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSheetReviews(sheetPage + 1)}
                      disabled={sheetLoading}
                    >
                      {sheetLoading ? <Spinner /> : null}
                      Load more
                    </Button>
                  </div>
                )}

                {!sheetHasMore && sheetReviews.length > 0 && (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    All {sheetReviews.length} reviews loaded
                  </p>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
