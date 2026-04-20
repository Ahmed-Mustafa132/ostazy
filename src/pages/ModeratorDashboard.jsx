import React from "react";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function ModeratorDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Mobile Back Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-green-600 hover:text-white mb-4 transition-all group"
          >
            <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
            {t("common.back")}
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("moderator.dashboard_title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              {t("moderator.dashboard_subtitle")}
            </p>
          </div>
        </div>

        {/* Empty State / Placeholder */}
        <div className="mt-8 p-12 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-100 dark:border-slate-700 shadow-2xl rounded-[2rem] text-center transition-all duration-300">
          <div className="bg-amber-100 dark:bg-amber-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-12 h-12 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t("moderator.welcome_msg")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            {t("moderator.coming_soon")}
          </p>
        </div>
      </div>
    </div>
  );
}