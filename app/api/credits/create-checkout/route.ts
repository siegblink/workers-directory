import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CreditPackageId = "starter" | "popular" | "premium";

const CREDIT_PACKAGES: Record<
  CreditPackageId,
  { name: string; credits: number; bonus: number; amountCentavos: number }
> = {
  starter: {
    name: "Starter Pack",
    credits: 100,
    bonus: 0,
    amountCentavos: 10000,
  },
  popular: {
    name: "Popular Pack",
    credits: 500,
    bonus: 20,
    amountCentavos: 50000,
  },
  premium: {
    name: "Premium Pack",
    credits: 1000,
    bonus: 60,
    amountCentavos: 100000,
  },
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const packageId = body.package as CreditPackageId | undefined;
  const pkg = packageId ? CREDIT_PACKAGES[packageId] : undefined;

  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payment not configured" },
      { status: 500 },
    );
  }

  const totalCredits = pkg.credits + pkg.bonus;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const pmResponse = await fetch(
    "https://api.paymongo.com/v1/checkout_sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                currency: "PHP",
                amount: pkg.amountCentavos,
                name: pkg.name,
                description: `${totalCredits} credits${pkg.bonus > 0 ? ` (${pkg.credits} + ${pkg.bonus} bonus)` : ""}`,
                quantity: 1,
              },
            ],
            payment_method_types: ["gcash", "card", "paymaya", "grab_pay"],
            success_url: `${origin}/credits?success=true`,
            cancel_url: `${origin}/credits?canceled=true`,
            metadata: {
              user_id: user.id,
              type: "credits",
              package: packageId,
              credits_to_add: String(totalCredits),
            },
          },
        },
      }),
    },
  );

  if (!pmResponse.ok) {
    const err = await pmResponse.json().catch(() => ({}));
    console.error("PayMongo credits checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 502 },
    );
  }

  const session = await pmResponse.json();
  const checkoutUrl: string = session.data.attributes.checkout_url;
  const sessionId: string = session.data.id;

  return NextResponse.json({
    checkout_url: checkoutUrl,
    session_id: sessionId,
  });
}
