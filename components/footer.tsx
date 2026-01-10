"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { USER_ROLES } from "@/lib/constants";

export function Footer() {
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userData) {
          setUserRole(userData.role);
        }
      }
    };

    getUserRole();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Logo variant="inverted" className="mb-4" />
            <p className="text-sm leading-relaxed">
              Connecting trusted service workers with customers for all your
              home and business needs.
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              For Customers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/search"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Find Workers
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/credits"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Buy Credits
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              For Workers
            </h3>
            <ul className="space-y-2 text-sm">
              {/* Only show "Become a Worker" if user is not already a worker */}
              {userRole !== USER_ROLES.WORKER && (
                <li>
                  <Link
                    href="/become-worker"
                    className="hover:text-primary-foreground/80 transition-colors"
                  >
                    Become a Worker
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/promote"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Promote Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Worker Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-primary-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-foreground/80 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2025 Direktory. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
