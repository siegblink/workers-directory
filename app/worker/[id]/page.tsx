"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Bookmark, MessageSquare, Calendar, Shield, Clock, DollarSign } from "lucide-react"
import Image from "next/image"
import { BookingModal } from "@/components/booking-modal"

const mockWorker = {
  id: 1,
  name: "John Smith",
  profession: "Plumber",
  rating: 4.8,
  reviews: 127,
  hourlyRate: 45,
  location: "New York, NY",
  avatar: "/placeholder.svg?height=200&width=200",
  isOnline: true,
  verified: true,
  joinedDate: "January 2022",
  completedJobs: 342,
  responseTime: "Within 1 hour",
  bio: "Professional plumber with over 15 years of experience. Specialized in residential and commercial plumbing, emergency repairs, and installations. Licensed and insured.",
  skills: ["Emergency Repairs", "Pipe Installation", "Drain Cleaning", "Water Heater", "Leak Detection"],
  availability: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
}

const mockReviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent service! Fixed my leaking pipe quickly and professionally. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    author: "Mike R.",
    rating: 4,
    date: "1 week ago",
    comment: "Good work, arrived on time and got the job done. Would hire again.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    author: "Emily T.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Very knowledgeable and explained everything clearly. Fair pricing too!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockPortfolio = [
  { id: 1, image: "/plumbing-work-1.png", title: "Kitchen Sink Installation" },
  { id: 2, image: "/plumbing-work-2.png", title: "Bathroom Renovation" },
  { id: 3, image: "/plumbing-work-3.png", title: "Water Heater Replacement" },
  { id: 4, image: "/plumbing-work-4.png", title: "Pipe Repair" },
]

export default function WorkerProfilePage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={mockWorker.avatar || "/placeholder.svg"} alt={mockWorker.name} />
                  <AvatarFallback>
                    {mockWorker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {mockWorker.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{mockWorker.name}</h1>
                      {mockWorker.verified && (
                        <Badge className="bg-blue-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-3">{mockWorker.profession}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{mockWorker.rating}</span>
                        <span className="text-gray-600">({mockWorker.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {mockWorker.location}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Joined {mockWorker.joinedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="w-full md:w-auto">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full md:w-auto bg-transparent"
                      onClick={() => setBookingModalOpen(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className="w-full md:w-auto"
                    >
                      <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Hourly Rate</span>
                    </div>
                    <p className="text-2xl font-bold">${mockWorker.hourlyRate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Jobs Completed</span>
                    </div>
                    <p className="text-2xl font-bold">{mockWorker.completedJobs}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <p className="text-lg font-bold">{mockWorker.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockWorker.reviews})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About Me</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{mockWorker.bio}</p>

                <h4 className="font-semibold mb-3">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mockWorker.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{mockWorker.rating}</span>
                    <span className="text-gray-600">({mockWorker.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.author}</p>
                              <p className="text-sm text-gray-600">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Work Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockPortfolio.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white font-semibold">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Weekly Availability</h3>
                <div className="space-y-3">
                  {Object.entries(mockWorker.availability).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between py-3 border-b last:border-0">
                      <span className="font-medium capitalize">{day}</span>
                      <span className={hours === "Closed" ? "text-gray-400" : "text-gray-700"}>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        workerName={mockWorker.name}
        workerProfession={mockWorker.profession}
        hourlyRate={mockWorker.hourlyRate}
      />
    </div>
  )
}
