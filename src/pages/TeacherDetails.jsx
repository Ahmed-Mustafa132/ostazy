import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Book, Video, ArrowRight, MessageSquare, GraduationCap, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherDetails() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const searchParams = new URLSearchParams(window.location.search);
  const teacherId = paramId || searchParams.get('id');


  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      if (!teacherId) return null;

      const { data, error } = await supabase
        .from('user_profiles') // التغيير للجدول الجديد
        .select('*')
        .eq('id', teacherId)   // البحث باستخدام الـ id (الـ UUID المكتوب في الرابط)
        .eq('user_type', 'teacher') // التأكد أنه مدرس وليس طالب
        .single();

      if (error) {
        console.error("Error fetching teacher:", error);
        throw error;
      }
      return data;
    },
    enabled: !!teacherId // لن يعمل الاستعلام إلا لو الـ id موجود
  });

  if (isLoading) return <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>;
  if (!teacher) return <div className="p-12 text-center text-red-500">{t("teacher_details.not_found")}</div>;
  console.log(teacher)
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Back Button */}
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100">
          <ArrowRight className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2 rotate-180"}`} />
          {t("common.back")}
        </Button>
      </div>

      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl bg-white dark:bg-slate-900">
        {/* Cover Header */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <CardContent className="relative pt-0 px-6 pb-8">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-16">
            {/* Teacher Avatar */}
            <div className="relative">
              <img
                src={teacher.avatar_url || "https://res.cloudinary.com/dufjbywcm/image/upload/v1769071653/Teacher_Control_Panel_ziohs0.png"}
                alt={teacher.full_name}
                className="w-36 h-36 rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl object-cover bg-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-lg shadow-lg">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>

            <div className="flex-1 pt-4 md:pt-20 space-y-3 text-start">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{teacher.full_name}</h1>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{teacher.city}, {teacher.country}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-1.5 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-700 dark:text-yellow-400">{teacher.rating || 5.0}</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl italic">
                "{teacher.bio}"
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {teacher.subjects?.map(subject => (
                  <Badge key={subject} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 hover:bg-blue-100">
                    <Book className="w-3 h-3 ml-1" />
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction Video */}
              {teacher.video_introduction && (
                <div className="space-y-4 text-start">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    {t("teacher_details.intro_video")}
                  </h3>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
                    <iframe
                      src={teacher.video_introduction}
                      className="w-full h-full"
                      title="Teacher Introduction"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Qualifications */}
              <div className="space-y-4 text-start">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  {t("teacher_details.qualifications")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-blue-50/50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      {t("teacher_details.experience")}
                    </span>
                    <p className="font-bold text-xl text-blue-900 dark:text-blue-300 mt-1">
                      {teacher.years_experience} {t("teacher_details.years")}
                    </p>
                  </div>
                  <div className="p-5 bg-green-50/50 dark:bg-slate-800 rounded-2xl border border-green-100 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
                      {t("teacher_details.hourly_rate")}
                    </span>
                    <p className="font-bold text-xl text-green-700 dark:text-green-400 mt-1">
                      {teacher.hourly_rate} {teacher.currency || t("common.currency_kwd")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg rounded-2xl sticky top-6">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white text-start">
                    {t("teacher_details.connect_title")}
                  </h3>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl gap-2 font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                    <MessageSquare className="w-4 h-4" />
                    {t("teacher_details.send_message")}
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-bold border-2 dark:border-slate-700 dark:text-white transition-all">
                    <Clock className="w-4 h-4" />
                    {t("teacher_details.book_trial")}
                  </Button>

                  <div className="pt-4 border-t dark:border-slate-700">
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      {t("teacher_details.booking_disclaimer")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}