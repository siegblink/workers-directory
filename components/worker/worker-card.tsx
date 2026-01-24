"use client";

import {
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface Worker {
  id: string;
  workerId?: string; // User ID who owns this worker profile
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  hourlyRateMin: number;
  hourlyRateMax: number;
  location: string;
  distance: string;
  distanceValue?: number; // Distance in km (numeric value)
  avatar: string;
  isOnline: boolean;
  verified: boolean;
  yearsExperience: number;
  jobsCompleted: number;
  responseTime: number;
  isSaved?: boolean; // Whether the worker is saved by the current user
  isOwner?: boolean; // Whether the current user owns this worker profile
}

interface WorkerCardProps {
  worker: Worker;
  onMessage?: (workerId: string) => void;
  onBook?: (workerId: string) => void;
  onSave?: (workerId: string, isSaved: boolean) => void;
}

export function WorkerCard({
  worker,
  onMessage,
  onBook,
  onSave,
}: WorkerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border">
      <CardContent>
        <div className="flex gap-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center border-1 border-border rounded-xl h-fit">
            <Avatar className="w-20 h-20">
              <AvatarImage src={worker.avatar} alt={worker.name} />
              <AvatarFallback>
                {worker.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`text-xs font-medium flex items-center gap-1 px-2 py-1 w-full rounded-b-xl ${
                worker.isOnline
                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                  : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
              }`}
            >
              <span className="text-base leading-none">●</span>
              <span>{worker.isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Link
                    href={`/worker/${worker.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {worker.name}
                  </Link>
                  {worker.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {worker.profession}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ₱{worker.hourlyRateMin} - ₱{worker.hourlyRateMax}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">
                  {(Math.floor(worker.rating * 100) / 100).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({worker.reviews})
                </span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{worker.jobsCompleted} jobs</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{worker.yearsExperience} yrs exp.</span>
              </div>
            </div>

            {/* Location & Status */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {worker.location} • {worker.distance}
                </span>
              </div>
              {worker.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                ~{worker.responseTime} min response
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 sm:flex-none">
                <Link href={worker.isOwner ? "/profile" : `/worker/${worker.id}`}>
                  View Profile
                </Link>
              </Button>
              {!worker.isOwner && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => onMessage?.(worker.id)}
                  >
                    <MessageSquare />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBook?.(worker.id)}
                  >
                    <Calendar />
                    Book
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSave?.(worker.id, worker.isSaved || false)}
                  >
                    <Bookmark className={worker.isSaved ? "fill-current" : ""} />
                    {worker.isSaved ? "Saved" : "Save"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
