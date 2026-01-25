"use client";

import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck,
  HelpCircle,
  Home,
  Info,
  Mail,
  MessageSquare,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VerificationPendingPage() {
  return (
    <AuthLayout
      title="Verification Submitted"
      description="Your documents are under review. We'll notify you once the process is complete."
    >
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm px-3 py-1.5">
              <Clock className="h-3.5 w-3.5" />
              Under Review
            </Badge>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Verification Submitted Successfully
            </CardTitle>
            <CardDescription className="text-base">
              Thank you for submitting your verification documents. Our team is
              reviewing your information to ensure everything meets our
              standards.
            </CardDescription>
          </div>

          {/* Visual Progress Indicator */}
          <div className="pt-4">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {/* Stage 1: Submitted */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-medium text-center">
                  Submitted
                </span>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-0.5 bg-primary mx-2 -mt-6" />

              {/* Stage 2: Under Review (Current) */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border-2 border-primary mb-2 animate-pulse">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-center text-primary">
                  Under Review
                </span>
              </div>

              {/* Connector Line */}
              <div className="flex-1 h-0.5 bg-muted mx-2 -mt-6" />

              {/* Stage 3: Verified (Pending) */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-2">
                  <Circle className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Enhanced Timeline Card */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Expected Review Time
                </h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  24-48 hours
                </p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive an email notification once your
                  verification is complete. Most reviews are completed within
                  one business day.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabbed Information */}
          <Tabs defaultValue="whats-next" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="whats-next">What&apos;s Next?</TabsTrigger>
              <TabsTrigger value="while-waiting">While You Wait</TabsTrigger>
              <TabsTrigger value="help">Need Help?</TabsTrigger>
            </TabsList>

            {/* Tab 1: What's Next? */}
            <TabsContent value="whats-next" className="space-y-4 mt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Step 1 */}
                <Card>
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Document Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our team verifies your identity and credentials to ensure
                      authenticity and compliance with our standards.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card>
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Quality Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We ensure all information meets our quality standards and
                      professional requirements.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card>
                  <CardHeader>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      Approval & Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll receive an email confirmation with your
                      verification status and next steps.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: While You Wait */}
            <TabsContent value="while-waiting" className="space-y-4 mt-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your account is already active! While we review your
                  verification, you can still access many features.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What You Can Do Now</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Complete Your Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Add more details about your services, experience, and
                        availability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Explore the Platform</p>
                      <p className="text-sm text-muted-foreground">
                        Familiarize yourself with the dashboard, messaging, and
                        booking features.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Prepare Your Portfolio</p>
                      <p className="text-sm text-muted-foreground">
                        Gather photos of your past work to showcase once
                        verified.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Set Your Preferences</p>
                      <p className="text-sm text-muted-foreground">
                        Configure notification settings and account preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Need Help? */}
            <TabsContent value="help" className="space-y-4 mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      How long does verification take?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Most verifications are completed within 24-48 hours.
                      However, in some cases, additional review may be required
                      which could extend the timeline to 3-5 business days.
                      You&apos;ll be notified via email if we need any
                      additional information.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      What documents are required?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We require a valid government-issued ID and proof of
                      professional credentials (licenses, certifications, or
                      professional insurance) relevant to your service category.
                      All documents must be clear, current, and show your full
                      name.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Can I update my submission?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      If you need to update your documents during the review
                      process, please contact our support team. They can help
                      you resubmit or add additional documentation as needed.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      What happens if verification fails?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      If your verification is not approved, you&apos;ll receive
                      an email explaining the specific reasons and what steps
                      you can take to resubmit. Common issues include unclear
                      photos, expired documents, or missing required
                      information. You can always resubmit once you&apos;ve
                      addressed the concerns.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Who can I contact for questions?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Our support team is available to help with any questions
                      about the verification process. You can reach us through
                      the contact support button below, or via email. We
                      typically respond within 24 hours.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-2">
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/help">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="lg">
                <Link href="/help">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
