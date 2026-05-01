import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export function GET() {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";
  return NextResponse.json({
    ok: true,
    webhook_secret_set: !!secret,
    secret_prefix: secret ? secret.slice(0, 15) + "…" : null,
    supabase_url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_secret_key_set: !!process.env.SUPABASE_SECRET_KEY,
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
  // PayMongo webhook secrets don't carry a test/live prefix — try both slots.
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx > 0) {
      parts[part.slice(0, eqIdx)] = part.slice(eqIdx + 1);
    }
  }

  const timestamp = parts["t"];
  if (!timestamp) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  for (const slot of ["te", "li"]) {
    const candidate = parts[slot];
    if (!candidate) continue;
    try {
      if (
        timingSafeEqual(
          Buffer.from(expected, "hex"),
          Buffer.from(candidate, "hex"),
        )
      ) {
        return true;
      }
    } catch {
      // buffer length mismatch — not a match
    }
  }
  return false;
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

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (e) {
    console.error("PayMongo webhook: failed to init admin client:", e);
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  // Credit pack purchase — write directly to tables so we don't depend on
  // EXECUTE privilege on the add_user_credits function (service_role bypasses RLS).
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

    const description = `${pkg ? pkg.charAt(0).toUpperCase() + pkg.slice(1) : "Credit"} pack — ${amount} credits`;

    // Upsert balance row
    const { data: existing } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user_id)
      .maybeSingle();

    const balanceError = existing
      ? (
          await supabase
            .from("user_credits")
            .update({
              balance: existing.balance + amount,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user_id)
        ).error
      : (
          await supabase
            .from("user_credits")
            .insert({ user_id, balance: amount })
        ).error;

    if (balanceError) {
      console.error(
        "PayMongo webhook: user_credits upsert error:",
        balanceError,
      );
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Append transaction log
    const { error: txError } = await supabase
      .from("user_credit_transactions")
      .insert({
        user_id,
        amount,
        type: "purchase",
        description,
        reference_id: checkoutId ?? null,
      });

    if (txError) {
      console.error("PayMongo webhook: transaction insert error:", txError);
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
