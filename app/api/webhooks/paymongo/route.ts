import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export function GET() {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";
  return NextResponse.json({
    ok: true,
    webhook_secret_set: !!secret,
    // Shows first 15 chars only — enough to identify format without exposing the key
    secret_prefix: secret ? secret.slice(0, 15) + "…" : null,
    secret_mode: secret.startsWith("whsk_test_")
      ? "test"
      : secret.startsWith("whsk_live_")
        ? "live"
        : "unknown",
  });
}

const PLAN_DURATION_DAYS: Record<string, number> = {
  basic: 7,
  pro: 14,
  premium: 30,
};

function verifySignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  // PayMongo-Signature format: t=<timestamp>,te=<test_hmac>,li=<live_hmac>
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx > 0) {
      parts[part.slice(0, eqIdx)] = part.slice(eqIdx + 1);
    }
  }

  const timestamp = parts["t"];
  // Test secrets start with "whsk_test_", live secrets with "whsk_live_".
  const isTestSecret = secret.startsWith("whsk_test_");
  const hmacToVerify = isTestSecret ? parts["te"] : parts["li"];

  if (!timestamp || !hmacToVerify) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(hmacToVerify, "hex"),
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("paymongo-signature") ?? "";
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";

  if (!webhookSecret) {
    console.error("PAYMONGO_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  if (!verifySignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType =
    (event.data as Record<string, unknown>)?.attributes &&
    (
      (event.data as Record<string, unknown>).attributes as Record<
        string,
        unknown
      >
    ).type;

  if (eventType !== "checkout_session.payment.paid") {
    return NextResponse.json({ received: true });
  }

  const sessionData = (
    (event.data as Record<string, unknown>).attributes as Record<
      string,
      unknown
    >
  )?.data as Record<string, unknown> | undefined;

  const metadata = (sessionData?.attributes as Record<string, unknown>)
    ?.metadata as Record<string, string> | undefined;

  const checkoutId = (sessionData as Record<string, unknown>)?.id as
    | string
    | undefined;

  const supabase = createAdminClient();

  // Credit pack purchase
  if (metadata?.type === "credits") {
    const { user_id, credits_to_add, package: pkg } = metadata;

    if (!user_id || !credits_to_add) {
      console.error("PayMongo webhook: missing credits metadata", metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const amount = parseInt(credits_to_add, 10);
    if (!amount || amount <= 0) {
      console.error("PayMongo webhook: invalid credits_to_add", credits_to_add);
      return NextResponse.json(
        { error: "Invalid credits amount" },
        { status: 400 },
      );
    }

    const { error } = await supabase.rpc("add_user_credits", {
      p_user_id: user_id,
      p_amount: amount,
      p_type: "purchase",
      p_description: `${pkg ? pkg.charAt(0).toUpperCase() + pkg.slice(1) : "Credit"} pack — ${amount} credits`,
      p_reference_id: checkoutId ?? null,
    });

    if (error) {
      console.error("PayMongo webhook: add_user_credits error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  // Promoted listing purchase (default / legacy payloads with no type field)
  const { worker_id, plan } = metadata ?? {};

  if (!worker_id || !plan) {
    console.error("PayMongo webhook: missing metadata", metadata);
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const durationDays = PLAN_DURATION_DAYS[plan];
  if (!durationDays) {
    console.error("PayMongo webhook: unknown plan", plan);
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const { error } = await supabase.from("promoted_listings").insert({
    worker_id,
    plan,
    paymongo_checkout_id: checkoutId,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("PayMongo webhook: DB insert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
