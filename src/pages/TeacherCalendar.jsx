import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherCalendar() {
  const { t, isRTL } = useLanguage();

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['teacherSessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('teacher_email', user.email)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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
      <div className="text-center py-12 text-red-500 font-medium">
        {t("common.error_occurred")}: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-6 text-start">{t("TeacherCalendar.page_title")}</h1>

      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
            {t("TeacherCalendar.no_active_groups")}
          </div>
        ) : (
          groups.map((group) => {
            const schedule = group.schedule || [];
            return (
              <Card key={group.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div className="text-start">
                      <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                          {group.subject}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-medium text-gray-500 border-gray-200">
                          {group.stage}
                        </Badge>
                      </div>
                      {group.students && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            {group.students.length}
                            {group.max_students ? ` / ${group.max_students}` : ''}
                            {" "}{t("TeacherCalendar.student_unit")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`w-full md:w-auto flex flex-col ${isRTL ? "md:items-end" : "md:items-start"} gap-2`}>
                    <div className="space-y-1.5">
                      {Array.isArray(schedule) && schedule.length > 0 ? (
                        schedule.map((s, i) => (
                          <div key={i} className={`text-sm font-medium flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"} text-gray-700`}>
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>{s.day || s}</span>
                            {s.time && <span className="text-gray-400 font-normal">| {s.time}</span>}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">{t("TeacherCalendar.no_schedule")}</span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-50 mt-1">
                      <p className="text-sm font-bold text-green-600">
                        {group.price_per_session} {group.currency || t("common.currency_kwd")} / {t("TeacherCalendar.session_unit")}
                      </p>
                    </div>
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