"use client";

import { format } from "date-fns";
import { AlertCircle, CalendarIcon, Clock } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseClient } from "@/lib/database/base-query";
import { fireNotificationEmail } from "@/lib/notify";

type Category = {
  id: string;
  name: string;
};

type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: string;
  workerName: string;
  workerProfession: string;
  hourlyRate: number;
};

export function BookingModal({
  open,
  onOpenChange,
  workerId,
  workerName,
  workerProfession,
  hourlyRate,
}: BookingModalProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !workerId) return;

    setLoadingCategories(true);
    const supabase = getSupabaseClient();

    async function fetchCategories() {
      const { data: wc } = await supabase
        .from("workers_categories")
        .select("category_id")
        .eq("worker_id", workerId);

      if (!wc?.length) {
        setLoadingCategories(false);
        return;
      }

      const categoryIds = wc.map((w) => w.category_id);
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds);

      if (cats) {
        const parsed = cats.map((c) => ({ id: String(c.id), name: c.name ?? "Unknown" }));
        setCategories(parsed);
        if (parsed.length > 0) setCategoryId(parsed[0].id);
      }
      setLoadingCategories(false);
    }

    fetchCategories();
  }, [open, workerId]);

  function resetForm() {
    setDate(undefined);
    setTime("");
    setDescription("");
    setCategoryId("");
    setCategories([]);
    setError(null);
    setSubmitting(false);
  }

  function handleOpenChange(value: boolean) {
    if (!value) resetForm();
    onOpenChange(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("bookings")
      .insert({
        customer_id: user.id,
        worker_id: workerId,
        ...(categoryId ? { category_id: categoryId } : {}),
        description: description.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      setError("Failed to create booking. Please try again.");
      setSubmitting(false);
      return;
    }

    // Resolve worker auth UUID then fire email notification (best-effort)
    const { data: workerRow } = await supabase
      .from("workers")
      .select("user_id")
      .eq("id", workerId)
      .maybeSingle();
    if (workerRow?.user_id) {
      const actorName =
        [user.user_metadata?.first_name, user.user_metadata?.last_name]
          .filter(Boolean)
          .join(" ") || user.email?.split("@")[0] || "A customer";
      fireNotificationEmail({
        type: "booking_new",
        recipientId: workerRow.user_id,
        actorName,
        bookingId: inserted.id,
      });
    }

    handleOpenChange(false);
    router.push("/bookings");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {workerName}</DialogTitle>
          <DialogDescription>
            {workerProfession} • ₱{hourlyRate}/hour
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No service categories listed for this worker.
              </p>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId} disabled={submitting}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                  disabled={submitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time</Label>
            <Select value={time} onValueChange={setTime} disabled={submitting}>
              <SelectTrigger id="time">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time" />
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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you need help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={submitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 bg-transparent"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner className="mr-2" />
                  Sending Request...
                </>
              ) : (
                "Send Booking Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
