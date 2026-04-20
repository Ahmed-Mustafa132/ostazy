import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function CreateCoupon() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    code: "",
    discount_percentage: "",
    valid_until: "",
    usage_limit: ""
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const createCouponMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error(t("coupons.error_auth"));

      const { error } = await supabase.from('coupons').insert({
        teacher_email: user.email,
        code: data.code,
        discount_percentage: Number(data.discount_percentage),
        valid_until: data.valid_until,
        usage_limit: data.usage_limit ? Number(data.usage_limit) : null,
        is_active: true,
        used_count: 0
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("coupons.success_create"));
      navigate(-1);
    },
    onError: (error) => {
      toast.error(t("coupons.error_general") + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCouponMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-black hover:text-white mb-6"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          {t("common.back")}
        </Button>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">
              {t("coupons.create_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-white">{t("coupons.label_code")}</Label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder={t("coupons.placeholder_code")}
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white">{t("coupons.label_discount")}</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder={t("coupons.placeholder_discount")}
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white">{t("coupons.label_expiry")}</Label>
                <Input
                  type="date"
                  required
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white">{t("coupons.label_limit")}</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder={t("coupons.placeholder_limit")}
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-black text-white transition-all"
                disabled={createCouponMutation.isPending}
              >
                {createCouponMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    {t("coupons.btn_creating")}
                  </>
                ) : (
                  t("coupons.btn_submit")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}