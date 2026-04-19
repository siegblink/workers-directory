import { Resend } from "resend";

export type NotificationEmailType =
  | "booking_new"
  | "booking_accepted"
  | "booking_canceled"
  | "booking_completed"
  | "message_new";

type EmailParams = {
  recipientEmail: string;
  recipientName: string;
  actorName: string;
  type: NotificationEmailType;
  bookingId?: string;
};

const APP_NAME = "Direktory";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://direktory.app";

function buildEmailContent(params: EmailParams): {
  subject: string;
  html: string;
} {
  const { type, recipientName, actorName, bookingId } = params;
  const bookingUrl = bookingId ? `${APP_URL}/bookings/${bookingId}` : null;

  const configs: Record<
    NotificationEmailType,
    { subject: string; heading: string; body: string; cta?: string; ctaUrl?: string }
  > = {
    booking_new: {
      subject: "You have a new booking request",
      heading: "New Booking Request",
      body: `<strong>${actorName}</strong> has sent you a new booking request. Head to your dashboard to accept or decline.`,
      cta: "View Dashboard",
      ctaUrl: `${APP_URL}/dashboard?tab=pending`,
    },
    booking_accepted: {
      subject: "Your booking has been accepted",
      heading: "Booking Accepted",
      body: `Good news! <strong>${actorName}</strong> has accepted your booking request.`,
      cta: "View Booking",
      ctaUrl: bookingUrl ?? `${APP_URL}/bookings`,
    },
    booking_canceled: {
      subject: "Your booking has been cancelled",
      heading: "Booking Cancelled",
      body: `Your booking has been cancelled.`,
      cta: "View Booking",
      ctaUrl: bookingUrl ?? `${APP_URL}/bookings`,
    },
    booking_completed: {
      subject: "Your booking has been completed",
      heading: "Booking Completed",
      body: `<strong>${actorName}</strong> has marked your booking as completed. We hope the service was great!`,
      cta: "Leave a Review",
      ctaUrl: bookingUrl ?? `${APP_URL}/bookings`,
    },
    message_new: {
      subject: `New message from ${actorName}`,
      heading: "New Message",
      body: `<strong>${actorName}</strong> sent you a message on ${APP_NAME}.`,
      cta: "Reply Now",
      ctaUrl: `${APP_URL}/messages`,
    },
  };

  const { subject, heading, body, cta, ctaUrl } = configs[type];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <!-- Header -->
        <tr><td style="background:#18181b;padding:24px 32px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">${APP_NAME}</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">${heading}</h1>
          <p style="margin:0 0 4px;font-size:15px;color:#71717a;">Hi ${recipientName},</p>
          <p style="margin:16px 0 24px;font-size:15px;color:#3f3f46;line-height:1.6;">${body}</p>
          ${
            cta && ctaUrl
              ? `<a href="${ctaUrl}" style="display:inline-block;background:#18181b;color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">${cta}</a>`
              : ""
          }
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #f4f4f5;">
          <p style="margin:0;font-size:12px;color:#a1a1aa;">You received this email because you have an account on ${APP_NAME}. <a href="${APP_URL}" style="color:#71717a;">Visit site</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}

export async function sendNotificationEmail(params: EmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const resend = new Resend(apiKey);
  const { subject, html } = buildEmailContent(params);

  // Use plain address for onboarding@resend.dev; custom domains can use display name.
  const from = fromEmail.includes("resend.dev")
    ? fromEmail
    : `${APP_NAME} <${fromEmail}>`;

  const { data, error } = await resend.emails.send({
    from,
    to: params.recipientEmail,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}
