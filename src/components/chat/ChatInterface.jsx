import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // جلب المحادثات من الرسائل
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      // جلب كل الرسائل الخاصة بالمستخدم
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`)
        .is('group_id', null)
        .order('created_at', { ascending: false });

      if (!messages || messages.length === 0) return [];

      // تجميع المحادثات حسب المستخدم الآخر
      const conversationsMap = new Map();

      messages.forEach(msg => {
        const otherUserEmail = msg.sender_email === user.email 
          ? msg.receiver_email 
          : msg.sender_email;

        if (!conversationsMap.has(otherUserEmail)) {
          conversationsMap.set(otherUserEmail, {
            email: otherUserEmail,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unread: msg.receiver_email === user.email && !msg.is_read ? 1 : 0
          });
        } else {
          // تحديث عدد الرسائل غير المقروءة
          const conv = conversationsMap.get(otherUserEmail);
          if (msg.receiver_email === user.email && !msg.is_read) {
            conv.unread += 1;
          }
        }
      });

      // جلب أسماء المستخدمين
      const emails = Array.from(conversationsMap.keys());
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('email, full_name')
        .in('email', emails);

      // دمج البيانات
      const conversationsArray = Array.from(conversationsMap.values()).map(conv => {
        const profile = profiles?.find(p => p.email === conv.email);
        return {
          ...conv,
          name: profile?.full_name || conv.email.split('@')[0],
          time: formatTime(conv.lastMessageTime)
        };
      });

      return conversationsArray;
    },
    enabled: !!user?.email,
    
  });

  // فلترة المحادثات حسب البحث
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // تنسيق الوقت
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-KW', { month: 'short', day: 'numeric' });
    }
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center m-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-sm overflow-hidden m-4 border">
      {/* Sidebar */}
      <div className="w-80 border-l bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="بحث في المحادثات..." 
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات بعد'}
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div 
                key={conv.email}
                onClick={() => setSelectedUser(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedUser?.email === conv.email ? 'bg-blue-50' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback className="bg-green-600 text-white">
                    {conv.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <ChatInterface 
            receiverEmail={selectedUser.email}
            onClose={() => setSelectedUser(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p>اختر محادثة للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
}