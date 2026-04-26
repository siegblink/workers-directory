import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PLAN_DURATION_DAYS: Record<string, number> = {
  basic: 7,
  pro: 14,
  premium: 30,
};

function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
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
  // PayMongo always sends both te and li in the header; pick the one that
  // matches the type of secret we actually have.
  const isTestSecret = secret.startsWith("whsk_test_");
  const hmacToVerify = isTestSecret ? parts["te"] : parts["li"];

  if (!timestamp || !hmacToVerify) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(hmacToVerify, "hex"));
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
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
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

  const eventType = (event.data as Record<string, unknown>)?.attributes &&
    ((event.data as Record<string, unknown>).attributes as Record<string, unknown>).type;

  if (eventType !== "checkout_session.payment.paid") {
    return NextResponse.json({ received: true });
  }

  const sessionData = (
    (event.data as Record<string, unknown>).attributes as Record<string, unknown>
  )?.data as Record<string, unknown> | undefined;

  const metadata = (sessionData?.attributes as Record<string, unknown>)?.metadata as Record<string, string> | undefined;
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

  const supabase = createAdminClient();

  const { error } = await supabase.from("promoted_listings").insert({
    worker_id,
    plan,
    paymongo_checkout_id: (sessionData as Record<string, unknown>)?.id as string | undefined,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("PayMongo webhook: DB insert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
