"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Mail, Phone, Calendar, Star, Bookmark } from "lucide-react"
import Link from "next/link"

const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  joinedDate: "March 2023",
  avatar: "/placeholder.svg?height=150&width=150",
}

const mockBookings = [
  {
    id: 1,
    worker: "John Smith",
    service: "Plumbing",
    date: "Dec 15, 2024",
    status: "Completed",
    amount: 180,
  },
  {
    id: 2,
    worker: "Sarah Johnson",
    service: "Electrical",
    date: "Dec 20, 2024",
    status: "Upcoming",
    amount: 220,
  },
]

const mockBookmarked = [
  {
    id: 1,
    name: "Mike Davis",
    profession: "Cleaner",
    rating: 4.7,
    hourlyRate: 35,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Lisa Brown",
    profession: "Painter",
    rating: 4.9,
    hourlyRate: 50,
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                <AvatarFallback>
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{mockUser.name}</h1>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {mockUser.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {mockUser.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {mockUser.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Member since {mockUser.joinedDate}
                      </div>
                    </div>
                  </div>

                  <Button asChild>
                    <Link href="/settings">Edit Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="bookmarked">Saved Workers</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{booking.worker}</h3>
                          <Badge variant={booking.status === "Completed" ? "secondary" : "default"}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${booking.amount}</p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href={`/bookings/${booking.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarked Tab */}
          <TabsContent value="bookmarked">
            <Card>
              <CardHeader>
                <CardTitle>Saved Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookmarked.map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{worker.name}</h3>
                          <p className="text-sm text-muted-foreground">{worker.profession}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-foreground">{worker.rating}</span>
                            <span className="text-sm text-muted-foreground">• ${worker.hourlyRate}/hr</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/worker/${worker.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
