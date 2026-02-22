"use client";

import { Bookmark, Star } from "lucide-react";
import Link from "next/link";
import type {
  Booking,
  BookmarkedWorker,
} from "@/components/profile/profile-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProfileBookingsPanelProps = {
  bookings: Booking[];
  bookmarkedWorkers: BookmarkedWorker[];
};

export function ProfileBookingsPanel({
  bookings,
  bookmarkedWorkers,
}: ProfileBookingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bookings">
          <div className="flex items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="saved">Saved Workers</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bookings">View all bookings</Link>
            </Button>
          </div>

          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No bookings yet.
                </p>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {booking.worker}
                        </h3>
                        <Badge
                          variant={
                            booking.status === "Completed"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.service}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">
                        ${booking.amount}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        asChild
                      >
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="space-y-4">
              {bookmarkedWorkers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved workers yet.
                </p>
              ) : (
                bookmarkedWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage
                          src={worker.avatar || "/placeholder.svg"}
                          alt={worker.name}
                        />
                        <AvatarFallback>
                          {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {worker.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {worker.profession}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-foreground">
                            {worker.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            &middot; ₱{worker.hourlyRate}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Bookmark className="fill-current" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/worker/${worker.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
