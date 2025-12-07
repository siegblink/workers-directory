"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  type ProfileAvailabilityFormValues,
  profileAvailabilitySchema,
} from "@/lib/schemas/profile";
import { EditSectionWrapper } from "./edit-section-wrapper";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const TIME_OPTIONS = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

function parseAvailability(value: string): {
  start: string;
  end: string;
  closed: boolean;
} {
  if (value === "Closed") {
    return { start: "9:00 AM", end: "5:00 PM", closed: true };
  }
  const parts = value.split(" - ");
  if (parts.length === 2) {
    return { start: parts[0], end: parts[1], closed: false };
  }
  return { start: "9:00 AM", end: "5:00 PM", closed: false };
}

function formatAvailability(
  start: string,
  end: string,
  closed: boolean,
): string {
  if (closed) return "Closed";
  return `${start} - ${end}`;
}

interface ProfileAvailabilityProps {
  availability: Record<string, string>;
  onSave: (data: ProfileAvailabilityFormValues) => Promise<void>;
}

export function ProfileAvailability({
  availability,
  onSave,
}: ProfileAvailabilityProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<
    Record<string, { start: string; end: string; closed: boolean }>
  >(() => {
    const initial: Record<
      string,
      { start: string; end: string; closed: boolean }
    > = {};
    for (const day of DAYS) {
      initial[day] = parseAvailability(availability[day] || "Closed");
    }
    return initial;
  });

  const form = useForm<ProfileAvailabilityFormValues>({
    resolver: zodResolver(profileAvailabilitySchema),
    defaultValues: availability as ProfileAvailabilityFormValues,
  });

  const handleEdit = () => {
    const newEditState: Record<
      string,
      { start: string; end: string; closed: boolean }
    > = {};
    for (const day of DAYS) {
      newEditState[day] = parseAvailability(availability[day] || "Closed");
    }
    setEditState(newEditState);
    form.reset(availability as ProfileAvailabilityFormValues);
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset(availability as ProfileAvailabilityFormValues);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const values: ProfileAvailabilityFormValues =
      {} as ProfileAvailabilityFormValues;
    for (const day of DAYS) {
      const { start, end, closed } = editState[day];
      values[day] = formatAvailability(start, end, closed);
    }
    form.reset(values);
    await onSave(values);
    setIsEditing(false);
  };

  const updateDayState = (
    day: string,
    field: "start" | "end" | "closed",
    value: string | boolean,
  ) => {
    setEditState((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <EditSectionWrapper
      title="Weekly Availability"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSave={handleSave}
      isSaving={form.formState.isSubmitting}
    >
      <div className="space-y-3">
        {DAYS.map((day) => {
          const dayState = editState[day];
          const displayValue = availability[day] || "Closed";

          return (
            <div
              key={day}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <span className="font-medium capitalize text-foreground">
                {day}
              </span>

              {isEditing ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={dayState.start}
                      onValueChange={(value) =>
                        updateDayState(day, "start", value)
                      }
                      disabled={dayState.closed || form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-[110px]" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-muted-foreground text-sm">to</span>

                    <Select
                      value={dayState.end}
                      onValueChange={(value) =>
                        updateDayState(day, "end", value)
                      }
                      disabled={dayState.closed || form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-[110px]" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!dayState.closed}
                      onCheckedChange={(checked) =>
                        updateDayState(day, "closed", !checked)
                      }
                      disabled={form.formState.isSubmitting}
                    />
                    <span className="text-sm text-muted-foreground w-14">
                      {dayState.closed ? "Closed" : "Open"}
                    </span>
                  </div>
                </div>
              ) : (
                <span
                  className={
                    displayValue === "Closed"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }
                >
                  {displayValue}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </EditSectionWrapper>
  );
}
