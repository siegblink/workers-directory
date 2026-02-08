import { Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

export function SuggestionBoxSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-muted/20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Help Us Grow
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Don&apos;t see a service category you need? Suggest it and help shape
          the future of Direktory. Our community drives what we build next.
        </p>

        {/* Social proof pill */}
        <div className="flex justify-center mb-8">
          <Pill variant="emerald" size="lg">
            <Users />
            200+ Suggestions Received
          </Pill>
        </div>

        {/* CTA */}
        <Button asChild size="lg">
          <Link href="/suggest-jobs">Suggest a Job Category</Link>
        </Button>
      </div>
    </section>
  );
}
