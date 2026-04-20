import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, ArrowRight, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function EnrollGroup() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const groupId = searchParams.get('groupId');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data } = await supabase.from('study_groups').select('*').eq('id', groupId).single();
      return data;
    },
    enabled: !!groupId
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => supabase.auth.getCurrentUserWithProfile(),
  });

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    try {
      const paypalOrderId = `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error: enrollError } = await supabase.from('enrollments').insert({
        group_id: groupId,
        student_email: user.email,
        teacher_email: group.teacher_email,
        status: 'active',
        progress_percentage: 0
      });
      
      if (enrollError) throw enrollError;

      const { error: paymentError } = await supabase.from('payments').insert({
        student_email: user.email,
        teacher_email: group.teacher_email,
        amount: group.price_per_session,
        currency: 'KWD',
        payment_type: 'enrollment',
        related_id: groupId,
        payment_method: 'paypal',
        transaction_id: paypalOrderId,
        status: 'completed'
      });

      if (paymentError) throw paymentError;

      toast.success(t("enroll.success_msg"));
      navigate(createPageUrl("StudentDashboard"));
    } catch (error) {
      toast.error(t("enroll.error_general") + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error(t("enroll.error_auth"));

      if (paymentMethod === 'paypal') {
        await handlePayPalPayment();
        return;
      }

      const { error: enrollError } = await supabase.from('enrollments').insert({
        group_id: groupId,
        student_email: user.email,
        teacher_email: group.teacher_email,
        status: 'active',
        progress_percentage: 0
      });
      
      if (enrollError) throw enrollError;

      const { error: paymentError } = await supabase.from('payments').insert({
        student_email: user.email,
        teacher_email: group.teacher_email,
        amount: group.price_per_session,
        currency: 'KWD',
        payment_type: 'enrollment',
        related_id: groupId,
        payment_method: paymentMethod === 'wallet' ? 'wallet' : 'credit_card',
        status: 'completed'
      });

      if (paymentError) throw paymentError;
    },
    onSuccess: () => {
      if (paymentMethod !== 'paypal') {
        toast.success(t("enroll.success_msg"));
        navigate(createPageUrl("StudentDashboard"));
      }
    },
    onError: (error) => {
      toast.error(t("enroll.error_general") + error.message);
    }
  });

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-lg mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-black hover:text-white mb-4"
        >
          <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
          {t("common.back")}
        </Button>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white transition-colors duration-300">
              {t("enroll.confirm_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-2 transition-colors duration-300">
              <h3 className="font-bold text-gray-900 dark:text-white transition-colors duration-300">{group.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{group.description}</p>
              <div className="flex justify-between font-bold pt-2 border-t dark:border-slate-600 text-gray-900 dark:text-white transition-colors duration-300">
                <span>{t("enroll.total_price")}:</span>
                <span>{group.price_per_session} {t("common.kwd")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="dark:text-white">{t("enroll.payment_method")}</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                <div className="flex items-center justify-between border dark:border-slate-600 p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer dark:text-white">
                      <CreditCard className="w-4 h-4" />
                      {t("enroll.method_card")}
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border dark:border-slate-600 p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer dark:text-white">
                      <Wallet className="w-4 h-4" />
                      {t("enroll.method_wallet")}
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between border dark:border-slate-600 p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-300">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer dark:text-white">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#003087">
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.795.68l-.04.22-.63 3.993-.032.17a.804.804 0 01-.794.679H7.72a.483.483 0 01-.477-.558L9.35 7.54a.965.965 0 01.949-.81h4.967c.874 0 1.648.116 2.29.352.14.052.277.108.411.168.134.06.265.123.393.19a4.575 4.575 0 011.707 2.038z"/>
                      </svg>
                      PayPal
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-black text-white transition-all" 
              onClick={() => enrollMutation.mutate()}
              disabled={enrollMutation.isPending || isProcessing}
            >
              {enrollMutation.isPending || isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  {t("enroll.btn_processing")}
                </>
              ) : (
                `${t("enroll.btn_pay")} ${group.price_per_session} ${t("common.kwd")} ${t("enroll.btn_confirm")}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}