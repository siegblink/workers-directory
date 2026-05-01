import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import postgres from "postgres";

export function GET() {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";
  const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? "";

  let supabaseKeyRole = "unreadable";
  try {
    const payload = supabaseKey.split(".")[1] ?? "";
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    supabaseKeyRole = decoded.role ?? "no_role_claim";
  } catch {
    supabaseKeyRole = "decode_failed";
  }

  return NextResponse.json({
    ok: true,
    webhook_secret_set: !!secret,
    secret_prefix: secret ? secret.slice(0, 15) + "…" : null,
    supabase_key_role: supabaseKeyRole,
    supabase_key_length: supabaseKey.length,
    supabase_key_segments: supabaseKey.split(".").length,
    supabase_key_prefix: supabaseKey.slice(0, 10) + "…",
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

  // Credit pack purchase — uses a direct Postgres connection (POSTGRES_URL_NON_POOLING)
  // to bypass PostgREST role resolution. The new sb_secret_… key is not a JWT so
  // PostgREST falls back to anon; a direct connection has no such limitation.
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
    const dbUrl = process.env.POSTGRES_URL_NON_POOLING;

    if (!dbUrl) {
      console.error("PayMongo webhook: POSTGRES_URL_NON_POOLING not set");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const sql = postgres(dbUrl, { max: 1 });
    try {
      await sql.begin(async (tx) => {
        await tx`
          INSERT INTO public.user_credits (user_id, balance)
          VALUES (${user_id}, ${amount})
          ON CONFLICT (user_id) DO UPDATE
            SET balance     = public.user_credits.balance + ${amount},
                updated_at  = now()
        `;
        await tx`
          INSERT INTO public.user_credit_transactions
            (user_id, amount, type, description, reference_id)
          VALUES
            (${user_id}, ${amount}, 'purchase', ${description}, ${checkoutId ?? null})
        `;
      });
    } catch (e) {
      console.error("PayMongo webhook: credit write error:", e);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
      await sql.end();
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
