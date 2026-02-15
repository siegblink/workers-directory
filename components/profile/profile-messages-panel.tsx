"use client";

import Link from "next/link";
import type { Conversation } from "@/components/profile/profile-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileMessagesPanelProps = {
  conversations: Conversation[];
};

export function ProfileMessagesPanel({
  conversations,
}: ProfileMessagesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Messages</CardTitle>
          {conversations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/messages">View all messages</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No messages yet.
            </p>
          ) : (
            conversations.slice(0, 5).map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full">
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                    />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {conversation.name}
                      </h3>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conversation.profession}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/messages">View</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
