"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const params = useParams();
  const workerId = params.id as string;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [worker, setWorker] = useState(mockWorker);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch worker data from API
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        console.log("[Worker Profile] Fetching worker data for ID:", workerId);
        const response = await fetch(`/api/workers/${workerId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("[Worker Profile] Worker data:", data);

          // Update worker state with fetched data
          setWorker({
            id: data.worker.id,
            name: data.worker.name,
            profession: data.worker.profession,
            rating: data.worker.rating,
            reviews: data.worker.reviews,
            hourlyRate: data.worker.hourlyRateMin,
            location: data.worker.location,
            avatar: data.worker.avatar,
            isOnline: true, // TODO: Implement online status
            verified: data.worker.verified,
            joinedDate: mockWorker.joinedDate, // TODO: Calculate from created_at
            completedJobs: data.worker.completedJobs,
            responseTime: data.worker.responseTime,
            statusEmoji: mockWorker.statusEmoji, // TODO: Add to database
            statusText: mockWorker.statusText, // TODO: Add to database
            bio: data.worker.bio,
            skills: data.worker.skills,
            availability: mockWorker.availability, // TODO: Implement availability
          });
        } else {
          console.error("[Worker Profile] Failed to fetch worker data");
        }
      } catch (error) {
        console.error("[Worker Profile] Error fetching worker:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (workerId) {
      fetchWorker();
    }
  }, [workerId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading worker profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <WorkerProfileHeader
          worker={worker}
          isBookmarked={isBookmarked}
          onMessage={() => {
            // TODO: Implement message functionality
            console.log("Message worker:", worker.id);
          }}
          onBookNow={() => setBookingModalOpen(true)}
          onBookmarkToggle={setIsBookmarked}
        />

        {/* Gallery Section */}
        <WorkerGallery
          portfolio={mockPortfolio}
          onBookNow={() => router.push(`/messages?workerId=${worker.id}`)}
        />

        {/* About Section */}
        <WorkerAbout bio={worker.bio} skills={worker.skills} />

        {/* Testimonials Section */}
        <WorkerTestimonials
          rating={worker.rating}
          reviewCount={worker.reviews}
          reviews={mockReviews}
          workerId={worker.id}
          workerName={worker.name}
        />

        {/* Availability Section */}
        <WorkerAvailability availability={worker.availability} />
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        workerName={worker.name}
        workerProfession={worker.profession}
        hourlyRate={worker.hourlyRate}
      />
    </div>
  );
}
