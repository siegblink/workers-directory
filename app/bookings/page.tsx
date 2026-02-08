"use client";

import { Calendar, Filter, Lightbulb, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockBookings = [
  {
    id: 1,
    worker: {
      name: "John Smith",
      profession: "Plumber",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "Dec 20, 2024",
    time: "2:00 PM",
    duration: 2,
    location: "123 Main St, New York, NY",
    status: "upcoming",
    amount: 90,
    description: "Fix leaking kitchen sink",
  },
  {
    id: 2,
    worker: {
      name: "Sarah Johnson",
      profession: "Electrician",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "Dec 15, 2024",
    time: "10:00 AM",
    duration: 3,
    location: "123 Main St, New York, NY",
    status: "completed",
    amount: 165,
    description: "Install new light fixtures",
  },
  {
    id: 3,
    worker: {
      name: "Mike Davis",
      profession: "Cleaner",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "Dec 10, 2024",
    time: "9:00 AM",
    duration: 4,
    location: "123 Main St, New York, NY",
    status: "completed",
    amount: 140,
    description: "Deep cleaning of entire apartment",
  },
  {
    id: 4,
    worker: {
      name: "Lisa Brown",
      profession: "Painter",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    date: "Nov 28, 2024",
    time: "8:00 AM",
    duration: 6,
    location: "123 Main St, New York, NY",
    status: "cancelled",
    amount: 300,
    description: "Paint living room walls",
  },
];

export default function BookingsPage() {
  const router = useRouter();
  const [_filterStatus, _setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your service bookings and view history
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[45]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4 flex flex-col">
          {mockBookings.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar className="h-8 w-8" />
                </EmptyMedia>
                <EmptyTitle>No Bookings Yet</EmptyTitle>
                <EmptyDescription>
                  You haven't made any bookings. Browse our directory to find
                  service workers, or suggest new job categories you'd like to
                  see.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/search")}
                >
                  <Search />
                  Browse Workers
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/suggest-jobs")}
                >
                  <Lightbulb />
                  Suggest Jobs
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            mockBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow min-h-48.5"
              >
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Worker Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={booking.worker.avatar || "/placeholder.svg"}
                          alt={booking.worker.name}
                        />
                        <AvatarFallback>
                          {booking.worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {booking.worker.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.worker.profession}
                        </p>
                        <Badge
                          className={`mt-2 ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-2 flex-1">
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex gap-4">
                          <p className="font-medium text-foreground">
                            {booking.date}
                          </p>
                          <p className="text-muted-foreground">
                            {booking.time} • {booking.duration} hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">
                          {booking.location}
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <p className="text-muted-foreground">
                          {booking.description}
                        </p>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col items-end justify-between gap-4 flex-1">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          ${booking.amount}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {booking.status === "upcoming" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button size="sm">Leave Review</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
