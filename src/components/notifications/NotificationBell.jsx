import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function NotificationBell({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: () => base44.entities.Notification.filter({ user_email: userEmail }, '-created_date', 20),
    enabled: !!userEmail,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => 
        base44.entities.Notification.update(n.id, { is_read: true })
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationColor = (type) => {
    switch(type) {
      case 'message': return 'bg-blue-100 text-blue-700';
      case 'assignment': return 'bg-orange-100 text-orange-700';
      case 'announcement': return 'bg-purple-100 text-purple-700';
      case 'approval': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
            >
              <Check className="w-3 h-3 ml-1" />
              تعليم الكل كمقروء
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              لا توجد إشعارات
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsReadMutation.mutate(notification.id);
                    }
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.is_read ? 'bg-gray-300' : 'bg-blue-600'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <Badge className={`text-xs ${getNotificationColor(notification.type)}`}>
                          {notification.type === 'message' ? 'رسالة' : 
                           notification.type === 'assignment' ? 'واجب' :
                           notification.type === 'announcement' ? 'إعلان' :
                           notification.type === 'approval' ? 'موافقة' : 'عام'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(notification.created_date), 'dd MMM yyyy - HH:mm', { locale: ar })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}