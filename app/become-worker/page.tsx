"use client";

import { Briefcase, Check, DollarSign, TrendingUp, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

const professions = [
  "Plumber",
  "Electrician",
  "Cleaner",
  "Painter",
  "Carpenter",
  "Handyman",
  "HVAC Technician",
  "Landscaper",
  "Other",
];

export default function BecomeWorkerPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profession: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    skills: [] as string[],
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === 1 ? (
        // Landing Page
        <div>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-20 px-4">
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
                Why Join WorkerDir?
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
                      <Label htmlFor="profession">Profession</Label>
                      <Select
                        value={formData.profession}
                        onValueChange={(value) =>
                          setFormData({ ...formData, profession: value })
                        }
                      >
                        <SelectTrigger id="profession">
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map((prof) => (
                            <SelectItem key={prof} value={prof}>
                              {prof}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="e.g., 45"
                        value={formData.hourlyRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hourlyRate: e.target.value,
                          })
                        }
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Set your hourly rate. You can change this later.
                      </p>
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
                    <div className="space-y-2">
                      <Label>Skills & Specializations</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Emergency Repairs",
                          "Installations",
                          "Maintenance",
                          "Inspections",
                          "Renovations",
                          "Consultations",
                        ].map((skill) => (
                          <div key={skill} className="flex items-center gap-2">
                            <Checkbox
                              id={skill}
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    skills: [...formData.skills, skill],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    skills: formData.skills.filter(
                                      (s) => s !== skill,
                                    ),
                                  });
                                }
                              }}
                            />
                            <Label
                              htmlFor={skill}
                              className="font-normal cursor-pointer"
                            >
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

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
                        understand that WorkerDir will verify my identity and
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
