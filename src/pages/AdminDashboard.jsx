import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // جلب إحصائيات المستخدمين
  const { data: usersStats = {}, isLoading: usersLoading } = useQuery({
    queryKey: ['usersStats'],
    queryFn: async () => {
      const [teachers, students, centers] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_type', 'teacher'),
        supabase.from('user_profiles').select('*').eq('user_type', 'student'),
        supabase.from('user_profiles').select('*').eq('user_type', 'center'),
      ]);
      console.log(teachers, students, centers)
      return {
        teachers: teachers.data?.length || 0,
        students: students.data?.length || 0,
        centers: centers.data?.length || 0,
        total: (teachers.data?.length || 0) + (students.data?.length || 0) + (centers.data?.length || 0)
      };
    },
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  // جلب إحصائيات المجموعات
  const { data: groupsStats = {}, isLoading: groupsLoading } = useQuery({
    queryKey: ['groupsStats'],
    queryFn: async () => {
      const { data: groups } = await supabase.from('study_groups').select('*');
      const totalStudents = groups?.reduce((sum, g) => sum + (g.enrolled_count || 0), 0) || 0;

      return {
        total: groups?.length || 0,
        totalStudents: totalStudents
      };
    },
    refetchInterval: 30000,
  });
  // جلب طلبات السحب المعلقة
  const { data: pendingWithdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['pendingWithdrawals'],
    queryFn: async () => {
      const { data } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    },
    refetchInterval: 10000,
  });

  const isLoading = usersLoading || groupsLoading;

  if (isLoading && !Object.keys(usersStats).length) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
    };

    return (
      <Card className={`cursor-pointer hover:shadow-md transition ${colorClasses[color]} border-2`} onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className="w-8 h-8 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs opacity-75 mt-1">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* العنوان */}
      <div>
        <h1 className="text-3xl font-bold">{t("admin.dashboard_title") || "لوحة تحكم المشرف"}</h1>
        <p className="text-gray-600 mt-2">{t("admin.dashboard_subtitle") || "مرحباً بك في لوحة التحكم الإدارية"}</p>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("admin.total_users") || "إجمالي المستخدمين"}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{usersStats.total || 0}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>


        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("admin.study_groups") || "المجموعات"}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{groupsStats.total || 0}</p>
                <p className="text-xs text-gray-500 mt-1">{groupsStats.totalStudents || 0} {t("admin.enrolled") || "مسجل"}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* تفاصيل المستخدمين */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("admin.teachers") || "المعلمون"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">{usersStats.teachers || 0}</p>
              <p className="text-xs text-gray-500 mt-2">{t("admin.active_teachers") || "معلمون نشطون"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("admin.students") || "الطلاب"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">{usersStats.students || 0}</p>
              <p className="text-xs text-gray-500 mt-2">{t("admin.active_students") || "طلاب نشطون"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("admin.centers") || "المراكز"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">{usersStats.centers || 0}</p>
              <p className="text-xs text-gray-500 mt-2">{t("admin.active_centers") || "مراكز نشطة"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الإجراءات السريعة */}
      <div>
        <h2 className="text-lg font-bold mb-4">{t("admin.quick_actions") || "الإجراءات السريعة"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={AlertCircle}
            title={t("admin.manage_withdrawals") || "طلبات السحب"}
            description={`${pendingWithdrawals.length} ${t("admin.pending") || "معلقة"}`}
            onClick={() => navigate('/AdminWalletRequests')}
            color="red"
          />
        </div>
      </div>

      {/* طلبات السحب المعلقة */}
      {pendingWithdrawals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("admin.pending_withdrawals") || "طلبات السحب المعلقة"}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/AdminWalletRequests')}
            >
              {t("admin.view_all") || "عرض الكل"} →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingWithdrawals.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-sm">{request.teacher_name || request.teacher_email}</p>
                    <p className="text-xs text-gray-500">{request.teacher_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{request.amount} {request.currency || t("payment.kw") || "د.ك"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}