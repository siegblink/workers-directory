"use client";

import { Card, CardContent } from "@/components/ui/card";

interface WorkerAvailabilityProps {
  availability: {
    [day: string]: string;
  };
}

export function WorkerAvailability({ availability }: WorkerAvailabilityProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Weekly Availability
        </h3>
        <div className="space-y-3">
          {Object.entries(availability).map(([day, hours]) => (
            <div
              key={day}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <span className="font-medium capitalize text-foreground">
                {day}
              </span>
              <span
                className={
                  hours === "Closed"
                    ? "text-muted-foreground"
                    : "text-foreground"
                }
              >
                {hours}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
