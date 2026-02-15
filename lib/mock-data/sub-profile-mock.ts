import type { DirectoryId, SubProfile } from "@/lib/types/sub-profile";

type DirectoryMockConfig = {
  name: string;
  username: string;
  profession: string;
  statusEmoji: string;
  statusText: string;
  bio: string;
  skills: string[];
  services: string[];
  hourlyRate: number;
};

const directoryMockConfigs: Record<DirectoryId, DirectoryMockConfig> = {
  workers: {
    name: "Alex Rivera",
    username: "alexrivera",
    profession: "Master Electrician",
    statusEmoji: "⚡",
    statusText: "Available for emergency calls",
    bio: "Licensed master electrician with 10+ years of experience in residential and commercial wiring. Certified in solar panel installations and smart home systems. Safety-first approach with impeccable track record.",
    skills: [
      "Electrical Wiring",
      "Solar Installation",
      "Smart Home Setup",
      "Panel Upgrades",
      "Safety Inspections",
    ],
    services: [
      "Panel Upgrade",
      "Outlet Installation",
      "Lighting Retrofit",
      "EV Charger Install",
    ],
    hourlyRate: 75,
  },
  business: {
    name: "Morgan Chen",
    username: "morganchen",
    profession: "Business Consultant",
    statusEmoji: "📊",
    statusText: "Taking new clients",
    bio: "Seasoned business consultant specializing in startup growth strategies and operational efficiency. MBA from Wharton with 8 years in management consulting. Helped 50+ businesses scale revenue.",
    skills: [
      "Strategic Planning",
      "Financial Modeling",
      "Market Analysis",
      "Team Building",
      "Process Optimization",
    ],
    services: [
      "Growth Strategy",
      "Market Research",
      "Financial Planning",
      "Operations Audit",
    ],
    hourlyRate: 120,
  },
  jobs: {
    name: "Taylor Brooks",
    username: "taylorbrooks",
    profession: "Career Coach",
    statusEmoji: "🎯",
    statusText: "Open for mentoring sessions",
    bio: "Certified career coach with expertise in tech hiring and professional development. Former HR director at a Fortune 500 company. Passionate about helping professionals land their dream roles.",
    skills: [
      "Resume Writing",
      "Interview Prep",
      "Salary Negotiation",
      "Career Transitions",
      "LinkedIn Optimization",
    ],
    services: [
      "Resume Review",
      "Mock Interview",
      "Career Planning",
      "Job Search Strategy",
    ],
    hourlyRate: 85,
  },
  food: {
    name: "Sofia Martinez",
    username: "sofiamartinez",
    profession: "Personal Chef",
    statusEmoji: "🍳",
    statusText: "Booking for weekend events",
    bio: "Culinary school graduate with experience in Michelin-starred restaurants. Specializing in farm-to-table cuisine, dietary accommodations, and intimate dinner parties. Available for private events and weekly meal prep.",
    skills: [
      "Menu Planning",
      "Dietary Accommodations",
      "Event Catering",
      "Meal Prep",
      "Baking & Pastry",
    ],
    services: [
      "Private Dinner",
      "Weekly Meal Prep",
      "Event Catering",
      "Cooking Classes",
    ],
    hourlyRate: 65,
  },
  flights: {
    name: "Jordan Lee",
    username: "jordanlee",
    profession: "Travel Advisor",
    statusEmoji: "✈️",
    statusText: "Finding the best deals",
    bio: "ASTA-certified travel advisor specializing in luxury and adventure travel. Access to exclusive airline partnerships and loyalty program optimization. 12 years helping clients travel smarter.",
    skills: [
      "Flight Booking",
      "Itinerary Planning",
      "Loyalty Programs",
      "Group Travel",
      "Business Travel",
    ],
    services: [
      "Flight Search",
      "Trip Planning",
      "Loyalty Consulting",
      "Corporate Travel",
    ],
    hourlyRate: 55,
  },
  hotels: {
    name: "Priya Patel",
    username: "priyapatel",
    profession: "Hospitality Specialist",
    statusEmoji: "🏨",
    statusText: "Curating perfect stays",
    bio: "Hospitality expert with insider access to premium hotels and resorts worldwide. Former concierge at The Ritz-Carlton. Specializing in luxury stays, honeymoon planning, and corporate retreats.",
    skills: [
      "Hotel Curation",
      "Luxury Travel",
      "Event Venues",
      "Corporate Retreats",
      "Honeymoon Planning",
    ],
    services: [
      "Hotel Booking",
      "Venue Selection",
      "Retreat Planning",
      "VIP Arrangements",
    ],
    hourlyRate: 70,
  },
  "buy-and-sell": {
    name: "Chris Nguyen",
    username: "chrisnguyen",
    profession: "Marketplace Expert",
    statusEmoji: "🛍️",
    statusText: "Great deals available",
    bio: "E-commerce and resale specialist with deep knowledge of vintage goods, electronics, and collectibles. Running a top-rated storefront with 1000+ positive reviews. Expert at pricing and authentication.",
    skills: [
      "Product Pricing",
      "Authentication",
      "Shipping Logistics",
      "Negotiation",
      "Product Photography",
    ],
    services: [
      "Item Listing",
      "Price Appraisal",
      "Authentication",
      "Shipping Setup",
    ],
    hourlyRate: 40,
  },
  dealerships: {
    name: "Marcus Thompson",
    username: "marcusthompson",
    profession: "Auto Specialist",
    statusEmoji: "🚗",
    statusText: "New inventory just arrived",
    bio: "Certified automotive specialist with 15 years in the industry. Expert in pre-purchase inspections, trade-in valuations, and financing options. Helping buyers find their perfect vehicle at the right price.",
    skills: [
      "Vehicle Inspection",
      "Trade-in Valuation",
      "Financing Options",
      "Market Pricing",
      "Test Drive Coordination",
    ],
    services: [
      "Pre-Purchase Inspection",
      "Valuation Report",
      "Finance Consultation",
      "Vehicle Sourcing",
    ],
    hourlyRate: 60,
  },
  "lost-and-found": {
    name: "Dana Kim",
    username: "danakim",
    profession: "Recovery Specialist",
    statusEmoji: "🔍",
    statusText: "Helping reunite lost items",
    bio: "Community-focused recovery specialist coordinating lost-and-found efforts across the tri-state area. Partnered with transit authorities, hotels, and event venues. 85% success rate in item recovery.",
    skills: [
      "Item Tracking",
      "Community Outreach",
      "Database Management",
      "Venue Coordination",
      "Social Media Search",
    ],
    services: [
      "Lost Item Report",
      "Active Search",
      "Found Item Listing",
      "Recovery Coordination",
    ],
    hourlyRate: 35,
  },
  events: {
    name: "Riley Cooper",
    username: "rileycooper",
    profession: "Event Planner",
    statusEmoji: "🎉",
    statusText: "Planning something amazing",
    bio: "Full-service event planner with a portfolio of 200+ successful events. From intimate gatherings to corporate galas, every detail is curated to perfection. Certified in event safety and vendor management.",
    skills: [
      "Event Design",
      "Vendor Management",
      "Budget Planning",
      "Timeline Coordination",
      "Venue Scouting",
    ],
    services: [
      "Event Planning",
      "Venue Booking",
      "Vendor Coordination",
      "Day-of Management",
    ],
    hourlyRate: 90,
  },
};

const reviewerNames = [
  "Alex K.",
  "Maria S.",
  "James P.",
  "Linda W.",
  "Robert H.",
];

function generateReviews(services: string[]) {
  return reviewerNames.map((name, i) => ({
    id: i + 1,
    author: name,
    rating: i < 3 ? 5 : 4,
    date: `${i + 1} week${i > 0 ? "s" : ""} ago`,
    comment: `Excellent ${services[i % services.length]?.toLowerCase() ?? "service"}! Very professional and thorough. Would definitely recommend.`,
    avatar: "/placeholder.svg?height=40&width=40",
  }));
}

function generateBookings(services: string[]) {
  const workers = [
    "Sam Wilson",
    "Pat Garcia",
    "Jamie Lee",
    "Casey Brown",
    "Drew Taylor",
  ];
  const statuses = [
    "Completed",
    "Upcoming",
    "Completed",
    "Cancelled",
    "Upcoming",
  ];
  return workers.map((worker, i) => ({
    id: i + 1,
    worker,
    service: services[i % services.length] ?? "General Service",
    date: `Jan ${10 + i * 5}, 2025`,
    status: statuses[i] ?? "Completed",
    amount: 100 + i * 50,
  }));
}

function generateConversations() {
  const people = [
    {
      name: "Sam Wilson",
      profession: "Specialist",
      msg: "Sounds great, see you then!",
      timestamp: "5m ago",
      unread: 1,
    },
    {
      name: "Pat Garcia",
      profession: "Coordinator",
      msg: "The project is coming along nicely",
      timestamp: "30m ago",
      unread: 0,
    },
    {
      name: "Jamie Lee",
      profession: "Consultant",
      msg: "I've sent over the details",
      timestamp: "2h ago",
      unread: 3,
    },
    {
      name: "Casey Brown",
      profession: "Manager",
      msg: "Thanks for the quick turnaround!",
      timestamp: "1d ago",
      unread: 0,
    },
  ];
  return people.map((p, i) => ({
    id: i + 1,
    name: p.name,
    profession: p.profession,
    avatar: "/placeholder.svg?height=60&width=60",
    lastMessage: p.msg,
    timestamp: p.timestamp,
    unread: p.unread,
  }));
}

function generateInvoices(services: string[]) {
  const clients = [
    "Sam Wilson",
    "Pat Garcia",
    "Jamie Lee",
    "Casey Brown",
    "Drew Taylor",
  ];
  const invoiceStatuses = [
    "Paid",
    "Pending",
    "Paid",
    "Overdue",
    "Paid",
  ] as const;
  return clients.map((client, i) => ({
    id: i + 1,
    invoiceNumber: `SUB-${String(i + 1).padStart(3, "0")}`,
    client,
    service: services[i % services.length] ?? "General Service",
    date: `Jan ${5 + i * 7}, 2025`,
    amount: 150 + i * 75,
    status: invoiceStatuses[i] ?? ("Paid" as const),
  }));
}

function generatePortfolio(services: string[]) {
  const imageIds = [1048, 1067, 180];
  return services.slice(0, 3).map((service, i) => ({
    id: i + 1,
    image: `https://picsum.photos/id/${imageIds[i]}/800/600`,
    title: service,
    description: `Professional ${service.toLowerCase()} delivered with attention to detail and client satisfaction.`,
    price: 150 + i * 100,
  }));
}

export function generateSubProfileMockData(
  directoryId: DirectoryId,
  directoryLabel: string,
): SubProfile {
  const config = directoryMockConfigs[directoryId];

  return {
    id: `${directoryId}-${Date.now()}`,
    directoryId,
    directoryLabel,
    createdAt: new Date().toISOString(),
    profileData: {
      name: config.name,
      username: config.username,
      avatar: "/placeholder.svg?height=150&width=150",
      statusEmoji: config.statusEmoji,
      statusText: config.statusText,
      profession: config.profession,
      isOnline: true,
      verified: true,
      rating: 4.9,
      reviews: 18,
      location: "New York, NY",
      joinedDate: "January 2025",
      hourlyRate: config.hourlyRate,
      completedJobs: 32,
      responseTime: "Within 1 hour",
    },
    bio: config.bio,
    skills: config.skills,
    availability: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 4:00 PM",
      saturday: "By appointment",
      sunday: "Closed",
    },
    portfolio: generatePortfolio(config.services),
    reviews: generateReviews(config.services),
    bookings: generateBookings(config.services),
    bookmarkedWorkers: [
      {
        id: 1,
        name: "Alex Reed",
        profession: config.profession,
        rating: 4.8,
        hourlyRate: config.hourlyRate - 10,
        avatar: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 2,
        name: "Jordan Blake",
        profession: config.profession,
        rating: 4.6,
        hourlyRate: config.hourlyRate + 5,
        avatar: "/placeholder.svg?height=60&width=60",
      },
    ],
    conversations: generateConversations(),
    invoices: generateInvoices(config.services),
  };
}
