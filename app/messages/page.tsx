"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockConversations = [
  {
    id: 1,
    name: "John Smith",
    profession: "Plumber",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "I can come by tomorrow at 2 PM",
    timestamp: "2m ago",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    profession: "Electrician",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "Thanks for booking! See you then.",
    timestamp: "1h ago",
    unread: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "Mike Davis",
    profession: "Cleaner",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "What time works best for you?",
    timestamp: "3h ago",
    unread: 1,
    isOnline: true,
  },
]

const mockMessages = [
  {
    id: 1,
    senderId: 2,
    text: "Hi! I saw your booking request. I'm available tomorrow.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    senderId: 1,
    text: "Great! What time works for you?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    senderId: 2,
    text: "I can come by at 2 PM. Does that work?",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    senderId: 1,
    text: "Perfect! I'll be home then. See you tomorrow at 2 PM.",
    timestamp: "10:36 AM",
    isOwn: true,
  },
  {
    id: 5,
    senderId: 2,
    text: "I can come by tomorrow at 2 PM",
    timestamp: "Just now",
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageText, setMessageText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message
      setMessageText("")
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-96 bg-card border-r border-border flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {mockConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex gap-3 hover:bg-accent transition-colors ${
                      selectedConversation.id === conversation.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                        <AvatarFallback>
                          {conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate text-foreground">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{conversation.profession}</p>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>

                    {conversation.unread > 0 && (
                      <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full">
                        {conversation.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col bg-card">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={selectedConversation.avatar || "/placeholder.svg"}
                      alt={selectedConversation.name}
                    />
                    <AvatarFallback>
                      {selectedConversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.isOnline ? "Online" : "Offline"} • {selectedConversation.profession}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}>
                      <Card
                        className={`p-3 ${
                          message.isOwn ? "bg-blue-600 dark:bg-blue-700 text-white" : "bg-secondary text-foreground"
                        } shadow-none border-0`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </Card>
                      <p className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? "text-right" : "text-left"}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <Card className="p-3 bg-secondary shadow-none border-0">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Show message when no conversation selected */}
          <div className="md:hidden flex-1 flex items-center justify-center bg-background">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    </div>
  )
}
