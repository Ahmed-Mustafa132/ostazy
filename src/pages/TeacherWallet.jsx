import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TeacherWallet() {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [transferDetails, setTransferDetails] = React.useState("");

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, details }) => {
      const { data, error } = await supabase.rpc('request_withdrawal', { p_amount: Number(amount), p_details: details });
      if (error) throw error;
      if (data && data.success === false) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teacherWallet']);
      setIsWithdrawOpen(false);
      setWithdrawAmount("");
      setTransferDetails("");
      toast.success("تم تقديم طلب السحب بنجاح");
    },
    onError: (err) => {
      console.log(err)
      toast.error("فشل طلب السحب: " + err.message);
    }
  });

  // جلب بيانات المحفظة
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['teacherWallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_email', user.email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // جلب سجل العمليات
  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ['teacherTransactions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('id, amount, currency, payment_type, status, created_at, student_email')
        .eq('teacher_email', user.email)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }
  });

  const isLoading = walletLoading || txLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const balance = wallet?.balance || 0;
  const totalEarnings = wallet?.total_earnings || 0;
  const totalWithdrawn = wallet?.total_withdrawn || 0;
  const pendingAmount = wallet?.pending_amount || 0;
  const currencyLabel = wallet?.currency === 'KWD' ? t("common.currency_kwd") : wallet?.currency;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold">{t("wallet.page_title")}</h1>

      {/* بطاقة الرصيد */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-start">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">{t("wallet.current_balance")}</p>
              <h2 className="text-4xl font-bold">{balance.toFixed(2)} {currencyLabel}</h2>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-blue-200 text-xs">{t("wallet.total_earnings")}</p>
              <p className="font-bold text-lg">{totalEarnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">{t("wallet.withdrawn")}</p>
              <p className="font-bold text-lg">{totalWithdrawn.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">{t("wallet.pending")}</p>
              <p className="font-bold text-lg">{pendingAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                  <ArrowUpRight className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t("wallet.btn_withdraw")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-start">{t("wallet.btn_withdraw")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-start">
                  <div className="space-y-2">
                    <Label>{t("wallet.withdraw_amount_label") || "المبلغ المطلوب سحبه"}</Label>
                    <Input
                      type="number"
                      placeholder={t("wallet.withdraw_amount_placeholder") || "0.00"}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground">الرصيد المتاح: {balance.toFixed(2)} {currencyLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("wallet.transfer_details_label") || "بيانات التحويل (رقم المحفظة / IBAN)"}</Label>
                    <Input
                      placeholder={t("wallet.transfer_details_placeholder") || "مثال: 0123456789 أو رمز IBAN الخاص بك"}
                      value={transferDetails}
                      onChange={(e) => setTransferDetails(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!withdrawAmount || !transferDetails || withdrawMutation.isPending}
                    onClick={() => withdrawMutation.mutate({ amount: withdrawAmount, details: transferDetails })}
                  >
                    {withdrawMutation.isPending ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                    {t("wallet.confirm_withdraw") || "تأكيد طلب السحب"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <ArrowDownLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t("wallet.btn_deposit")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* سجل العمليات */}
      <Card>
        <CardHeader className="text-start">
          <CardTitle>{t("wallet.history_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">{t("wallet.no_transactions")}</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 text-start">
                    <div className={`p-2 rounded-lg ${tx.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.payment_type || t("wallet.type_payment")}</p>
                      <p className="text-xs text-gray-500">{tx.student_email}</p>
                    </div>
                  </div>
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <p className="font-bold text-green-600">+{tx.amount} {currencyLabel}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}