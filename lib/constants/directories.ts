import {
  Briefcase,
  Building2,
  Calendar,
  Car,
  Hotel,
  Plane,
  SearchX,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

export type Directory = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isComingSoon: boolean;
  description?: string;
  iconColor: string;
  bgColor: string;
};

export const directories: Directory[] = [
  {
    id: "workers",
    label: "Workers",
    icon: Wrench,
    href: "/search",
    isComingSoon: false,
    description: "Find verified service professionals",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/15",
  },
  {
    id: "business",
    label: "Business",
    icon: Building2,
    href: "/business",
    isComingSoon: true,
    description: "Business services and resources",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/15",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    href: "#",
    isComingSoon: true,
    description: "Browse job opportunities",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/15",
  },
  {
    id: "food",
    label: "Food",
    icon: UtensilsCrossed,
    href: "#",
    isComingSoon: true,
    description: "Discover local restaurants",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/15",
  },
  {
    id: "flights",
    label: "Flights",
    icon: Plane,
    href: "#",
    isComingSoon: true,
    description: "Book your next flight",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/15",
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: Hotel,
    href: "#",
    isComingSoon: true,
    description: "Find accommodation",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/15",
  },
  {
    id: "buy-and-sell",
    label: "Buy and Sell",
    icon: ShoppingBag,
    href: "#",
    isComingSoon: true,
    description: "Marketplace for goods",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/15",
  },
  {
    id: "dealerships",
    label: "Dealerships",
    icon: Car,
    href: "#",
    isComingSoon: true,
    description: "Browse vehicles for sale",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/15",
  },
  {
    id: "lost-and-found",
    label: "Lost and Found",
    icon: SearchX,
    href: "#",
    isComingSoon: true,
    description: "Report or find lost items",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/15",
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    href: "#",
    isComingSoon: true,
    description: "Upcoming local events",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/15",
  },
];
