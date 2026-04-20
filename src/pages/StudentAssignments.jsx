import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function StudentAssignments() {
  const { t, isRTL } = useLanguage();

  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ['studentAssignmentsPage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(t("auth.login_required"));

      // 1. جلب المجموعات المسجل فيها الطالب
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('group_id, study_groups(name)')
        .eq('student_email', user.email)
        .eq('status', 'active');

      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) return [];

      const groupIds = enrollments.map(e => e.group_id);

      // 2. جلب الواجبات لهذه المجموعات
      const { data: assignmentsData, error: assignError } = await supabase
        .from('assignments')
        .select('*')
        .in('group_id', groupIds)
        .order('due_date', { ascending: true });

      if (assignError) throw assignError;
      if (!assignmentsData || assignmentsData.length === 0) return [];

      // 3. جلب تسليمات الطالب
      const assignmentIds = assignmentsData.map(a => a.id);
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('assignment_id, status, score')
        .eq('student_email', user.email)
        .in('assignment_id', assignmentIds);

      // 4. دمج البيانات
      const submissionsMap = {};
      (submissions || []).forEach(s => { submissionsMap[s.assignment_id] = s; });

      const groupsMap = {};
      enrollments.forEach(e => { groupsMap[e.group_id] = e.study_groups?.name || ''; });

      return assignmentsData.map(a => ({
        ...a,
        group_name: groupsMap[a.group_id] || '',
        submission: submissionsMap[a.id] || null
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

  const getStatusInfo = (assignment) => {
    if (assignment.submission) {
      const s = assignment.submission;
      if (s.status === 'graded') {
        return {
          label: `${t("assignments.status.graded")}: ${s.score}`,
          color: 'bg-blue-100 text-blue-600',
          icon: <CheckCircle className="w-6 h-6" />,
          badge: 'default'
        };
      }
      return {
        label: t("assignments.status.submitted"),
        color: 'bg-green-100 text-green-600',
        icon: <CheckCircle className="w-6 h-6" />,
        badge: 'default'
      };
    }
    const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
    if (isOverdue) {
      return {
        label: t("assignments.status.overdue"),
        color: 'bg-red-100 text-red-600',
        icon: <AlertCircle className="w-6 h-6" />,
        badge: 'destructive'
      };
    }
    return {
      label: t("assignments.status.pending"),
      color: 'bg-orange-100 text-orange-600',
      icon: <Clock className="w-6 h-6" />,
      badge: 'outline'
    };
  };

  return (
    <div className="p-6 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold mb-6 text-start">{t("assignments.page_title")}</h1>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("assignments.empty_state")}</div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const statusInfo = getStatusInfo(assignment);
            return (
              <Card key={assignment.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className={`p-3 rounded-xl ${statusInfo.color} shrink-0`}>
                      {statusInfo.icon}
                    </div>
                    <div className="text-start">
                      <h3 className="font-bold text-lg leading-tight">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{assignment.group_name}</p>
                    </div>
                  </div>

                  <div className={`${isRTL ? "sm:text-left" : "sm:text-right"} text-center w-full sm:w-auto`}>
                    <Badge variant={statusInfo.badge} className="px-3 py-1">
                      {statusInfo.label}
                    </Badge>
                    {assignment.due_date && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center justify-center sm:justify-end gap-1">
                        {t("assignments.due_date")}: {new Date(assignment.due_date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}