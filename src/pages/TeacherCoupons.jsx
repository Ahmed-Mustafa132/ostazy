import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext"; // استيراد سياق اللغة

export default function TeacherCoupons() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  return (
    <div className="p-6 max-w-4xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="text-start">
          <h1 className="text-2xl font-bold text-gray-900">{t("coupons.page_title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("coupons.page_subtitle")}</p>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("CreateCoupon"))}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
        >
          <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("coupons.btn_new")}
        </Button>
      </div>

      <div className="grid gap-4">
        {/* حالة عدم وجود بيانات (Empty State) */}
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <Tag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t("coupons.empty_title")}</h3>
            <p className="text-gray-400 max-w-xs mx-auto mt-2">
              {t("coupons.empty_desc")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}