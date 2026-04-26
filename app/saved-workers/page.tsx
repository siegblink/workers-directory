"use client";

import { Bookmark, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
  getSavedWorkersWithDetails,
  toggleSavedWorker,
} from "@/lib/database/queries/saved-workers";

type SavedWorker = {
  id: string;
  name: string;
  profession: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
};

export default function SavedWorkersPage() {
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<SavedWorker[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getSavedWorkersWithDetails();
      setWorkers(data as SavedWorker[]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleUnsave(workerId: string) {
    await toggleSavedWorker(workerId);
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Saved Workers
          </h1>
          <p className="text-muted-foreground">
            Workers you&apos;ve bookmarked for quick access
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : workers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bookmark />
              </EmptyMedia>
              <EmptyTitle>No Saved Workers</EmptyTitle>
              <EmptyDescription>
                Save workers you&apos;d like to book again and they&apos;ll
                appear here for quick access.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex justify-center">
              <Button size="sm" asChild>
                <Link href="/search">
                  <Search />
                  Browse Workers
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-4">
            {workers.map((worker) => (
              <Card key={worker.id}>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={worker.avatar || undefined}
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
                        <h3 className="font-semibold text-lg text-foreground">
                          {worker.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {worker.profession}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-foreground">
                            {worker.rating || "—"}
                          </span>
                          {worker.hourlyRate > 0 && (
                            <span className="text-sm text-muted-foreground">
                              &middot; ₱{worker.hourlyRate}/hr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleUnsave(worker.id)}
                      >
                        <Bookmark className="fill-current" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/worker/${worker.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
