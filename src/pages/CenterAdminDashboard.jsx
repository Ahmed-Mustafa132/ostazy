import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CenterAdminDashboard() {
  const { t } = useLanguage();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const stats = [
    { title: t("dashboard.students"), value: "120", icon: Users, color: "bg-blue-500" },
    { title: t("dashboard.teachers"), value: "15", icon: BookOpen, color: "bg-green-500" },
    { title: t("dashboard.revenue"), value: t("dashboard.currency_val"), icon: DollarSign, color: "bg-yellow-500" },
    { title: t("dashboard.growth"), value: "+12%", icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
      <p className="text-gray-600">{t("dashboard.welcome")}, {user?.full_name}</p>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-96">
          <CardHeader>
            <CardTitle>{t("dashboard.registration_stats")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-400">{t("dashboard.chart_placeholder")}</p>
          </CardContent>
        </Card>

        <Card className="h-96">
          <CardHeader>
            <CardTitle>{t("dashboard.recent_activities")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center mt-10">{t("dashboard.no_activities")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}