"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
};

type ProfileTestimonialsProps = {
  rating: number;
  reviewCount: number;
  reviews: Review[];
};

export function ProfileTestimonials({
  rating,
  reviewCount,
  reviews,
}: ProfileTestimonialsProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Testimonials
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-foreground">
                {rating}
              </span>
              <span className="text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            </div>
            {reviewCount > reviews.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Implement view all reviews functionality
                  console.log("View all reviews");
                }}
              >
                View all reviews
              </Button>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Complete some jobs to get your first review!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border last:border-0 pb-6 last:pb-0"
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
                    <p className="text-foreground leading-relaxed line-clamp-1">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
