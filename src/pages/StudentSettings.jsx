import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function StudentSettings() {
  const { t, isRTL, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const { data: settings } = useQuery({
    queryKey: ['studentSettings', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await supabase.from('student_settings').select('*').eq('student_email', user.email).maybeSingle();
      return data || {
        student_email: user.email,
        theme: 'light',
        notifications_enabled: true,
        email_notifications: true,
        language: 'ar',
        interests: []
      };
    },
    enabled: !!user?.email
  });

  const [formData, setFormData] = React.useState(null);

  React.useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newData) => {
      const { data, error } = await supabase.from('student_settings').upsert(newData).select();
      console.log(data, error)
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['studentSettings']);
      // تحديث لغة التطبيق فوراً إذا تغيرت في الإعدادات
      if (data[0].language) {
        setLanguage(data[0].language);

      }
      toast.success(t("settings.save_success"));
    },
    onError: (err) => {
      console.log(err)
      toast.error(t("settings.save_error") + ": " + err.message);
    }
  });

  const handleSubmit = (e) => {
    console.log(formData.language)
    // save lang  in local  storge 
    try {
      localStorage.setItem("language", formData.language);
      e.preventDefault();
      updateSettingsMutation.mutate(formData);
      setTimeout(() => {
        window.location.reload();
      }, 500);  
    } catch {

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  const academicInterests = [
    { id: 'math', label: t("settings.interests_list.math") },
    { id: 'physics', label: t("settings.interests_list.physics") },
    { id: 'chemistry', label: t("settings.interests_list.chemistry") },
    { id: 'languages', label: t("settings.interests_list.languages") },
    { id: 'coding', label: t("settings.interests_list.coding") },
    { id: 'arts', label: t("settings.interests_list.arts") },
  ];

  if (!formData) return <div className="p-8 text-center">{t("common.loading")}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-start">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowRight className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2 rotate-180"}`} />
            {t("common.back")}
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-start">{t("settings.page_title")}</h1>

        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-start text-lg">{t("settings.section_preferences")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-start">
                    <Label>{t("settings.label_notifications")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.desc_notifications")}</p>
                  </div>
                  <Switch
                    checked={formData.notifications_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, notifications_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-start">
                    <Label>{t("settings.label_email_notifications")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.desc_email_notifications")}</p>
                  </div>
                  <Switch
                    checked={formData.email_notifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, email_notifications: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2 text-start">
                <Label>{t("settings.label_theme")}</Label>
                <Select value={formData.theme} onValueChange={(val) => setFormData({ ...formData, theme: val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("settings.themes.light")}</SelectItem>
                    <SelectItem value="dark">{t("settings.themes.dark")}</SelectItem>
                    <SelectItem value="system">{t("settings.themes.system")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-start">
                <Label>{t("settings.label_language")}</Label>
                <Select value={formData.language} onValueChange={(val) => setFormData({ ...formData, language: val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-start">
                <Label>{t("settings.label_interests")}</Label>
                <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? "justify-start" : "justify-start"}`}>
                  {academicInterests.map((interest) => (
                    <div
                      key={interest.id}
                      onClick={() => {
                        const newInterests = formData.interests?.includes(interest.id)
                          ? formData.interests.filter(i => i !== interest.id)
                          : [...(formData.interests || []), interest.id];
                        setFormData({ ...formData, interests: newInterests });
                      }}
                      className={`px-4 py-2 rounded-full cursor-pointer text-sm transition-all border ${formData.interests?.includes(interest.id)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                    >
                      {interest.label}
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={updateSettingsMutation.isPending}>
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : (
                  <Save className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                )}
                {t("settings.btn_save")}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}