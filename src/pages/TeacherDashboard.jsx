import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, Calendar, Play, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['teacherDashboardData', user?.email, language],
    queryFn: async () => {
      if (!user?.email) return null;

      const [groupsRes, walletRes, paymentsRes] = await Promise.all([
        supabase.from('study_groups').select('*').eq('teacher_email', user.email),
        supabase.from('wallets').select('*').eq('user_email', user.email).maybeSingle(),
        supabase.from('payments').select('*').eq('teacher_email', user.email)
      ]);

      const groups = groupsRes.data || [];
      const wallet = walletRes.data || { balance: 0, currency: 'KWD' };
      const payments = paymentsRes.data || [];

      const uniqueStudents = new Set();
      let weeklySessions = 0;

      groups.forEach(group => {
        if (group.students && Array.isArray(group.students)) {
          group.students.forEach(s => uniqueStudents.add(s));
        }
        if (group.schedule && Array.isArray(group.schedule)) {
          weeklySessions += group.schedule.length;
        }
      });

      const monthlyEarnings = {};
      payments.forEach(p => {
        if (p.created_date) {
          const date = new Date(p.created_date);
          const month = date.toLocaleString(language === 'ar' ? 'ar-KW' : 'en-US', { month: 'long' });
          monthlyEarnings[month] = (monthlyEarnings[month] || 0) + (p.amount || 0);
        }
      });

      const chartData = Object.entries(monthlyEarnings).map(([name, value]) => ({ name, value }));
      if (chartData.length === 0) {
        chartData.push({ name: t("TeacherDashboard.now"), value: 0 });
      }

      return {
        stats: [
          { title: t("TeacherDashboard.active_students"), value: uniqueStudents.size.toString(), icon: Users, color: "text-blue-600 dark:text-blue-400" },
          { title: t("TeacherDashboard.active_groups"), value: groups.filter(g => g.status === 'active').length.toString(), icon: BookOpen, color: "text-green-600 dark:text-green-400" },
          { title: t("TeacherDashboard.current_balance"), value: `${wallet.balance} ${wallet.currency || t("common.currency_kwd")}`, icon: DollarSign, color: "text-yellow-600 dark:text-yellow-400" },
          { title: t("TeacherDashboard.weekly_sessions"), value: weeklySessions.toString(), icon: Calendar, color: "text-purple-600 dark:text-purple-400" },
        ],
        chartData,
      };
    },
    enabled: !!user?.email
  });

  if (isLoading) return <div className="p-8 text-center">{t("common.loading")}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-4 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="md:hidden flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-black hover:text-white mb-4"
          >
            <ArrowRight className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2 rotate-180"}`} />
            {t("common.back")}
          </Button>
        </div>

        <div className="flex justify-between items-center text-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("TeacherDashboard.page_title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("TeacherDashboard.welcome")}, {user?.full_name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {dashboardData?.stats?.map((stat, index) => (
            <Card key={index} className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full bg-gray-50 dark:bg-slate-700 ${stat.color} shrink-0`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 truncate">{stat.title}</p>
                  <h3 className="text-base md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="text-start">
              <CardTitle className="text-gray-900 dark:text-white">{t("TeacherDashboard.earnings_stats")}</CardTitle>
            </CardHeader>
            <CardContent className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    reversed={isRTL}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis orientation={isRTL ? "right" : "left"} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      textAlign: isRTL ? 'right' : 'left',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-gray-900 dark:text-white">
                <span>{t("TeacherDashboard.upcoming_sessions")}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(createPageUrl("SessionTracking"))}
                  className="dark:border-slate-600 text-xs md:text-sm"
                >
                  {t("common.view_all")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Session Item 1 */}
              <div className="p-4 border dark:border-slate-700 rounded-2xl flex justify-between items-center gap-3 bg-gray-50/50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3 text-start">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-300">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-white">{t("TeacherDashboard.instant_session")}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("TeacherDashboard.start_now")}</p>
                  </div>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                  {t("common.start")}
                </Button>
              </div>

              {/* Session Item 2 */}
              <div className="p-4 border dark:border-slate-700 rounded-2xl flex justify-between items-center gap-3 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-3 text-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-white">مراجعة فيزياء</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("TeacherDashboard.today")} - 4:00 م</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="rounded-xl dark:bg-slate-700 dark:text-white">
                  {t("common.join")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}