import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface ChatUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  local_time: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  sender_name?: string;
  message: string;
  timestamp: string;
  image_url?: string;
  is_read?: boolean;
}

export interface LiveChat {
  id: string;
  user: ChatUser;
  last_message: string;
  timestamp: string;
  status: "active" | "waiting" | "closed";
  unread_count: number;
  messages: ChatMessage[];
  tags: string[];
  source: string;
  chat_duration: string;
  is_first_visit: boolean;
  device: string;
  browser: string;
  groups: string[];
}

interface ChatListProps {
  chats: LiveChat[];
  selectedChat: LiveChat | null;
  onSelectChat: (chat: LiveChat) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ChatList({ 
  chats, 
  selectedChat, 
  onSelectChat,
  searchQuery,
  onSearchChange
}: ChatListProps) {
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest");

  const filteredChats = chats
    .filter(chat => 
      chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString("id-ID");
  };

  const handleTakeOver = (e: React.MouseEvent, chat: LiveChat) => {
    e.stopPropagation();
    onSelectChat(chat);
    console.log("Take over chat:", chat.id);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-foreground">
            My chats ({filteredChats.length})
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                {sortOrder === "oldest" ? "Oldest" : "Newest"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("oldest")} className="text-sm">
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("newest")} className="text-sm">
                Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "rounded-lg border border-border overflow-hidden transition-all",
                selectedChat?.id === chat.id && "bg-accent border-accent"
              )}
            >
              {/* Chat Item */}
              <div
                onClick={() => onSelectChat(chat)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={chat.user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {chat.user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-foreground truncate">
                      {chat.user.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {chat.last_message}
                  </p>
                </div>
              </div>
              
              {/* Take Over Button */}
              <div className="px-3 pb-3">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full h-8 text-xs font-medium"
                  onClick={(e) => handleTakeOver(e, chat)}
                >
                  Take Over
                </Button>
              </div>
            </div>
          ))}
          
          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No chats found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
