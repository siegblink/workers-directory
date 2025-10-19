"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockStats = {
  totalEarnings: 12450,
  thisMonth: 3200,
  pendingBookings: 5,
  completedJobs: 342,
  averageRating: 4.8,
  totalReviews: 127,
  responseRate: 98,
  completionRate: 96,
};

const mockPendingRequests = [
  {
    id: 1,
    customer: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    service: "Kitchen Sink Repair",
    date: "Dec 22, 2024",
    time: "2:00 PM",
    duration: 2,
    location: "123 Main St, New York, NY",
    amount: 90,
    status: "pending",
  },
  {
    id: 2,
    customer: {
      name: "Robert Smith",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    service: "Bathroom Plumbing Installation",
    date: "Dec 23, 2024",
    time: "10:00 AM",
    duration: 4,
    location: "456 Oak Ave, Brooklyn, NY",
    amount: 180,
    status: "pending",
  },
];

const mockUpcomingJobs = [
  {
    id: 3,
    customer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    service: "Water Heater Repair",
    date: "Dec 20, 2024",
    time: "3:00 PM",
    duration: 3,
    location: "789 Pine St, Queens, NY",
    amount: 135,
    status: "confirmed",
  },
];

export default function WorkerDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Worker Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and track your performance
          </p>
        </div>

        {/* Promotion Banner */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-900 dark:text-yellow-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">
                    Boost Your Profile
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get featured at the top of search results and get 3x more
                    bookings
                  </p>
                </div>
              </div>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                asChild
              >
                <Link href="/dashboard/promote">Promote Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${mockStats.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +${mockStats.thisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.pendingBookings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting your response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Jobs
              </CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.completedJobs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {mockStats.averageRating}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.totalReviews} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Requests
              {mockPendingRequests.length > 0 && (
                <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                  {mockPendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Pending Requests Tab */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {mockPendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={request.customer.avatar || "/placeholder.svg"}
                            alt={request.customer.name}
                          />
                          <AvatarFallback>
                            {request.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {request.customer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.service}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            New Request
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {request.date} at {request.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{request.duration} hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {request.location}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Estimated Earnings
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            ${request.amount}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button className="bg-green-600 hover:bg-green-700">
                            Accept
                          </Button>
                          <Button variant="outline" className="bg-transparent">
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockPendingRequests.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      No Pending Requests
                    </h3>
                    <p className="text-muted-foreground">
                      You're all caught up! New booking requests will appear
                      here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Upcoming Jobs Tab */}
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {mockUpcomingJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={job.customer.avatar || "/placeholder.svg"}
                            alt={job.customer.name}
                          />
                          <AvatarFallback>
                            {job.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {job.customer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {job.service}
                          </p>
                          <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Confirmed
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {job.date} at {job.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{job.duration} hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {job.location}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Earnings
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            ${job.amount}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button variant="outline" asChild>
                            <Link href={`/bookings/${job.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            Cancel Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Response Rate
                        </span>
                        <span className="text-sm font-bold">
                          {mockStats.responseRate}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-green-600 dark:bg-green-700 h-2 rounded-full"
                          style={{ width: `${mockStats.responseRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Excellent response time
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Completion Rate
                        </span>
                        <span className="text-sm font-bold">
                          {mockStats.completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-700 h-2 rounded-full"
                          style={{ width: `${mockStats.completionRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Great job completion rate
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-4 text-foreground">
                      Recent Reviews
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          author: "Sarah M.",
                          rating: 5,
                          comment: "Excellent service! Very professional.",
                        },
                        {
                          author: "Mike R.",
                          rating: 4,
                          comment: "Good work, would hire again.",
                        },
                      ].map((review) => (
                        <div key={review.author} className="flex gap-3">
                          <Avatar>
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">
                                {review.author}
                              </span>
                              <div className="flex">
                                {Array.from({ length: review.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={`${review.author}-star-${i}`}
                                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
