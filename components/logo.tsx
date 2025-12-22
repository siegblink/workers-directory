"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "default" | "small";
  variant?: "default" | "inverted";
  className?: string;
}

export function Logo({
  size = "default",
  variant = "default",
  className,
}: LogoProps) {
  const iconSize = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const iconClass = size === "small" ? "w-4 h-4" : "w-5 h-5";
  const textSize = size === "small" ? "text-lg" : "text-base lg:text-xl";

  // Color scheme based on variant
  const containerBg = variant === "inverted" ? "bg-white" : "bg-primary";
  const iconColor =
    variant === "inverted" ? "text-primary" : "text-primary-foreground";
  const textColor =
    variant === "inverted" ? "text-primary-foreground" : "text-foreground";

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
          "rounded-lg flex items-center justify-center",
          containerBg,
          iconSize,
        )}
      >
        <BookOpen className={cn(iconColor, iconClass)} />
      </div>
      <span className={cn("font-bold", textColor, textSize)}>Direktory</span>
    </Link>
  );
}
