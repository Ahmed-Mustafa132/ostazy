import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function CompleteProfile() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            user_type: role,
            role: 'user'
          })
          .eq('id', user.id);

        if (error) {
          console.error("Error updating profile:", error);
          alert(t("profile.error_save"));
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const targetPage = role === 'teacher' ? "TeacherDashboard" :
          role === 'center' ? "CenterDashboard" :
            "StudentDashboard";

        window.location.href = createPageUrl(targetPage);
      }
    } catch (err) {
      console.error("Complete profile error:", err);
      alert(t("profile.error_unexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">{t("profile.complete_title")}</CardTitle>
          <p className="text-gray-500 text-sm">{t("profile.subtitle")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("profile.account_type")}</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("profile.select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">{t("roles.student")}</SelectItem>
                  <SelectItem value="teacher">{t("roles.teacher")}</SelectItem>
                  <SelectItem value="center">{t("roles.center")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
              disabled={!role || loading}
            >
              {loading ? t("profile.saving") : t("profile.save_continue")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}