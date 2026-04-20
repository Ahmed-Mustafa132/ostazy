import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Users, Mail, TrendingUp, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherStudents() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['teacherStudents', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      const { data: groups } = await supabase
        .from('study_groups')
        .select('id, name, students')
        .eq('teacher_email', user.email);

      if (!groups) return [];

      const studentMap = new Map();
      groups.forEach(group => {
        if (group.students && Array.isArray(group.students)) {
          group.students.forEach(email => {
            if (!studentMap.has(email)) {
              studentMap.set(email, { email, groups: [] });
            }
            studentMap.get(email).groups.push(group.name);
          });
        }
      });

      const emails = Array.from(studentMap.keys());
      if (emails.length === 0) return [];

      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .in('email', emails);

      return emails.map(email => {
        const profile = profiles?.find(p => p.email === email) || {
          full_name: t("students.unregistered"),
          email
        };
        const studentData = studentMap.get(email);
        return {
          ...profile,
          enrolledGroups: studentData.groups
        };
      });
    },
    enabled: !!user?.email
  });

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("students.page_title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("students.page_subtitle")}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
          <Input
            placeholder={t("students.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'} rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 transition-all`}
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-20 opacity-50">{t("common.loading")}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700">
            <Users className="w-16 h-16 text-gray-200 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("students.empty_title")}</h3>
            <p className="text-gray-400 mt-2">{t("students.empty_desc")}</p>
          </div>
        ) : (
          filteredStudents.map((student, idx) => (
            <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-green-100 dark:border-green-900/30">
                      <AvatarImage src={student.avatar_url} />
                      <AvatarFallback className="bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold">
                        {student.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm">
                      <UserCheck className="w-3 h-3 text-green-500" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-start">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-green-600 transition-colors">
                      {student.full_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      {student.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 text-start">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-2 block">
                      {t("students.enrolled_in")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {student.enrolledGroups.map((groupName, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-[10px] px-2 py-0.5 rounded-lg">
                          {groupName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-xl h-11 border-gray-100 dark:border-slate-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all font-bold gap-2"
                    variant="outline"
                    onClick={() => navigate(createPageUrl("StudentProgressDetail") + `?email=${student.email}`)}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {t("students.view_progress")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}