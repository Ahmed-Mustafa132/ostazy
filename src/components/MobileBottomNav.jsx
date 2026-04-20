import React from "react";
// Mobile Bottom Navigation Component
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/components/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Users,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
  Calendar,
  Settings,
  Tag,
  Clock
  } from "lucide-react";
import NotificationBadge from "@/components/NotificationBadge";

export default function MobileBottomNav() {
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
    retry: false,
  });

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "الرئيسية",
        url: createPageUrl("Home"),
        icon: Home,
        color: "#10b981"
      }
    ];

    if (user?.user_type === "teacher") {
      return [
        ...baseItems,
        {
          title: "لوحة التحكم",
          url: createPageUrl("TeacherDashboard"),
          icon: LayoutDashboard,
          color: "#3b82f6"
        },
        {
          title: "طلابي",
          url: createPageUrl("TeacherStudents"),
          icon: Users,
          color: "#8b5cf6"
        },
        {
          title: "تتبع الحصص",
          url: createPageUrl("SessionTracking"),
          icon: Clock,
          color: "#ef4444"
        },
        {
          title: "الجدول",
          url: createPageUrl("TeacherCalendar"),
          icon: Calendar,
          color: "#f59e0b"
        },
        {
          title: "الدردشة",
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
          color: "#ec4899"
        },
      ];
    } else if (user?.user_type === "center") {
      return [
        ...baseItems,
        {
          title: "لوحة التحكم",
          url: createPageUrl("CenterDashboard"),
          icon: LayoutDashboard,
          color: "#3b82f6"
        },
        {
          title: "الدردشة",
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
          color: "#ec4899"
        },
      ];
    } else if (user?.user_type === "student") {
      return [
        ...baseItems,
        {
          title: "لوحتي",
          url: createPageUrl("StudentDashboard"),
          icon: LayoutDashboard,
          color: "#3b82f6"
        },
        {
          title: "الواجبات",
          url: createPageUrl("StudentAssignments"),
          icon: BookOpen,
          color: "#f59e0b"
        },
        {
          title: "الجدول",
          url: createPageUrl("StudentCalendar"),
          icon: Calendar,
          color: "#8b5cf6"
        },
        {
          title: "الدردشة",
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
          color: "#ec4899"
        },
      ];
    } else if (user?.system_role === "admin") {
      return [
        ...baseItems,
        {
          title: "لوحة الإدارة",
          url: createPageUrl("AdminDashboard"),
          icon: Settings,
          color: "#ef4444"
        },
        {
          title: "لوحة المشرف",
          url: createPageUrl("ModeratorDashboard"),
          icon: LayoutDashboard,
          color: "#f59e0b"
        },
      ];
    } else if (user?.system_role === "moderator") {
      return [
        ...baseItems,
        {
          title: "لوحة المشرف",
          url: createPageUrl("ModeratorDashboard"),
          icon: LayoutDashboard,
          color: "#f59e0b"
        },
      ];
    }

    return baseItems;
  };

  const navItems = getNavigationItems();

  if (!user) return null;

  return (
    <>
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          50% { transform: scale(1.1) translateY(-5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .nav-item-active {
          animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @media (max-width: 767px) {
          .mobile-bottom-nav-fixed {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 50 !important;
            background: linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.95)) !important;
            backdrop-filter: blur(10px) !important;
            border-top: 1px solid rgba(251, 146, 60, 0.2) !important;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08) !important;
          }
          
          .dark .mobile-bottom-nav-fixed {
            background: linear-gradient(to top, rgba(30, 41, 59, 0.98), rgba(30, 41, 59, 0.95)) !important;
            border-top: 1px solid rgba(71, 85, 105, 0.3) !important;
          }
        }

        @media (min-width: 768px) {
          .mobile-bottom-nav-fixed {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="mobile-bottom-nav-fixed md:hidden">
        <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.slice(0, 5).map((item, index) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${
                  isActive ? 'nav-item-active' : ''
                }`}
              >
                <div className="relative">
                  {/* Icon Background Circle */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      isActive ? 'scale-125' : 'scale-0'
                    }`}
                    style={{
                      backgroundColor: item.color,
                      opacity: 0.1,
                      filter: 'blur(8px)'
                    }}
                  />
                  
                  {/* Icon - Larger */}
                  <item.icon 
                    className={`w-7 h-7 relative z-10 transition-all duration-300 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                    style={{ 
                      color: isActive ? item.color : '#6b7280',
                      filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                    }}
                  />
                  
                  {item.badge && <NotificationBadge />}
                </div>
                
                {/* Label */}
                <span 
                  className={`text-xs mt-1 font-medium transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-60'
                  }`}
                  style={{ 
                    color: isActive ? item.color : '#6b7280',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}