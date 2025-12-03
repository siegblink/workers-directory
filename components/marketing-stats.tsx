"use client";

import { CheckCircle, Star, Users, Zap } from "lucide-react";
import { Pill } from "@/components/ui/pill";

export function MarketingStats() {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
      <Pill variant="emerald" size="lg">
        <Users />
        10k+ Workers
      </Pill>
      <Pill variant="sky" size="lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
        </span>
        500+ Online Now
      </Pill>
      <Pill variant="amber" size="lg">
        <CheckCircle />
        50k+ Jobs Done
      </Pill>
      <Pill variant="violet" size="lg">
        <Star className="fill-current" />
        4.8 Avg Rating
      </Pill>
      <Pill variant="rose" size="lg">
        <Zap className="fill-current" />
        &lt;30 min Response
      </Pill>
    </div>
  );
}
