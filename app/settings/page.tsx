"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  // ─── Notification preferences (local-only — no DB table) ──────────────────
  const [notifications, setNotifications] = useState({
    bookingRequests: true,
    messages: true,
    reviews: true,
    promotions: false,
  });

  // ─── Profile tab state ────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // ─── Account tab state ────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState(false);

  // ─── Password tab state ───────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ─── Load real data on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");

      const [userResult, workerResult] = await Promise.all([
        supabase
          .from("users")
          .select("firstname, lastname, bio, city, state, profile_pic_url")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("workers")
          .select("id, profession, hourly_rate_min")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .maybeSingle(),
      ]);

      const ud = userResult.data as {
        firstname: string;
        lastname: string;
        bio: string | null;
        city: string | null;
        state: string | null;
        profile_pic_url: string | null;
      } | null;

      const wd = workerResult.data as {
        id: string;
        profession: string | null;
        hourly_rate_min: number | null;
      } | null;

      if (ud) {
        setFirstName(ud.firstname);
        setLastName(ud.lastname);
        setBio(ud.bio ?? "");
        setLocation([ud.city, ud.state].filter(Boolean).join(", "));
        setAvatar(ud.profile_pic_url);
      }

      if (wd) {
        setProfession(wd.profession ?? "");
        setHourlyRate(wd.hourly_rate_min != null ? String(wd.hourly_rate_min) : "");
        setWorkerId(wd.id);
      }
    }

    load();
  }, []);

  // ─── Save handlers ────────────────────────────────────────────────────────

  async function handleSaveProfile() {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setProfileError("Not authenticated.");
      setProfileSaving(false);
      return;
    }

    // Parse "City, State" → city / state
    const lastComma = location.lastIndexOf(",");
    const city =
      lastComma >= 0 ? location.slice(0, lastComma).trim() : location.trim();
    const state =
      lastComma >= 0 ? location.slice(lastComma + 1).trim() : null;

    const userUpdate = await supabase
      .from("users")
      .update({ firstname: firstName, lastname: lastName, bio, city, state })
      .eq("id", user.id);

    if (userUpdate.error) {
      setProfileError(`Users update failed: ${userUpdate.error.message}`);
      setProfileSaving(false);
      return;
    }

    if (workerId) {
      const workerUpdate = await supabase
        .from("workers")
        .update({
          profession,
          hourly_rate_min: hourlyRate ? parseInt(hourlyRate, 10) : null,
        })
        .eq("id", workerId);

      if (workerUpdate.error) {
        setProfileError(`Workers update failed: ${workerUpdate.error.message}`);
        setProfileSaving(false);
        return;
      }
    }

    setProfileSuccess(true);
    setProfileSaving(false);
  }

  async function handleUpdateAccount() {
    setAccountSaving(true);
    setAccountError(null);
    setAccountSuccess(false);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setAccountError(error.message);
    } else {
      setAccountSuccess(true);
    }
    setAccountSaving(false);
  }

  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  }

  // ─────────────────────────────────────────────────────────────────────────

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar ?? undefined} alt="Profile" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" disabled>
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={profileSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    disabled={profileSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={profileSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    disabled={profileSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={profileSaving}
                    placeholder="City, State"
                  />
                </div>

                {profileError && (
                  <p className="text-sm text-destructive">{profileError}</p>
                )}
                {profileSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Profile saved successfully.
                  </p>
                )}

                <Button onClick={handleSaveProfile} disabled={profileSaving}>
                  {profileSaving ? "Saving…" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-32">
                      <Label>{day}</Label>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Select defaultValue="09:00">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select defaultValue="18:00">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Switch defaultChecked={day !== "Sunday"} />
                    </div>
                  </div>
                ))}

                <p className="text-sm text-muted-foreground mt-2">
                  Availability scheduling is coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="bookingRequests"
                      className="text-base font-medium"
                    >
                      Booking Requests
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new booking requests
                    </p>
                  </div>
                  <Switch
                    id="bookingRequests"
                    checked={notifications.bookingRequests}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        bookingRequests: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="messages" className="text-base font-medium">
                      Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch
                    id="messages"
                    checked={notifications.messages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reviews" className="text-base font-medium">
                      Reviews
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when customers leave reviews
                    </p>
                  </div>
                  <Switch
                    id="reviews"
                    checked={notifications.reviews}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, reviews: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="promotions"
                      className="text-base font-medium"
                    >
                      Promotions & Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        promotions: checked,
                      })
                    }
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Notification preferences are coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={accountSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      disabled
                      placeholder="Coming soon"
                    />
                  </div>

                  {accountError && (
                    <p className="text-sm text-destructive">{accountError}</p>
                  )}
                  {accountSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Email updated. Check your inbox to confirm the change.
                    </p>
                  )}

                  <Button onClick={handleUpdateAccount} disabled={accountSaving}>
                    {accountSaving ? "Saving…" : "Update Account"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={passwordSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={passwordSaving}
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Password changed successfully.
                    </p>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? "Saving…" : "Change Password"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button variant="destructive" disabled>
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
