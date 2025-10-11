import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="font-bold text-xl text-white">WorkerDir</span>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting trusted service workers with customers for all your home and business needs.
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/credits" className="hover:text-white transition-colors">
                  Buy Credits
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/become-worker" className="hover:text-white transition-colors">
                  Become a Worker
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Worker Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/promote" className="hover:text-white transition-colors">
                  Promote Profile
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Worker Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2025 WorkerDir. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
