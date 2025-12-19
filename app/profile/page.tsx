"use client";

import { useEffect, useState } from "react";
import { ProfileAbout } from "@/components/profile/profile-about";
import { ProfileAvailability } from "@/components/profile/profile-availability";
import {
  type PortfolioItem,
  ProfileGallery,
} from "@/components/profile/profile-gallery";
import {
  type ProfileData,
  ProfileHeader,
} from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import {
  ProfileTestimonials,
  type Review,
} from "@/components/profile/profile-testimonials";
import type {
  ProfileAboutFormValues,
  ProfileAvailabilityFormValues,
  ProfileHeaderFormValues,
} from "@/lib/schemas/profile";

const mockProfile: ProfileData = {
  name: "Jane Doe",
  username: "janedoe",
  avatar: "/placeholder.svg?height=150&width=150",
  statusEmoji: "✨",
  statusText: "Available for new projects",
  profession: "Home Services",
  isOnline: true,
  verified: true,
  rating: 4.8,
  reviews: 23,
  location: "New York, NY",
  joinedDate: "March 2023",
  hourlyRate: 50,
  completedJobs: 45,
  responseTime: "Within 2 hours",
};

const mockBio =
  "Experienced home services professional with over 5 years of experience. Specialized in residential cleaning, organization, and home maintenance. Reliable, thorough, and always on time.";

const mockSkills = [
  "Deep Cleaning",
  "Organization",
  "Home Maintenance",
  "Move-in/Move-out",
  "Laundry Services",
];

const mockAvailability = {
  monday: "9:00 AM - 6:00 PM",
  tuesday: "9:00 AM - 6:00 PM",
  wednesday: "9:00 AM - 6:00 PM",
  thursday: "9:00 AM - 6:00 PM",
  friday: "9:00 AM - 5:00 PM",
  saturday: "10:00 AM - 3:00 PM",
  sunday: "Closed",
};

const mockPortfolio: PortfolioItem[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/1048/800/600",
    title: "Kitchen Deep Clean",
    description:
      "Complete kitchen cleaning including appliances, cabinets, and floor. All surfaces sanitized and organized.",
    price: 150,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/1067/800/600",
    title: "Home Organization",
    description:
      "Full closet and storage organization with custom solutions. Decluttering and space optimization.",
    price: 200,
  },
  {
    id: 3,
    image: "https://picsum.photos/id/180/800/600",
    title: "Move-out Cleaning",
    description:
      "Comprehensive move-out cleaning service to ensure full deposit return. Every room detailed.",
    price: 350,
  },
];

const mockReviews: Review[] = [
  {
    id: 1,
    author: "John Smith",
    rating: 5,
    date: "1 week ago",
    comment:
      "Jane did an amazing job with our kitchen! Everything was spotless and she was very professional.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Highly recommend! She organized our entire closet system and it looks incredible.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    author: "Mike R.",
    rating: 4,
    date: "3 weeks ago",
    comment:
      "Great service, arrived on time and did excellent work. Would hire again.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

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
];

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
];

const mockConversations = [
  {
    id: 1,
    name: "John Smith",
    profession: "Plumber",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "I can come by tomorrow at 2 PM",
    timestamp: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    profession: "Electrician",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "The job is complete. Let me know if you have any questions!",
    timestamp: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Mike Davis",
    profession: "Cleaner",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "Thanks for the booking!",
    timestamp: "3h ago",
    unread: 1,
  },
  {
    id: 4,
    name: "Emily Chen",
    profession: "Painter",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "I'll bring all the supplies needed",
    timestamp: "1d ago",
    unread: 0,
  },
  {
    id: 5,
    name: "David Wilson",
    profession: "Handyman",
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: "See you next week!",
    timestamp: "2d ago",
    unread: 0,
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [bio, setBio] = useState(mockBio);
  const [skills, setSkills] = useState(mockSkills);
  const [availability, setAvailability] = useState(mockAvailability);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Fetched profile data:", data);

        // Update profile state with fetched data
        if (data.user) {
          const fullName = `${data.user.firstname || ""} ${data.user.lastname || ""}`.trim();
          const location = data.user.city && data.user.state
            ? `${data.user.city}, ${data.user.state}`
            : data.user.city || data.user.state || "Not set";

          setProfile({
            ...profile,
            name: fullName || "Your Name",
            profession: data.worker?.profession || "Home Services",
            location,
            hourlyRate: data.worker?.hourly_rate_min || 0,
            avatar: data.user.profile_pic_url || profile.avatar,
            completedJobs: data.worker?.jobs_completed || 0,
            responseTime: data.worker?.response_time_minutes
              ? `Within ${data.worker.response_time_minutes} minutes`
              : "Within 2 hours",
            verified: data.worker?.is_verified || false,
          });

          if (data.user.bio) {
            setBio(data.user.bio);
          }

          if (data.worker?.skills && Array.isArray(data.worker.skills)) {
            setSkills(data.worker.skills);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleHeaderSave = async (data: ProfileHeaderFormValues) => {
    console.log("handleHeaderSave called with data:", data);
    console.log("Current profile before update:", profile);

    try {
      // Save to API
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          statusEmoji: data.statusEmoji,
          statusText: data.statusText,
          profession: data.profession,
          location: data.location,
          hourlyRate: data.hourlyRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const result = await response.json();
      console.log("Save response:", result);

      // Update local state
      const updatedProfile = {
        ...profile,
        name: data.name,
        statusEmoji: data.statusEmoji,
        statusText: data.statusText,
        profession: data.profession,
        location: data.location,
        hourlyRate: data.hourlyRate,
      };

      console.log("Updated profile:", updatedProfile);
      setProfile(updatedProfile);
      console.log("Header saved successfully to database");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleAvatarChange = async (file: File) => {
    // TODO: Implement avatar upload to storage
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Avatar uploaded:", file.name);
    // For now, just show the preview - will need to implement Supabase Storage upload
  };

  const handleAboutSave = async (data: ProfileAboutFormValues) => {
    try {
      // Save to API
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: data.bio,
          skills: data.skills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save about section");
      }

      const result = await response.json();
      console.log("About save response:", result);

      // Update local state
      setBio(data.bio);
      setSkills(data.skills);
      console.log("About section saved successfully to database");
    } catch (error) {
      console.error("Error saving about section:", error);
      alert("Failed to save about section. Please try again.");
    }
  };

  const handleAvailabilitySave = async (
    data: ProfileAvailabilityFormValues,
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAvailability(data);
    console.log("Availability saved:", data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onSave={handleHeaderSave}
          onAvatarChange={handleAvatarChange}
        />

        {/* Gallery Section */}
        <ProfileGallery portfolio={mockPortfolio} />

        {/* About Section */}
        <ProfileAbout bio={bio} skills={skills} onSave={handleAboutSave} />

        {/* Testimonials Section */}
        <ProfileTestimonials
          rating={profile.rating}
          reviewCount={profile.reviews}
          reviews={mockReviews}
        />

        {/* Availability Section */}
        <ProfileAvailability
          availability={availability}
          onSave={handleAvailabilitySave}
        />

        {/* Tabs Section */}
        <ProfileTabs
          bookings={mockBookings}
          bookmarkedWorkers={mockBookmarked}
          conversations={mockConversations}
        />
      </div>
    </div>
  );
}
