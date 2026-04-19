import { NextResponse } from "next/server";
import * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNotificationEmail, type NotificationEmailType } from "@/lib/email";

const schema = z.object({
  type: z.enum([
    "booking_new",
    "booking_accepted",
    "booking_canceled",
    "booking_completed",
    "message_new",
  ]),
  recipientId: z.string().uuid(),
  actorName: z.string().min(1),
  bookingId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { type, recipientId, actorName, bookingId } = parsed.data;

  const admin = createAdminClient();

  const { data: authUser, error: authError } =
    await admin.auth.admin.getUserById(recipientId);
  if (authError || !authUser.user?.email) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  const { data: profile } = await admin
    .from("users")
    .select("firstname")
    .eq("id", recipientId)
    .maybeSingle();

  const recipientName = profile?.firstname ?? authUser.user.email.split("@")[0];

  try {
    await sendNotificationEmail({
      type: type as NotificationEmailType,
      recipientEmail: authUser.user.email,
      recipientName,
      actorName,
      bookingId,
    });
  } catch (err) {
    console.error("[notify-email] Resend error:", err);
    // Don't fail the request — email is best-effort
  }

  return NextResponse.json({ ok: true });
}
