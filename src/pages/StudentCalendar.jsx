import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function StudentCalendar() {
  const { t, isRTL } = useLanguage();

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['studentSessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // جلب تسجيلات الطالب مع بيانات المجموعة
      const { data, error } = await supabase
        .from('enrollments')
        .select('id,status,progress_percentage,attendance_count,total_sessions,study_groups(id,name,subject,stage,schedule,teacher_email,price_per_session,image_url)')
        .eq('student_email', user.email)
        .eq('status', 'active');

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const teacherEmails = [...new Set(data.map(e => e.study_groups?.teacher_email).filter(Boolean))];

      let teachersMap = {};
      if (teacherEmails.length > 0) {
        const { data: teachers } = await supabase
          .from('teacher_profiles')
          .select('user_email, name')
          .in('user_email', teacherEmails);

        (teachers || []).forEach(t => { teachersMap[t.user_email] = t.name; });
      }

      return data.map(e => ({
        ...e,
        teacher_name: teachersMap[e.study_groups?.teacher_email] || e.study_groups?.teacher_email
      }));
    }
  });

  if (isLoading) {
    return (  
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {t("common.error")}: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-6 text-start">{t("calendar.page_title")}</h1>

      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t("calendar.no_sessions")}</div>
        ) : (
          groups.map((enrollment) => {
            const group = enrollment.study_groups;
            if (!group) return null;

            const schedule = group.schedule || [];

            return (
              <Card key={enrollment.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600 shrink-0">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div className="text-start">
                      <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                      <p className="text-gray-500 text-sm">{enrollment.teacher_name}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {group.subject}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          {group.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className={`w-full sm:w-auto ${isRTL ? "sm:text-left" : "sm:text-right"} space-y-1`}>
                    {Array.isArray(schedule) && schedule.length > 0 ? (
                      schedule.map((s, i) => (
                        <div key={i} className={`text-sm flex items-center gap-1 ${isRTL ? "sm:justify-end" : "sm:justify-start"} justify-center`}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="font-medium text-gray-700">{s.day || s}</span>
                          {s.time && <span className="text-gray-500">({s.time})</span>}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">{t("calendar.no_schedule")}</span>
                    )}

                    {enrollment.total_sessions > 0 && (
                      <div className={`text-xs text-gray-400 flex items-center gap-1 mt-3 ${isRTL ? "sm:justify-end" : "sm:justify-start"} justify-center`}>
                        <Users className="w-3 h-3" />
                        {t("calendar.attendance")}: {enrollment.attendance_count}/{enrollment.total_sessions}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}