"use client";

import { ArrowLeft, Check, Crown, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const promotionPlans = [
  {
    id: "basic",
    name: "Basic Boost",
    duration: "7 days",
    price: 49,
    credits: 50,
    features: [
      "Top 10 placement in search",
      "Featured badge on profile",
      "Priority in recommendations",
      "7 days visibility",
    ],
  },
  {
    id: "pro",
    name: "Pro Boost",
    duration: "14 days",
    price: 89,
    credits: 90,
    popular: true,
    features: [
      "Top 5 placement in search",
      "Featured badge on profile",
      "Priority in recommendations",
      "14 days visibility",
      "Highlighted in category pages",
    ],
  },
  {
    id: "premium",
    name: "Premium Boost",
    duration: "30 days",
    price: 149,
    credits: 150,
    features: [
      "Top 3 placement in search",
      "Featured badge on profile",
      "Priority in recommendations",
      "30 days visibility",
      "Highlighted in category pages",
      "Homepage featured section",
    ],
  },
];

export default function PromoteProfilePage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-yellow-900 dark:text-yellow-950" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Boost Your Profile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get featured at the top of search results and increase your
            visibility to potential customers
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">3x More Views</h3>
              <p className="text-sm text-muted-foreground">
                Get up to 3 times more profile views from potential customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">More Bookings</h3>
              <p className="text-sm text-muted-foreground">
                Increased visibility leads to more booking requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Stand Out</h3>
              <p className="text-sm text-muted-foreground">
                Featured badge makes your profile more trustworthy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Choose Your Plan
          </h2>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <RadioGroupItem value={plan.id} id={plan.id} />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">
                        / {plan.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      or {plan.credits} credits
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Action */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Ready to boost your profile?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Selected:{" "}
                  {promotionPlans.find((p) => p.id === selectedPlan)?.name} - $
                  {promotionPlans.find((p) => p.id === selectedPlan)?.price}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
                >
                  Activate Boost
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
