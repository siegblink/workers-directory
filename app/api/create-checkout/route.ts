import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Plan = "basic" | "pro" | "premium";

const PLANS: Record<Plan, { name: string; amountCentavos: number; durationDays: number; description: string }> = {
  basic: {
    name: "Basic Boost",
    amountCentavos: 4900,
    durationDays: 7,
    description: "7-day profile boost — top 10 placement in search results",
  },
  pro: {
    name: "Pro Boost",
    amountCentavos: 8900,
    durationDays: 14,
    description: "14-day profile boost — top 5 placement in search results",
  },
  premium: {
    name: "Premium Boost",
    amountCentavos: 14900,
    durationDays: 30,
    description: "30-day profile boost — top 3 placement in search results",
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

  const { data: worker } = await supabase
    .from("workers")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!worker) {
    return NextResponse.json({ error: "Worker profile not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body.plan as Plan | undefined;
  const planConfig = plan ? PLANS[plan] : undefined;

  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const pmResponse = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
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
              amount: planConfig.amountCentavos,
              description: planConfig.description,
              name: planConfig.name,
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash", "card", "paymaya", "grab_pay"],
          success_url: `${origin}/dashboard/promote?success=true`,
          cancel_url: `${origin}/dashboard/promote?canceled=true`,
          metadata: {
            worker_id: worker.id,
            plan,
          },
        },
      },
    }),
  });

  if (!pmResponse.ok) {
    const err = await pmResponse.json().catch(() => ({}));
    console.error("PayMongo create-checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 502 });
  }

  const session = await pmResponse.json();
  const checkoutUrl: string = session.data.attributes.checkout_url;
  const sessionId: string = session.data.id;

  return NextResponse.json({ checkout_url: checkoutUrl, session_id: sessionId });
}
