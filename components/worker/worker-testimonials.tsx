"use client";

import { Eye, MessageSquarePlus, Star } from "lucide-react";
import { useState } from "react";
import { AnonymousReviewModal } from "@/components/anonymous-review-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

interface WorkerTestimonialsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  workerId: number;
  workerName: string;
}

export function WorkerTestimonials({
  rating,
  reviewCount,
  reviews,
  workerId,
  workerName,
}: WorkerTestimonialsProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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
            <div
              key={review.id}
              className="border-b last:border-0 pb-6 last:pb-0"
            >
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.author}
                  />
                  <AvatarFallback>{review.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={`${review.id}-star-${i}`}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement view all reviews functionality
              console.log("View all reviews:", workerId);
            }}
          >
            <Eye />
            View All Reviews
          </Button>
        </div>
      </CardContent>

      <AnonymousReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        workerId={workerId}
        workerName={workerName}
      />
    </Card>
  );
}
