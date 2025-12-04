import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MoreHorizontal, 
  UserPlus, 
  Plus, 
  Settings,
  Paperclip,
  Smile,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveChat } from "./ChatList";

interface ChatWindowProps {
  chat: LiveChat | null;
  onSendMessage: (message: string) => void;
}

export function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSend = () => {
    if (!replyMessage.trim()) return;
    onSendMessage(replyMessage);
    setReplyMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={chat.user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {chat.user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-sm text-foreground">{chat.user.name}</h2>
            <p className="text-[11px] text-muted-foreground">{chat.user.user_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {chat.messages.map((msg, index) => {
            const showSenderName = msg.sender === "user" && 
              (index === 0 || chat.messages[index - 1].sender !== "user");
            
            return (
              <div key={msg.id} className="space-y-1">
                {showSenderName && (
                  <span className="text-[11px] text-muted-foreground ml-12">
                    {msg.sender_name || chat.user.name}
                  </span>
                )}
                <div
                  className={cn(
                    "flex items-end gap-2",
                    msg.sender === "agent" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {chat.user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-xl px-3 py-2",
                      msg.sender === "agent"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{msg.message}</p>
                    {msg.image_url && (
                      <img 
                        src={msg.image_url} 
                        alt="Shared image" 
                        className="mt-2 rounded-lg max-w-full"
                      />
                    )}
                  </div>
                  {msg.sender === "agent" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        V
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                {msg.is_read && msg.sender === "agent" && (
                  <p className="text-[10px] text-muted-foreground text-right mr-10">
                    Read • {formatTime(msg.timestamp)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      {chat.status !== "closed" && (
        <div className="p-4 border-t border-border space-y-3">
          {/* Input Row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="pr-20 h-10 text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              size="sm" 
              disabled={!replyMessage.trim()}
              className="h-10 px-4"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground px-2">
              <Tag className="h-3 w-3" />
              Add tag
            </Button>
            {chat.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[11px] h-6"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
