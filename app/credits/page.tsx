"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Zap, TrendingUp, Gift, Check } from "lucide-react"

const creditPackages = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 49,
    bonus: 0,
    features: ["Perfect for trying out services", "No expiration", "Use anytime"],
  },
  {
    id: "popular",
    name: "Popular Pack",
    credits: 100,
    price: 89,
    bonus: 10,
    popular: true,
    features: ["Best value for regular users", "10 bonus credits", "No expiration", "Priority support"],
  },
  {
    id: "premium",
    name: "Premium Pack",
    credits: 200,
    price: 169,
    bonus: 30,
    features: ["Maximum savings", "30 bonus credits", "No expiration", "Priority support", "Exclusive deals"],
  },
]

const mockTransactions = [
  {
    id: 1,
    type: "purchase",
    amount: 100,
    credits: 100,
    date: "Dec 15, 2024",
    description: "Popular Pack Purchase",
  },
  {
    id: 2,
    type: "spent",
    amount: -90,
    credits: -90,
    date: "Dec 10, 2024",
    description: "Booking with John Smith",
  },
  {
    id: 3,
    type: "bonus",
    amount: 10,
    credits: 10,
    date: "Dec 10, 2024",
    description: "Referral Bonus",
  },
]

export default function CreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState("popular")
  const currentBalance = 120

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Credits</h1>
          <p className="text-muted-foreground">Purchase credits to book services and promote your profile</p>
        </div>

        {/* Current Balance */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200 mb-2">Your Current Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{currentBalance}</span>
                  <span className="text-2xl text-blue-100 dark:text-blue-200">credits</span>
                </div>
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
                  <h4 className="font-semibold mb-1 text-foreground">Purchase Credits</h4>
                  <p className="text-sm text-muted-foreground">Buy credit packages at discounted rates</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">Book Services</h4>
                  <p className="text-sm text-muted-foreground">Use credits to pay for bookings (1 credit = $1)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-foreground">Get Bonuses</h4>
                  <p className="text-sm text-muted-foreground">Earn bonus credits through referrals and promotions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Purchase Credits</h2>
          <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedPackage === pkg.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-700">Best Value</Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <RadioGroupItem value={pkg.id} id={pkg.id} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">{pkg.credits}</span>
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
                      <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">Ready to purchase?</h3>
                  <p className="text-sm text-muted-foreground">
                    Selected: {creditPackages.find((p) => p.id === selectedPackage)?.name} - $
                    {creditPackages.find((p) => p.id === selectedPackage)?.price}
                  </p>
                </div>
                <Button size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase Credits
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
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "purchase"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : transaction.type === "bonus"
                            ? "bg-purple-100 dark:bg-purple-900/30"
                            : "bg-secondary"
                      }`}
                    >
                      {transaction.type === "purchase" ? (
                        <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : transaction.type === "bonus" ? (
                        <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Zap className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.credits > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
                      {transaction.credits > 0 ? "+" : ""}
                      {transaction.credits} credits
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
