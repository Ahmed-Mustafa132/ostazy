import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderOpen, BookOpen, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherGroups() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from('study_groups')
        .select('*')
        .eq('teacher_email', user.email)
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  if (isLoading) return <div className="p-12 text-center opacity-50">{t("common.loading")}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-start">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("groups.page_title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {t("groups.page_subtitle")}
          </p>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("CreateStudyGroup"))}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 dark:shadow-none w-full sm:w-auto rounded-xl h-11"
        >
          <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("groups.btn_new")}
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-700">
            <div className="bg-gray-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">{t("groups.empty_title")}</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto text-sm">
              {t("groups.empty_desc")}
            </p>
          </div>
        ) : (
          groups.map(group => (
            <Card
              key={group.id}
              className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm"
              onClick={() => navigate(createPageUrl("GroupDetails") + `?id=${group.id}`)}
            >
              <CardContent className="p-6 text-start">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                    {group.status === 'active' ? t("common.active") : t("common.inactive")}
                  </span>
                </div>

                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                    {group.stage}
                  </span>
                  <span>{group.subject}</span>
                </p>

                <div className="flex justify-between items-center text-sm font-medium border-t dark:border-slate-700 pt-4">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{group.students?.length || 0} {t("groups.student_unit")}</span>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                    {group.price_per_session} <span className="text-xs font-normal">{group.currency || t("common.currency_kwd")}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border-0 rounded-xl transition-all"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(createPageUrl("GroupContent") + `?id=${group.id}`);
                    }}
                  >
                    <FolderOpen className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("groups.btn_content")}
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