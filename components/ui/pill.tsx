import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center rounded-full font-medium whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary/10 text-primary",
        success:
          "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
        error: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
        emerald:
          "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20",
        amber:
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        violet:
          "bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20",
        rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        teal: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20",
      },
      size: {
        sm: "text-xs px-2 py-0.5 gap-1 [&>svg]:size-3",
        default: "text-sm px-3 py-1 gap-1.5 [&>svg]:size-3.5",
        lg: "text-sm px-3 py-1.5 gap-1.5 [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface PillProps
  extends React.ComponentProps<"span">, VariantProps<typeof pillVariants> {
  asChild?: boolean;
  dot?: boolean;
}

function Pill({
  className,
  variant,
  size,
  asChild = false,
  dot = false,
  children,
  ...props
}: PillProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="pill"
      className={cn(pillVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span className="text-xs leading-none" aria-hidden="true">
          ●
        </span>
      )}
      {children}
    </Comp>
  );
}

export { Pill, pillVariants };
