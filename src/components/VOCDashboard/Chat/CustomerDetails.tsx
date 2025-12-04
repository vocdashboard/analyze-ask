import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Globe, 
  Monitor,
  Settings,
  X
} from "lucide-react";
import { LiveChat } from "./ChatList";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface CustomerDetailsProps {
  chat: LiveChat | null;
  onClose?: () => void;
}

export function CustomerDetails({ chat, onClose }: CustomerDetailsProps) {
  const [openSections, setOpenSections] = useState({
    additionalInfo: true,
    technology: false,
    copilot: false,
    whatsapp: false,
    messenger: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center bg-card h-full">
        <p className="text-xs text-muted-foreground">Select a chat to view details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-medium text-sm text-foreground">Customer Details</span>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {/* Profile Section */}
        <div className="p-5 text-center border-b border-border">
          <Avatar className="h-14 w-14 mx-auto mb-3">
            <AvatarImage src={chat.user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-base font-medium">
              {chat.user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-sm text-foreground">{chat.user.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{chat.user.email}</p>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" />
            {chat.user.location}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {chat.user.local_time}
          </div>
        </div>

        {/* Additional Info */}
        <Collapsible 
          open={openSections.additionalInfo} 
          onOpenChange={() => toggleSection('additionalInfo')}
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent transition-colors">
              <span className="font-medium text-xs text-foreground">Additional info</span>
              {openSections.additionalInfo ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">First-time visitor:</span>
              <span className="text-foreground">{chat.is_first_visit ? "Yes, no chats" : "No"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Came from:</span>
              <span className="text-foreground">{chat.source}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Chat duration:</span>
              <span className="text-foreground">{chat.chat_duration}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">Groups:</span>
              <div className="flex gap-1">
                {chat.groups.map(group => (
                  <Badge 
                    key={group} 
                    variant="secondary" 
                    className="text-[10px] h-5"
                  >
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Technology */}
        <Collapsible 
          open={openSections.technology} 
          onOpenChange={() => toggleSection('technology')}
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-t border-border">
              <span className="font-medium text-xs text-foreground">Technology</span>
              {openSections.technology ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">OS/Device:</span>
              <span className="flex items-center gap-1 text-foreground">
                <Monitor className="h-3 w-3" />
                {chat.device}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Browser:</span>
              <span className="flex items-center gap-1 text-foreground">
                <Globe className="h-3 w-3" />
                {chat.browser}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Copilot */}
        <Collapsible 
          open={openSections.copilot} 
          onOpenChange={() => toggleSection('copilot')}
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-t border-border">
              <span className="font-medium text-xs text-foreground">Copilot</span>
              {openSections.copilot ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Import public sources to get instant reply suggestions.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Add source
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* WhatsApp Business */}
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-t border-border">
          <span className="font-medium text-xs text-foreground">WhatsApp Business</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Facebook Messenger */}
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-t border-border">
          <span className="font-medium text-xs text-foreground">Facebook Messenger</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </ScrollArea>
    </div>
  );
}
