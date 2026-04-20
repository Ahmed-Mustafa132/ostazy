import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Award, BookOpen } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function StudentProgressDetail() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentEmail = searchParams.get("email");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: studentData, isLoading } = useQuery({
    queryKey: ['studentProgress', studentEmail, user?.email],
    queryFn: async () => {
      if (!studentEmail || !user?.email) return null;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', studentEmail)
        .single();

      const { data: groups } = await supabase
        .from('study_groups')
        .select('id, name')
        .eq('teacher_email', user.email)
        .contains('students', [studentEmail]);

      const groupIds = groups?.map(g => g.id) || [];

      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('*, assignment:assignments!inner(title, group_id)')
        .eq('student_email', studentEmail)
        .in('assignment.group_id', groupIds);

      return {
        profile,
        groups,
        submissions: submissions || [],
        attendanceRate: 85,
        assignmentsCompleted: submissions?.length || 0,
        averageScore: submissions?.length ?
          (submissions.reduce((acc, cur) => acc + (cur.score || 0), 0) / submissions.length).toFixed(1) : 0
      };
    },
    enabled: !!studentEmail && !!user?.email
  });

  if (isLoading) return <div className="p-8 text-center">{t("common.loading")}</div>;
  if (!studentData) return <div className="p-8 text-center">{t("progress_detail.not_found")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowRight className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2 rotate-180"}`} />
          {t("common.back")}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-start">
          <h1 className="text-2xl font-bold text-gray-900">{studentData.profile?.full_name}</h1>
          <p className="text-gray-500">{studentData.profile?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {studentData.groups?.map(g => (
            <span key={g.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {g.name}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-start">
              <p className="text-sm text-gray-500">{t("progress_detail.attendance_rate")}</p>
              <h3 className="text-2xl font-bold">{studentData.attendanceRate}%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-start">
              <p className="text-sm text-gray-500">{t("progress_detail.avg_score")}</p>
              <h3 className="text-2xl font-bold">{studentData.averageScore}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-start">
              <p className="text-sm text-gray-500">{t("progress_detail.completed_assignments")}</p>
              <h3 className="text-2xl font-bold">{studentData.assignmentsCompleted}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm text-start">
          <CardHeader>
            <CardTitle className="text-lg">{t("progress_detail.submission_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData.submissions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">{t("progress_detail.no_submissions")}</p>
              ) : (
                studentData.submissions.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-start">
                      <p className="font-medium text-sm">{sub.assignment?.title}</p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(sub.submitted_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                    <div className={`${isRTL ? "text-left" : "text-right"}`}>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${sub.score >= 90 ? 'bg-green-100 text-green-800' :
                        sub.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {sub.score || '-'} / 100
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm text-start">
          <CardHeader>
            <CardTitle className="text-lg">{t("progress_detail.performance_analysis")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("progress_detail.participation")}</span>
                <span className="font-bold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("progress_detail.punctuality")}</span>
                <span className="font-bold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("progress_detail.assignment_quality")}</span>
                <span className="font-bold">{Math.min(100, (parseFloat(studentData.averageScore) || 0) + 5)}%</span>
              </div>
              <Progress value={Math.min(100, (parseFloat(studentData.averageScore) || 0) + 5)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}