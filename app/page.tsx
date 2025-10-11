import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Wrench, Zap, Droplet, Paintbrush } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/50 dark:to-background py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Find Trusted Service Workers Near You
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Connect with verified plumbers, electricians, cleaners, and more. Book services instantly.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 border-r border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="What service do you need?"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Your location"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button size="lg" className="md:w-auto">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Wrench, name: "Plumbing", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
              { icon: Zap, name: "Electrical", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
              { icon: Droplet, name: "Cleaning", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
              { icon: Paintbrush, name: "Painting", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            ].map((service) => (
              <Link
                key={service.name}
                href="/search"
                className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all bg-card"
              >
                <div className={`p-4 rounded-full ${service.color}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Service Worker?</h2>
          <p className="text-lg mb-8 text-blue-100 dark:text-blue-200">Join our platform and connect with customers in your area</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/become-worker">Become a Worker</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
