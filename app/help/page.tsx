"use client";

import { Book, CreditCard, MessageCircle, Search, Shield } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner and fill out the registration form. You'll need to provide your email, create a password, and verify your email address.",
      },
      {
        q: "Is Direktory free to use?",
        a: "Creating an account and browsing workers is completely free. You only pay when you book a service using credits.",
      },
      {
        q: "How do I find workers near me?",
        a: "Use the search bar on the homepage or visit the 'Find Workers' page. Enter your location and the service you need, then browse through available workers in your area.",
      },
    ],
  },
  {
    id: "bookings",
    title: "Bookings & Payments",
    icon: CreditCard,
    questions: [
      {
        q: "How do I book a service?",
        a: "Find a worker you like, click 'Book Now' on their profile, select your preferred date and time, provide job details, and confirm your booking.",
      },
      {
        q: "What are credits and how do they work?",
        a: "Credits are our platform currency. 1 credit = $1. Purchase credit packages at discounted rates and use them to pay for services. Credits never expire.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes, you can cancel upcoming bookings from your 'My Bookings' page. Cancellation policies vary by worker, so check their profile for details.",
      },
      {
        q: "How do I get a refund?",
        a: "If you're unsatisfied with a service, contact our support team within 48 hours. We'll review your case and process refunds as credits to your account.",
      },
    ],
  },
  {
    id: "workers",
    title: "For Workers",
    icon: Shield,
    questions: [
      {
        q: "How do I become a worker?",
        a: "Click 'Become a Worker' in the navigation menu, fill out the application form, and complete our verification process. We'll review your application within 24-48 hours.",
      },
      {
        q: "What percentage does Direktory take?",
        a: "We charge a 10% platform fee on completed bookings. You keep 90% of what you earn.",
      },
      {
        q: "How do I get paid?",
        a: "Payments are processed automatically after job completion. Funds are transferred to your linked bank account within 2-3 business days.",
      },
      {
        q: "Can I set my own rates?",
        a: "Yes! You have complete control over your hourly rate and can adjust it anytime from your dashboard settings.",
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help from our support team
              </p>
              <Button variant="outline" size="sm">
                Send Message
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to use Direktory
              </p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Safety & Trust</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about our safety measures
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item) => (
                    <AccordionItem key={item.q} value={item.q}>
                      <AccordionTrigger className="text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to assist you
            </p>
            <Button size="lg">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
