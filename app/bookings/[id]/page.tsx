"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, MessageSquare, ArrowLeft, CheckCircle2, Circle, Star } from "lucide-react"

const mockBooking = {
  id: 1,
  worker: {
    name: "John Smith",
    profession: "Plumber",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  date: "Dec 20, 2024",
  time: "2:00 PM",
  duration: 2,
  location: "123 Main St, New York, NY 10001",
  status: "completed",
  amount: 90,
  description: "Fix leaking kitchen sink and check water pressure",
  timeline: [
    { status: "Booking Confirmed", date: "Dec 18, 2024 - 3:30 PM", completed: true },
    { status: "Worker En Route", date: "Dec 20, 2024 - 1:45 PM", completed: true },
    { status: "Service Started", date: "Dec 20, 2024 - 2:00 PM", completed: true },
    { status: "Service Completed", date: "Dec 20, 2024 - 4:00 PM", completed: true },
    { status: "Payment Processed", date: "Dec 20, 2024 - 4:05 PM", completed: true },
  ],
}

export default function BookingDetailPage() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleSubmitReview = () => {
    // Handle review submission
    setReviewModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking ID: #{mockBooking.id}</p>
          </div>
          <Badge
            className={mockBooking.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}
          >
            {mockBooking.status.charAt(0).toUpperCase() + mockBooking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Worker Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mockBooking.worker.avatar || "/placeholder.svg"} alt={mockBooking.worker.name} />
                    <AvatarFallback>
                      {mockBooking.worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{mockBooking.worker.name}</h3>
                    <p className="text-gray-600">{mockBooking.worker.profession}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/worker/${mockBooking.id}`}>View Profile</Link>
                  </Button>
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-gray-600">
                    {mockBooking.date} at {mockBooking.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-gray-600">{mockBooking.duration} hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Service Location</p>
                  <p className="text-gray-600">{mockBooking.location}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Job Description</p>
                <p className="text-gray-600 leading-relaxed">{mockBooking.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBooking.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                      {index < mockBooking.timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${item.completed ? "bg-green-600" : "bg-gray-300"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee ({mockBooking.duration} hours)</span>
                <span className="font-medium">${mockBooking.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium">$0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Paid</span>
                <span className="font-bold text-blue-600">${mockBooking.amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {mockBooking.status === "completed" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">How was your experience?</h3>
                    <p className="text-sm text-gray-600">Leave a review to help other customers</p>
                  </div>
                  <Button onClick={() => setReviewModalOpen(true)}>Leave Review</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>Share your experience with {mockBooking.worker.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setReviewModalOpen(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} className="flex-1" disabled={rating === 0 || !reviewText.trim()}>
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
