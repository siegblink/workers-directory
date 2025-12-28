"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookingModal } from "@/components/booking-modal";
import { WorkerAbout } from "@/components/worker/worker-about";
import { WorkerAvailability } from "@/components/worker/worker-availability";
import { WorkerGallery } from "@/components/worker/worker-gallery";
import { WorkerProfileHeader } from "@/components/worker/worker-profile-header";
import { WorkerTestimonials } from "@/components/worker/worker-testimonials";

const mockWorker = {
  id: 1,
  name: "John Smith",
  profession: "Plumber",
  rating: 4.8,
  reviews: 127,
  hourlyRate: 45,
  location: "Cebu City, Philippines",
  avatar: "/placeholder.svg?height=200&width=200",
  isOnline: true,
  verified: true,
  joinedDate: "January 2022",
  completedJobs: 342,
  responseTime: "Within 1 hour",
  statusEmoji: "🔧",
  statusText: "Available for emergency repairs this week",
  bio: "Professional plumber with over 15 years of experience. Specialized in residential and commercial plumbing, emergency repairs, and installations. Licensed and insured.",
  skills: [
    "Emergency Repairs",
    "Pipe Installation",
    "Drain Cleaning",
    "Water Heater",
    "Leak Detection",
  ],
  availability: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
};

const mockReviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment:
      "Excellent service! Fixed my leaking pipe quickly and professionally. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    author: "Mike R.",
    rating: 4,
    date: "1 week ago",
    comment:
      "Good work, arrived on time and got the job done. Would hire again.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    author: "Emily T.",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Very knowledgeable and explained everything clearly. Fair pricing too!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const mockPortfolio = [
  {
    id: 1,
    image: "https://picsum.photos/id/1048/800/600",
    title: "Kitchen Sink Installation",
    description:
      "Complete kitchen sink replacement including new faucet, garbage disposal, and water line connections. Modern stainless steel basin with pull-down sprayer.",
    price: 450,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1067/800/600",
    title: "Bathroom Renovation",
    description:
      "Full bathroom plumbing overhaul with new toilet installation, vanity plumbing, and shower valve replacement. Upgraded to water-efficient fixtures.",
    price: 1200,
  },
  {
    id: 3,
    image: "https://picsum.photos/id/180/800/600",
    title: "Water Heater Replacement",
    description:
      "Removed old 40-gallon tank and installed new energy-efficient tankless water heater. Includes gas line connection and venting.",
    price: 850,
  },
  {
    id: 4,
    image: "https://picsum.photos/id/139/800/600",
    title: "Pipe Repair",
    description:
      "Emergency repair of burst copper pipe in basement. Replaced damaged section and added insulation to prevent future freezing.",
  },
];

export default function WorkerProfilePage() {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <WorkerProfileHeader
          worker={mockWorker}
          isBookmarked={isBookmarked}
          onMessage={() => {
            // TODO: Implement message functionality
            console.log("Message worker:", mockWorker.id);
          }}
          onBookNow={() => setBookingModalOpen(true)}
          onBookmarkToggle={setIsBookmarked}
        />

        {/* Gallery Section */}
        <WorkerGallery
          portfolio={mockPortfolio}
          onBookNow={() => router.push(`/messages?workerId=${mockWorker.id}`)}
        />

        {/* About Section */}
        <WorkerAbout bio={mockWorker.bio} skills={mockWorker.skills} />

        {/* Testimonials Section */}
        <WorkerTestimonials
          rating={mockWorker.rating}
          reviewCount={mockWorker.reviews}
          reviews={mockReviews}
          workerId={mockWorker.id}
          workerName={mockWorker.name}
        />

        {/* Availability Section */}
        <WorkerAvailability availability={mockWorker.availability} />
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
  );
}
