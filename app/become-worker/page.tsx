"use client";

import { Briefcase, Check, DollarSign, TrendingUp, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubProfile } from "@/contexts/sub-profile-context";
import type { DirectoryId } from "@/lib/types/sub-profile";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn More",
    description: "Set your own rates and keep 90% of what you earn",
  },
  {
    icon: Users,
    title: "Find Customers",
    description:
      "Connect with thousands of customers looking for your services",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Build your reputation with reviews and ratings",
  },
  {
    icon: Briefcase,
    title: "Flexible Schedule",
    description: "Work when you want and manage your own availability",
  },
];

const jobTitles = [
  "Plumber",
  "Electrician",
  "Cleaner",
  "Painter",
  "Carpenter",
  "Handyman",
  "HVAC Technician",
  "Landscaper",
  "Roofer",
  "Mason",
  "Welder",
  "Locksmith",
  "Pest Control Technician",
  "Appliance Repair Technician",
  "General Contractor",
];

export default function BecomeWorkerPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profileLabel: "",
    jobTitle: "",
    experience: "",
    bio: "",
    agreeToTerms: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { addSubProfile, setHasMainProfile } = useSubProfile();

  const fromParam = searchParams.get("from");
  const isSubProfileFlow = fromParam === "sub-profile";
  const isMainProfileFlow = fromParam === "main-profile";
  const directoryParam = searchParams.get("directory");

  useEffect(() => {
    if (isMainProfileFlow) {
      setFormData((prev) => ({ ...prev, profileLabel: "Main" }));
    }
  }, [isMainProfileFlow]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 2 && (!formData.profileLabel || !formData.jobTitle)) return;
    if (step < 3) {
      setStep(step + 1);
    } else if (isMainProfileFlow && directoryParam) {
      // Main profile creation flow
      setHasMainProfile(true);
      toast("Profile created successfully");
      router.push("/profile");
    } else if (isSubProfileFlow && directoryParam) {
      // Sub-profile creation flow: add profile and redirect
      addSubProfile(directoryParam as DirectoryId, formData.profileLabel);
      toast(`${formData.profileLabel} sub-profile created`);
      router.push("/profile");
    } else {
      // Default flow
      console.log("Form submitted:", formData);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {step === 1 ? (
        // Landing Page
        <div>
          {/* Hero Section */}
          <section className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Become a Worker
              </h1>
              <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto text-pretty">
                Join our platform and start earning by offering your
                professional services to customers in your area
              </p>
              <Button size="lg" variant="secondary" onClick={() => setStep(2)}>
                Get Started
              </Button>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                Why Join Direktory?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit) => (
                  <Card key={benefit.title}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-card py-16 px-4 border-y">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                How It Works
              </h2>
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Create Your Profile",
                    description: "Tell us about your skills and experience",
                  },
                  {
                    step: 2,
                    title: "Get Verified",
                    description:
                      "Complete our verification process to build trust",
                  },
                  {
                    step: 3,
                    title: "Start Receiving Bookings",
                    description: "Accept jobs and start earning money",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of workers earning on our platform
              </p>
              <Button size="lg" onClick={() => setStep(2)}>
                Apply Now
              </Button>
            </div>
          </section>
        </div>
      ) : (
        // Application Form
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {step - 1} of 2
              </span>
              <span className="text-sm text-muted-foreground">
                {((step - 1) / 2) * 100}% Complete
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-700 h-2 rounded-full transition-all"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 2
                  ? "Professional Information"
                  : "Complete Your Profile"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="profileLabel">Profile Label</Label>
                      <Input
                        id="profileLabel"
                        type="text"
                        placeholder="e.g., John's Plumbing Services"
                        value={formData.profileLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileLabel: e.target.value,
                          })
                        }
                        disabled={isMainProfileFlow}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        {isMainProfileFlow
                          ? "Your first profile is always labeled 'Main'."
                          : "A short name for your worker profile that customers will see."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Combobox
                        id="jobTitle"
                        value={formData.jobTitle}
                        onValueChange={(value) =>
                          setFormData({ ...formData, jobTitle: value })
                        }
                        options={jobTitles}
                        placeholder="Select or type your job title"
                        searchPlaceholder="Search job titles…"
                        emptyMessage="No matching title — press Escape to use your search text."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell customers about your experience and expertise..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-foreground">
                        What's Next?
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span>
                            We'll review your application within 24-48 hours
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span>Complete identity verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span>Start receiving booking requests</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            agreeToTerms: checked as boolean,
                          })
                        }
                        required
                      />
                      <Label
                        htmlFor="terms"
                        className="font-normal cursor-pointer leading-relaxed text-sm"
                      >
                        I agree to the Terms of Service and Privacy Policy. I
                        understand that Direktory will verify my identity and
                        professional credentials.
                      </Label>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  {step > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button type="submit" className="flex-1">
                    {step === 3 ? "Submit Application" : "Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
