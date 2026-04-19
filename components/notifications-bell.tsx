"use client";

import {
  Bell,
  BellRing,
  Calendar,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type AppNotification,
  useNotifications,
} from "@/hooks/use-notifications";

function notificationIcon(type: string) {
  if (type.startsWith("booking_"))
    return <Calendar className="size-4 shrink-0 text-muted-foreground" />;
  if (type === "message_new")
    return <MessageSquare className="size-4 shrink-0 text-muted-foreground" />;
  return <Bell className="size-4 shrink-0 text-muted-foreground" />;
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type Props = {
  userId: string;
};

export function NotificationsBell({ userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(userId);

  function handleClickNotification(n: AppNotification) {
    if (n.status === "delivered") markRead(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="size-5" />
          ) : (
            <Bell className="size-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={markAllRead}
            >
              <CheckCheck className="size-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClickNotification(n)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                  n.status === "delivered"
                    ? "bg-blue-50/40 dark:bg-blue-950/20"
                    : ""
                }`}
              >
                <div className="mt-0.5">{notificationIcon(n.type)}</div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm leading-snug ${
                      n.status === "delivered"
                        ? "font-semibold text-foreground"
                        : "font-normal text-muted-foreground"
                    }`}
                  >
                    {n.title}
                  </p>
                  {n.message && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {n.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
                {n.status === "delivered" && (
                  <div className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
