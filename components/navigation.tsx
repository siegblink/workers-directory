"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

export function Navigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const creditsBalance = 120;

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.user_metadata?.first_name || "";
    const lastName = user.user_metadata?.last_name || "";
    return (
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const isLoggedIn = !!user;

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl text-foreground">WorkerDir</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Find Workers
            </Link>
            <Link
              href="/become-worker"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Become a Worker
            </Link>

            <ThemeToggle />

            {isLoggedIn ? (
              <>
                <Link href="/messages">
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/credits">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold">{creditsBalance}</span>
                    <span className="text-muted-foreground">credits</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="User"
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Worker Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/bookings"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/credits" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Credits
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2 flex items-center gap-2">
                <span className="text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                href="/search"
                className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
              >
                Find Workers
              </Link>
              <Link
                href="/become-worker"
                className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
              >
                Become a Worker
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/credits"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{creditsBalance} credits</span>
                  </Link>
                  <Link
                    href="/messages"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    Worker Dashboard
                  </Link>
                  <Link
                    href="/bookings"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/settings"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 hover:bg-accent rounded text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-muted-foreground hover:bg-accent rounded"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
