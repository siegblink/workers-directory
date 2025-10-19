"use client";

import {
  Bookmark,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

const mockWorkers = [
  {
    id: 1,
    name: "John Smith",
    profession: "Plumber",
    rating: 4.8,
    reviews: 127,
    hourlyRate: 45,
    location: "New York, NY",
    distance: "2.3 miles",
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: true,
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    profession: "Electrician",
    rating: 4.9,
    reviews: 203,
    hourlyRate: 55,
    location: "Brooklyn, NY",
    distance: "3.1 miles",
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: false,
    verified: true,
  },
  {
    id: 3,
    name: "Mike Davis",
    profession: "Cleaner",
    rating: 4.7,
    reviews: 89,
    hourlyRate: 35,
    location: "Queens, NY",
    distance: "4.5 miles",
    avatar: "/placeholder.svg?height=100&width=100",
    isOnline: true,
    verified: false,
  },
];

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 px-3 border border-border rounded-lg">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="What service do you need?"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 border border-border rounded-lg">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Your location"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-32">
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Filters
              </h3>

              <div className="space-y-6">
                {/* Service Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Service Type
                  </Label>
                  <div className="space-y-2">
                    {[
                      "Plumbing",
                      "Electrical",
                      "Cleaning",
                      "Painting",
                      "Carpentry",
                    ].map((service) => (
                      <div key={service} className="flex items-center gap-2">
                        <Checkbox id={service} />
                        <Label
                          htmlFor={service}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Minimum Rating
                  </Label>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <Checkbox id={`rating-${rating}`} />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="text-sm font-normal cursor-pointer flex items-center gap-1"
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {rating}+ stars
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Availability
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="online" />
                      <Label
                        htmlFor="online"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Online Now
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="verified" />
                      <Label
                        htmlFor="verified"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Verified Only
                      </Label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Same filter content as desktop */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Service Type
                    </Label>
                    <div className="space-y-2">
                      {[
                        "Plumbing",
                        "Electrical",
                        "Cleaning",
                        "Painting",
                        "Carpentry",
                      ].map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Checkbox id={`mobile-${service}`} />
                          <Label
                            htmlFor={`mobile-${service}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Available Workers
                </h2>
                <p className="text-muted-foreground mt-1">
                  Found {mockWorkers.length} workers near you
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {/* Worker Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockWorkers.map((worker) => (
                <Card
                  key={worker.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
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
                        {worker.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/worker/${worker.id}`}
                              className="font-semibold text-lg text-foreground hover:text-primary"
                            >
                              {worker.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {worker.profession}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Bookmark className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{worker.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({worker.reviews} reviews)
                          </span>
                          {worker.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {worker.location} • {worker.distance}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-2xl font-bold text-foreground">
                              ${worker.hourlyRate}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /hour
                            </span>
                          </div>
                          <Button asChild>
                            <Link href={`/worker/${worker.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
