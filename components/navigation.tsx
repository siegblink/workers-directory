"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Calendar,
  CreditCard,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DirectoriesMenu } from "@/components/directories-menu";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAnnouncement } from "@/contexts/announcement-context";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  firstname: string;
  lastname: string;
  profile_pic_url: string | null;
}

export function Navigation() {
  const { announcementHeight } = useAnnouncement();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const creditsBalance = 120;

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("firstname, lastname, profile_pic_url")
        .eq("id", userId)
        .single();

      // Silently handle errors - will fall back to user_metadata
      if (error) {
        // Database might not have profile data yet (before migration is applied)
        return;
      }

      // Only set profile if we have valid name data
      if (data?.firstname && data.lastname) {
        setProfile(data);
      }
      // If firstname/lastname are empty, component will fall back to user_metadata
    } catch {
      // Silently catch any errors - graceful degradation to user_metadata
      return;
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Fetch profile data if user is authenticated
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      // Fetch profile data when user logs in
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getUserInitials = () => {
    if (!user) return "U";

    // Try to get initials from profile data first
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`.toUpperCase();
    }

    // Fallback to user metadata
    const firstName = user.user_metadata?.first_name || "";
    const lastName = user.user_metadata?.last_name || "";
    return (
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const getUserFirstName = () => {
    // Try profile data first
    if (profile?.firstname) {
      return profile.firstname;
    }
    // Fallback to user metadata
    return user?.user_metadata?.first_name || "User";
  };

  const getUserFullName = () => {
    // Try profile data first
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    }
    // Fallback to user metadata
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email || "User";
  };

  const getUserAvatar = () => {
    // Return profile pic URL if available, otherwise null for fallback
    return profile?.profile_pic_url || null;
  };

  const isLoggedIn = !!user;

  return (
    <nav
      className="border-b bg-background sticky z-50 transition-all duration-300"
      style={{ top: `${announcementHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Directories Menu - Desktop Only */}
          <div className="ml-4 hidden lg:flex items-center gap-1">
            <DirectoriesMenu />
            <Button variant="ghost" asChild>
              <Link href="/trending">
                <TrendingUp />
                Trending
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/hot">
                <Flame />
                Hot
              </Link>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/messages">Messages</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getUserAvatar() || undefined}
                          alt={getUserFullName()}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{getUserFirstName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getUserFullName()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <LayoutDashboard />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings">
                          <Calendar />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/credits">
                          <CreditCard />
                          Credits
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      <LogOut />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden ml-auto lg:ml-0 flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn && (
                  <>
                    {/* User Profile Section */}
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getUserAvatar() || undefined}
                            alt={getUserFullName()}
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {getUserFullName()}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Trending & Hot Links */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/trending">
                      <TrendingUp />
                      Trending
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/hot">
                      <Flame />
                      Hot
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {isLoggedIn ? (
                  <>
                    {/* Account Section */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/credits">
                          <CreditCard />
                          {creditsBalance} credits
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages">
                          <MessageSquare />
                          Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <LayoutDashboard />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings">
                          <Calendar />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {/* Settings Section */}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Logout Section */}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      <LogOut />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
