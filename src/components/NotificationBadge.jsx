import React from "react";
import { supabase } from "@/components/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NotificationBadge() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
    retry: false,
  });

  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ['unreadCount', user?.email],
    queryFn: async () => {
      if (!user?.email) return 0;
      
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_email', user.email)
        .eq('is_read', false);
        
      const { data: chatMessages, error: chatError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('receiver_email', user.email)
        .eq('is_read', false);

      if (msgError && msgError.code !== 'PGRST116') console.error(msgError);
      if (chatError) console.error(chatError);

      return (messages?.length || 0) + (chatMessages?.length || 0);
    },
    enabled: !!user?.email,
    refetchInterval: 30000,
  });

  if (unreadMessages === 0) return null;

  return (
    <div className="relative inline-flex">
      <Bell className="w-5 h-5" />
      <Badge className="absolute -top-2 -left-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
        {unreadMessages > 9 ? '9+' : unreadMessages}
      </Badge>
    </div>
  );
}