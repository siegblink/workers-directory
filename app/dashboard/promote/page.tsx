"use client";

import { ArrowLeft, Check, Crown, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";

type PromotionPlan = {
  id: "basic" | "pro" | "premium";
  name: string;
  duration: string;
  price: number;
  popular?: boolean;
  features: string[];
};

const promotionPlans: PromotionPlan[] = [
  {
    id: "basic",
    name: "Basic Boost",
    duration: "7 days",
    price: 49,
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

type ActivePromotion = {
  plan: string;
  expires_at: string;
};

export default function PromoteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success") === "true";
  const wasCanceled = searchParams.get("canceled") === "true";

  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "premium">("pro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePromotion, setActivePromotion] = useState<ActivePromotion | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    async function loadPromotionStatus() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: worker } = await supabase
        .from("workers")
        .select("id")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .single();

      if (!worker) return;

      const { data: promotion } = await supabase
        .from("promoted_listings")
        .select("plan, expires_at")
        .eq("worker_id", worker.id)
        .gt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setActivePromotion(promotion ?? null);
      setLoadingStatus(false);
    }

    loadPromotionStatus();
  }, [justPaid]);

  async function handleActivate() {
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selectedPlan }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const { checkout_url } = await response.json();
    router.push(checkout_url);
  }

  const selectedPlanConfig = promotionPlans.find((p) => p.id === selectedPlan)!;

  function formatExpiry(expiresAt: string) {
    return new Date(expiresAt).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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

        {/* Post-payment feedback banners */}
        {justPaid && (
          <div className="mb-8 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            Payment successful! Your profile is now boosted. It may take a moment to appear in search results.
          </div>
        )}
        {wasCanceled && (
          <div className="mb-8 p-4 rounded-lg bg-muted border border-border text-muted-foreground text-sm">
            Payment was canceled. No charge was made.
          </div>
        )}

        {/* Active promotion status */}
        {!loadingStatus && activePromotion && (
          <Card className="mb-8 border-yellow-400 dark:border-yellow-500 ring-1 ring-yellow-400 dark:ring-yellow-500">
            <CardContent className="flex items-center gap-3 py-4">
              <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  {promotionPlans.find((p) => p.id === activePromotion.plan)?.name ?? activePromotion.plan} active
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires {formatExpiry(activePromotion.expires_at)}
                </p>
              </div>
              <Badge className="ml-auto bg-yellow-500 hover:bg-yellow-500 text-yellow-950">Active</Badge>
            </CardContent>
          </Card>
        )}

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
          <RadioGroup value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as typeof selectedPlan)}>
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
                      <span className="text-3xl font-bold">₱{plan.price}</span>
                      <span className="text-muted-foreground">
                        / {plan.duration}
                      </span>
                    </div>
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Ready to boost your profile?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedPlanConfig.name} — ₱{selectedPlanConfig.price} / {selectedPlanConfig.duration}
                </p>
                {error && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
                  onClick={handleActivate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Redirecting…
                    </>
                  ) : (
                    "Activate Boost"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
