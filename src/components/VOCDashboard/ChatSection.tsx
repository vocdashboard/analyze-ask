import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatList, ChatWindow, CustomerDetails, LiveChat } from "./Chat";
import { supabase } from "@/integrations/supabase/client";

export function ChatSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<LiveChat | null>(null);
  const [chats, setChats] = useState<LiveChat[]>([]);

  // Load initial data
  useEffect(() => {
    const loadChats = async () => {
      const { data: sessions, error } = await supabase
        .from('livechat_sessions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        return;
      }

      if (!sessions) return;

      // Load messages for each session
      const chatsWithMessages = await Promise.all(
        sessions.map(async (session) => {
          const { data: messages } = await supabase
            .from('livechat_messages')
            .select('*')
            .eq('session_id', session.id)
            .order('timestamp', { ascending: true });

          return {
            id: session.id,
            user: {
              id: session.user_id,
              user_id: session.user_id,
              name: session.user_name,
              email: session.user_email || '',
              location: session.location || '',
              local_time: session.local_time || '',
            },
            last_message: session.last_message || '',
            timestamp: session.timestamp,
            status: session.status as 'active' | 'waiting' | 'closed',
            unread_count: session.unread_count || 0,
            tags: session.tags || [],
            source: session.source || '',
            chat_duration: session.chat_duration || '',
            is_first_visit: session.is_first_visit || false,
            device: session.device || '',
            browser: session.browser || '',
            groups: session.groups || [],
            messages: messages?.map(msg => ({
              id: msg.id,
              sender: msg.sender as 'user' | 'agent',
              sender_name: msg.sender_name,
              message: msg.message,
              timestamp: msg.timestamp,
              is_read: msg.is_read,
            })) || [],
          } as LiveChat;
        })
      );

      setChats(chatsWithMessages);
    };

    loadChats();
  }, []);

  // Realtime listener for sessions
  useEffect(() => {
    const channel = supabase
      .channel('livechat_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'livechat_sessions'
        },
        async (payload) => {
          console.log('Session change:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const session = payload.new as any;
            
            // Load messages for this session
            const { data: messages } = await supabase
              .from('livechat_messages')
              .select('*')
              .eq('session_id', session.id)
              .order('timestamp', { ascending: true });

            const updatedChat: LiveChat = {
              id: session.id,
              user: {
                id: session.user_id,
                user_id: session.user_id,
                name: session.user_name,
                email: session.user_email || '',
                location: session.location || '',
                local_time: session.local_time || '',
              },
              last_message: session.last_message || '',
              timestamp: session.timestamp,
              status: session.status as 'active' | 'waiting' | 'closed',
              unread_count: session.unread_count || 0,
              tags: session.tags || [],
              source: session.source || '',
              chat_duration: session.chat_duration || '',
              is_first_visit: session.is_first_visit || false,
              device: session.device || '',
              browser: session.browser || '',
              groups: session.groups || [],
              messages: messages?.map(msg => ({
                id: msg.id,
                sender: msg.sender as 'user' | 'agent',
                sender_name: msg.sender_name,
                message: msg.message,
                timestamp: msg.timestamp,
                is_read: msg.is_read,
              })) || [],
            };

            setChats(prev => {
              const index = prev.findIndex(c => c.id === session.id);
              if (index >= 0) {
                const updated = [...prev];
                updated[index] = updatedChat;
                return updated;
              }
              return [updatedChat, ...prev];
            });

            // Update selected chat if it's the one being updated
            if (selectedChat?.id === session.id) {
              setSelectedChat(updatedChat);
            }
          } else if (payload.eventType === 'DELETE') {
            setChats(prev => prev.filter(c => c.id !== payload.old.id));
            if (selectedChat?.id === payload.old.id) {
              setSelectedChat(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  // Realtime listener for messages
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel('livechat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'livechat_messages',
          filter: `session_id=eq.${selectedChat.id}`
        },
        (payload) => {
          console.log('New message:', payload);
          const newMsg = payload.new as any;

          const message = {
            id: newMsg.id,
            sender: newMsg.sender as 'user' | 'agent',
            sender_name: newMsg.sender_name,
            message: newMsg.message,
            timestamp: newMsg.timestamp,
            is_read: newMsg.is_read,
          };

          // Add to selected chat
          setSelectedChat(prev => {
            if (!prev || prev.id !== selectedChat.id) return prev;
            return {
              ...prev,
              messages: [...prev.messages, message],
              last_message: newMsg.message,
            };
          });

          // Update in chats list
          setChats(prev => prev.map(chat => {
            if (chat.id === selectedChat.id) {
              return {
                ...chat,
                messages: [...chat.messages, message],
                last_message: newMsg.message,
              };
            }
            return chat;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const handleSendMessage = (message: string) => {
    if (!selectedChat) return;
    // TODO: Integrate with API to send message
    console.log("Sending message:", message, "to chat:", selectedChat.id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-0 overflow-hidden">
        <div className="flex h-[calc(100vh-180px)]">
          {/* Left Panel - Chat List */}
          <div className="w-72 flex-shrink-0 border-r border-border">
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Middle Panel - Chat Window */}
          <div className="flex-1 border-r border-border">
            <ChatWindow
              chat={selectedChat}
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Right Panel - Customer Details */}
          <div className="w-72 flex-shrink-0">
            <CustomerDetails chat={selectedChat} />
          </div>
        </div>
      </Card>
    </div>
  );
}
