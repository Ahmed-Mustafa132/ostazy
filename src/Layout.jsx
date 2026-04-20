import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/components/SupabaseClient";
import {
  Home,
  Users,
  BookOpen,
  MessageSquare,
  Tag,
  Settings,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Calendar,
  Wallet,
  Clock,
  Target,
  Moon,
  Sun
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import NotificationBadge from "@/components/NotificationBadge";
import MobileBottomNav from "@/components/MobileBottomNav";
import ExternalLinkHandler from "@/components/ExternalLinkHandler";
import { useLanguage } from "./context/LanguageContext";

export default function Layout({ children, currentPageName }) {
  const { t, } = useLanguage(); // تفعيل الترجنة
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
    retry: false,
  });

  React.useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = createPageUrl("Home");
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: t("nav.home"),
        url: createPageUrl("Home"),
        icon: Home,
      }
    ];

    if (user?.user_type === "teacher") {
      return [
        ...baseItems,
        {
          title: t("nav.dashboard"),
          url: createPageUrl("TeacherDashboard"),
          icon: LayoutDashboard,
        },
        {
          title: t("nav.groups"),
          url: createPageUrl("TeacherGroups"),
          icon: Users,
        },
        {
          title: t("nav.my_students"),
          url: createPageUrl("TeacherStudents"),
          icon: GraduationCap,
        },
        {
          title: t("nav.wallet"),
          url: createPageUrl("TeacherWallet"),
          icon: Wallet,
        },
        {
          title: t("nav.session_tracking"),
          url: createPageUrl("SessionTracking"),
          icon: Clock,
        },
        {
          title: t("nav.calendar"),
          url: createPageUrl("TeacherCalendar"),
          icon: Calendar,
        },
        {
          title: t("nav.coupons"),
          url: createPageUrl("TeacherCoupons"),
          icon: Tag,
        },
        {
          title: t("nav.chat"),
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
        },
        {
          title: t("nav.account_settings"),
          url: createPageUrl("AccountSettings"),
          icon: Settings,
        },
        {
          title: t("nav.settings"),
          url: createPageUrl("StudentSettings"),
          icon: Settings,
        },
      ];
    } else if (user?.user_type === "center") {
      return [
        ...baseItems,
        {
          title: t("nav.dashboard"),
          url: createPageUrl("CenterDashboard"),
          icon: LayoutDashboard,
        },
        {
          title: t("nav.chat"),
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
        },
      ];
    } else if (user?.user_type === "student") {
      return [
        ...baseItems,
        {
          title: t("nav.my_dashboard"),
          url: createPageUrl("StudentDashboard"),
          icon: LayoutDashboard,
        },
        {
          title: t("nav.assignments"),
          url: createPageUrl("StudentAssignments"),
          icon: BookOpen,
        },
        {
          title: t("nav.calendar"),
          url: createPageUrl("StudentCalendar"),
          icon: Calendar,
        },
        {
          title: t("nav.chat"),
          url: createPageUrl("Chat"),
          icon: MessageSquare,
          badge: true,
        },
        {
          title: t("nav.my_goals"),
          url: createPageUrl("StudentGoals"),
          icon: Target,
        },
        {
          title: t("nav.settings"),
          url: createPageUrl("StudentSettings"),
          icon: Settings,
        },
      ];
    } else if (user?.user_type === "admin") {
      return [
        ...baseItems,
        {
          title: t("nav.admin_panel"),
          url: createPageUrl("AdminDashboard"),
          icon: Settings,
        },
        {
          title: t("nav.AdminSupport"),
          url: createPageUrl("AdminSupport"),
          icon: LayoutDashboard,
        }, {
          title: t("nav.AdminWalletRequests"),
          url: createPageUrl("AdminWalletRequests"),
          icon: LayoutDashboard,
        },
        {
          title: t("nav.settings"),
          url: createPageUrl("StudentSettings"),
          icon: Settings,
        },
      ];
    } else if (user?.user_type === "moderator") {
      return [
        ...baseItems,
        {
          title: t("nav.moderator_panel"),
          url: createPageUrl("ModeratorDashboard"),
          icon: LayoutDashboard,
        },
      ];
    }

    return baseItems;
  };


  return (
    <ExternalLinkHandler>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <style>{`
        :root {
          --primary: 34 197 94;
          --primary-foreground: 255 255 255;
          --secondary: 251 146 60;
          --secondary-foreground: 255 255 255;
        }
        * {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
      `}</style>

        {user ? (
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <Sidebar side="right" className="border-l border-orange-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm transition-colors duration-300">
                <SidebarHeader className="border-b border-orange-200 dark:border-slate-700 p-6 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-300">{t("nav.platform_name")}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{t("nav.platform_desc")}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDarkMode(!darkMode)}
                      className="hover:bg-green-600 hover:text-white transition-all"
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                  </div>
                </SidebarHeader>

                <SidebarContent className="p-3">
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2 transition-colors duration-300">
                      {t("nav.menu_label")}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {getNavigationItems().map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className={`hover:bg-green-600 hover:text-white transition-all duration-200 rounded-xl mb-1 ${location.pathname === item.url ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 'dark:text-white'
                                }`}
                            >
                              <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                                <div className="relative">
                                  <item.icon className="w-5 h-5" />
                                  {item.badge && <NotificationBadge />}
                                </div>
                                <span className="font-medium">{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-orange-200 dark:border-slate-700 p-4 transition-colors duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user?.full_name?.charAt(0) || 'م'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate transition-colors duration-300">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-300">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full justify-start gap-2 hover:bg-red-600 hover:text-white dark:border-slate-600 dark:text-white transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.logout")}
                    </Button>
                  </div>
                </SidebarFooter>
              </Sidebar>

              <main className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto pb-20 md:pb-0">
                  {children}
                </div>

                <footer className="hidden md:block border-t border-orange-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm py-4 px-6 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{t("footer.rights")}</span>
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                      <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                        {t("footer.privacy")}
                      </Link>
                      <span className="hidden md:inline">•</span>
                      <Link to={createPageUrl("TermsAndConditions")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                        {t("footer.terms")}
                      </Link>
                      <span className="hidden md:inline">•</span>
                      <Link to={createPageUrl("CookiesPolicy")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                        {t("footer.cookies")}
                      </Link>
                      <span className="hidden md:inline">•</span>
                      <Link to={createPageUrl("Support")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                        {t("footer.support")}
                      </Link>
                      <span className="hidden md:inline">•</span>
                      <Link to={createPageUrl("DeleteAccount")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                        {t("footer.delete_account")}
                      </Link>
                    </div>
                  </div>
                </footer>
              </main>
            </div>

            <MobileBottomNav />
          </SidebarProvider>
        ) : (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>

            <footer className="border-t border-orange-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm py-4 px-6 transition-colors duration-300">
              <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{t("footer.rights")}</span>
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                  <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                    {t("footer.privacy")}
                  </Link>
                  <span className="hidden md:inline">•</span>
                  <Link to={createPageUrl("TermsAndConditions")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                    {t("footer.terms")}
                  </Link>
                  <span className="hidden md:inline">•</span>
                  <Link to={createPageUrl("CookiesPolicy")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                    {t("footer.cookies")}
                  </Link>
                  <span className="hidden md:inline">•</span>
                  <Link to={createPageUrl("Support")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                    {t("footer.support")}
                  </Link>
                  <span className="hidden md:inline">•</span>
                  <Link to={createPageUrl("DeleteAccount")} className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                    {t("footer.delete_account")}
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </ExternalLinkHandler>
  );
}