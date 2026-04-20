import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Book } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function StudentProgress() {
  const { t, isRTL } = useLanguage();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, study_groups(name, subject)')
        .eq('student_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-100 rounded-xl shrink-0">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <div className="text-start">
          <h1 className="text-2xl font-bold text-gray-900">{t("progress.page_title")}</h1>
          <p className="text-gray-600">{t("progress.page_subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <Book className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-start">
                    <h3 className="font-bold text-lg leading-tight">{enrollment.study_groups?.name}</h3>
                    <p className="text-sm text-gray-500">{enrollment.study_groups?.subject}</p>
                  </div>
                </div>
                <span className="font-bold text-2xl text-blue-600">
                  {enrollment.progress_percentage}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">{t("progress.current_level")}</span>
                  <span>
                    {enrollment.attendance_count} / {enrollment.total_sessions} {t("progress.sessions_unit")}
                  </span>
                </div>
                <Progress value={enrollment.progress_percentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {enrollments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{t("progress.empty_title")}</h3>
            <p className="text-gray-400 max-w-xs mx-auto mt-2">{t("progress.empty_desc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}