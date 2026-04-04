import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Support",
};

export default function ContactSupportPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <p className="text-8xl font-bold text-muted-foreground mb-4">🛠️</p>
      <h1 className="text-2xl font-semibold mb-2">Coming soon</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Our support page is under construction. Check back soon.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
