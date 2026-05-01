"use client";

import { Check, CreditCard, Gift, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { formatShortDate } from "@/lib/formatters";

type CreditPackageId = "starter" | "popular" | "premium";

const creditPackages = [
  {
    id: "starter" as CreditPackageId,
    name: "Starter Pack",
    credits: 100,
    price: 100,
    bonus: 0,
    features: [
      "Perfect for trying out services",
      "No expiration",
      "Use anytime",
    ],
  },
  {
    id: "popular" as CreditPackageId,
    name: "Popular Pack",
    credits: 500,
    price: 500,
    bonus: 20,
    popular: true,
    features: [
      "Best value for regular users",
      "20 bonus credits",
      "No expiration",
      "Priority support",
    ],
  },
  {
    id: "premium" as CreditPackageId,
    name: "Premium Pack",
    credits: 1000,
    price: 1000,
    bonus: 60,
    features: [
      "Maximum savings",
      "60 bonus credits",
      "No expiration",
      "Priority support",
      "Exclusive deals",
    ],
  },
];

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
};

export default function CreditsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success") === "true";
  const wasCanceled = searchParams.get("canceled") === "true";

  const [selectedPackage, setSelectedPackage] =
    useState<CreditPackageId>("popular");
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const [creditsResult, txResult] = await Promise.all([
        supabase
          .from("user_credits")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_credit_transactions")
          .select("id, amount, type, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      setBalance(creditsResult.data?.balance ?? 0);
      setTransactions(txResult.data ?? []);
      setLoading(false);
    }

    loadData();
  }, [router, justPaid]);

  async function handlePurchase() {
    setPurchasing(true);
    setPurchaseError(null);

    const response = await fetch("/api/credits/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package: selectedPackage }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setPurchaseError(data.error ?? "Something went wrong. Please try again.");
      setPurchasing(false);
      return;
    }

    const { checkout_url } = await response.json();
    router.push(checkout_url);
  }

  const selectedPkg = creditPackages.find((p) => p.id === selectedPackage)!;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Credits</h1>
          <p className="text-muted-foreground">
            Purchase credits to book services and promote your profile
          </p>
        </div>

        {/* Post-payment banners */}
        {justPaid && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            Payment successful! Your credits have been added to your balance.
          </div>
        )}
        {wasCanceled && (
          <div className="mb-6 p-4 rounded-lg bg-muted border border-border text-muted-foreground text-sm">
            Payment was canceled. No charge was made.
          </div>
        )}

        {/* Current Balance */}
        <Card className="mb-8 bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white border-0">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200 mb-2">
                  Your Current Balance
                </p>
                {loading ? (
                  <Spinner className="size-8 text-white" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">
                      {(balance ?? 0).toLocaleString()}
                    </span>
                    <span className="text-2xl text-blue-100 dark:text-blue-200">
                      credits
                    </span>
                  </div>
                )}
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Credits Work */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Credits Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">
                    Purchase Credits
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Buy credit packages — 1 credit = ₱1
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">
                    Use on the Platform
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Spend credits to accept bookings, promote your profile, and
                    more
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">
                    Earn Bonuses
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Earn bonus credits through referrals and promotions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Purchase Credits
          </h2>
          <RadioGroup
            value={selectedPackage}
            onValueChange={(v) => setSelectedPackage(v as CreditPackageId)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-700">
                      Best Value
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <RadioGroupItem value={pkg.id} id={pkg.id} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        {pkg.credits}
                      </span>
                      <span className="text-muted-foreground">credits</span>
                    </div>
                    {pkg.bonus > 0 && (
                      <Badge variant="secondary" className="w-fit">
                        +{pkg.bonus} bonus credits
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        ₱{pkg.price}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
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

          <Card className="mt-6">
            <CardContent>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">
                    Ready to purchase?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedPkg.name} —{" "}
                    {selectedPkg.credits + selectedPkg.bonus} credits for ₱
                    {selectedPkg.price}
                  </p>
                  {purchaseError && (
                    <p className="text-sm text-destructive mt-1">
                      {purchaseError}
                    </p>
                  )}
                </div>
                <Button
                  size="lg"
                  onClick={handlePurchase}
                  disabled={purchasing || loading}
                >
                  {purchasing ? (
                    <>
                      <Spinner className="mr-2" />
                      Redirecting…
                    </>
                  ) : (
                    <>
                      <CreditCard />
                      Purchase Credits
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  No transactions yet.{" "}
                  <Link
                    href="#purchase"
                    className="underline hover:no-underline"
                  >
                    Purchase your first credits
                  </Link>{" "}
                  to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "purchase"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : tx.type === "bonus"
                              ? "bg-purple-100 dark:bg-purple-900/30"
                              : "bg-secondary"
                        }`}
                      >
                        {tx.type === "purchase" ? (
                          <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : tx.type === "bonus" ? (
                          <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <Zap className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {tx.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatShortDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount} credits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
