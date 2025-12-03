"use client";

import {
  Bookmark,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Shield,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

interface WorkerProfileHeaderProps {
  worker: {
    id: number;
    name: string;
    profession: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    location: string;
    avatar: string;
    isOnline: boolean;
    verified: boolean;
    joinedDate: string;
    completedJobs: number;
    responseTime: string;
    statusEmoji?: string;
    statusText?: string;
  };
  isBookmarked: boolean;
  onMessage?: () => void;
  onBookNow?: () => void;
  onBookmarkToggle?: (isBookmarked: boolean) => void;
}

export function WorkerProfileHeader({
  worker,
  isBookmarked,
  onMessage,
  onBookNow,
  onBookmarkToggle,
}: WorkerProfileHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={worker.avatar || "/placeholder.svg"}
              alt={worker.name}
            />
            <AvatarFallback className="bg-blue-800 text-white text-5xl">
              {worker.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {worker.name}
                </h1>
                {(worker.statusEmoji || worker.statusText) && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {worker.statusEmoji && (
                      <span className="mr-2">{worker.statusEmoji}</span>
                    )}
                    {worker.statusText}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Pill variant={worker.isOnline ? "success" : "error"} dot>
                    {worker.isOnline ? "Online" : "Offline"}
                  </Pill>
                  {worker.verified && (
                    <Pill variant="primary">
                      <Shield />
                      Verified
                    </Pill>
                  )}
                  •
                  <span className="text-lg text-muted-foreground">
                    {worker.profession}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{worker.rating}</span>
                    <span className="text-muted-foreground">
                      ({worker.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {worker.location}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {worker.joinedDate}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full md:w-auto justify-start"
                  onClick={onMessage}
                >
                  <MessageSquare />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onBookNow}
                  className="w-full md:w-auto justify-start"
                >
                  <Calendar />
                  Book Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBookmarkToggle?.(!isBookmarked)}
                  className="w-full md:w-auto justify-start"
                >
                  <Bookmark
                    className={`${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Hourly Rate</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${worker.hourlyRate}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Jobs Completed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {worker.completedJobs}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Response Time</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {worker.responseTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
