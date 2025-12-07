"use client";

import { Bookmark, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Booking {
  id: number;
  worker: string;
  service: string;
  date: string;
  status: string;
  amount: number;
}

export interface BookmarkedWorker {
  id: number;
  name: string;
  profession: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
}

interface ProfileTabsProps {
  bookings: Booking[];
  bookmarkedWorkers: BookmarkedWorker[];
}

export function ProfileTabs({ bookings, bookmarkedWorkers }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <Card>
      <CardContent>
        {/* Tabs wrapper with controlled state */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Header with TabsList and button - now INSIDE Tabs */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="bookmarked">Saved Workers</TabsTrigger>
            </TabsList>

            {/* Conditional "View all bookings" button */}
            {activeTab === "bookings" && bookings.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full md:w-auto"
              >
                <Link href="/bookings">View all bookings</Link>
              </Button>
            )}
          </div>

          {/* Tab content */}
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

          <TabsContent value="bookmarked">
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
                            • ${worker.hourlyRate}/hr
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
