import type { NotificationEmailType } from "@/lib/email";

type Params = {
  type: NotificationEmailType;
  recipientId: string;
  actorName: string;
  bookingId?: string;
};

// Fire-and-forget from client components after a booking/message mutation.
export function fireNotificationEmail(params: Params) {
  fetch("/api/notify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).catch(() => {
    // intentionally swallowed — email is best-effort
  });
}
