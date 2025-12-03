"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "default" | "small";
  className?: string;
}

export function Logo({ size = "default", className }: LogoProps) {
  const iconSize = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const iconClass = size === "small" ? "w-4 h-4" : "w-5 h-5";
  const textSize = size === "small" ? "text-lg" : "text-base lg:text-xl";

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-80",
        className,
      )}
    >
      <div
        className={cn(
          "bg-primary rounded-lg flex items-center justify-center",
          iconSize,
        )}
      >
        <BookOpen className={cn("text-primary-foreground", iconClass)} />
      </div>
      <span className={cn("font-bold text-foreground", textSize)}>
        Direktory
      </span>
    </Link>
  );
}
