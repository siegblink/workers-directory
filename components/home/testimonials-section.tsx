import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Maria Santos",
    role: "Homeowner",
    rating: 5,
    quote:
      "Found a reliable plumber within minutes. The verification badges gave me confidence to book immediately — best experience I've had hiring for home repairs.",
  },
  {
    name: "Carlos Rivera",
    role: "Verified Electrician",
    rating: 5,
    quote:
      "Since joining Direktory, I've had consistent bookings every week. The platform makes it easy to showcase my certifications and build trust with new clients.",
  },
  {
    name: "Angela Cruz",
    role: "Business Owner",
    rating: 4,
    quote:
      "The worker verification system sets this apart from other platforms. I know every contractor I hire has been properly vetted and background-checked.",
  },
  {
    name: "James Tan",
    role: "Homeowner",
    rating: 5,
    quote:
      "Response times are incredible — I posted a request for an emergency pipe fix and had three verified workers respond in under 30 minutes.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear from homeowners and workers who rely on Direktory every day.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="h-full bg-white dark:bg-white/5 backdrop-blur-md border-neutral-200 dark:border-white/10 shadow-md shadow-neutral-200/50 dark:shadow-lg dark:shadow-black/5"
            >
              <CardContent className="flex flex-col h-full">
                {/* Decorative quote mark */}
                <span
                  className="text-7xl leading-none font-serif text-primary/20 dark:text-primary/25 select-none -mb-4"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="text-sm text-muted-foreground flex-1 mb-6">
                  {testimonial.quote}
                </p>

                {/* Author & rating */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.role}
                    </p>
                    {/* Star rating */}
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={`star-${testimonial.name}-${i}`}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
