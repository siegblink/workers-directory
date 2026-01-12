"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { directories } from "@/lib/constants/directories";
import { cn } from "@/lib/utils";

export function DirectoriesMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Directories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-5 gap-4 p-4 w-[800px]">
              {directories.map((directory) => (
                <NavigationMenuLink key={directory.id} asChild>
                  <Link
                    href={directory.href}
                    className={cn(
                      "group/item block rounded-lg p-4",
                      "transition-all duration-200 ease-out",
                      "hover:bg-accent/50",
                      directory.isComingSoon
                        ? "opacity-60 cursor-not-allowed"
                        : "",
                    )}
                    onClick={(e) =>
                      directory.isComingSoon && e.preventDefault()
                    }
                    aria-disabled={directory.isComingSoon}
                  >
                    {/* Icon Container */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                        directory.bgColor,
                        "ring-1 ring-white/10",
                        "transition-all duration-200",
                        !directory.isComingSoon &&
                          "group-hover/item:ring-white/20 group-hover/item:scale-105",
                      )}
                    >
                      <directory.icon
                        className={cn("w-6 h-6", directory.iconColor)}
                      />
                    </div>
                    {/* Label */}
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {directory.label}
                    </h3>

                    {/* Description */}
                    {directory.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {directory.description}
                      </p>
                    )}

                    {/* Coming Soon Badge */}
                    {directory.isComingSoon && (
                      <span className="text-center inline-block mt-2 px-2 py-1 text-[10px] font-medium rounded-full bg-destructive/10 text-destructive">
                        Coming Soon
                      </span>
                    )}
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
