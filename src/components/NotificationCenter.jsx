import React, { useState, useEffect } from "react";
import { supabase } from "@/components/SupabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  CheckCheck, 
  X,
  FileText,
  Video,
  MessageSquare,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function NotificationCenter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState('default');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', user.email)
        .order('created_date', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email,
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      if (unread.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unread.map(n => n.id));
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          setPermission(perm);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.email || !notifications.length) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const unreadNotifications = notifications.filter(n => !n.is_read);
    const latestUnread = unreadNotifications[0];

    if (latestUnread && latestUnread.priority === 'urgent') {
        const created = new Date(latestUnread.created_date);
        const now = new Date();
        if (now - created < 60000) {
             const notification = new Notification(latestUnread.title, {
                body: latestUnread.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: latestUnread.id,
                requireInteraction: true,
                vibrate: [200, 100, 200]
              });

              notification.onclick = () => {
                window.focus();
                if (latestUnread.link) {
                  navigate(latestUnread.link);
                }
                setOpen(true);
                notification.close();
              };
        }
    }
  }, [notifications, user?.email, navigate]);

  const handleNotificationClick = (notification) => {
    markAsReadMutation.mutate(notification.id);
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'session': return Video;
      case 'message': return MessageSquare;
      case 'payment': return DollarSign;
      case 'announcement': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="w-4 h-4 ml-1" />
                تحديد الكل كمقروء
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      notification.is_read 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotificationMutation.mutate(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {format(new Date(notification.created_date), 'dd MMM - HH:mm', { locale: ar })}
                          </span>
                          {!notification.is_read && (
                            <Badge variant="secondary" className="text-xs">جديد</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {permission !== 'granted' && 'Notification' in window && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">
              🔔 فعّل الإشعارات للحصول على تنبيهات فورية
            </p>
            <Button
              size="sm"
              onClick={() => {
                Notification.requestPermission().then(perm => {
                  setPermission(perm);
                });
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              تفعيل الإشعارات
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}