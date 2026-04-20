import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/components/SupabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet, CheckCircle2, ShieldCheck, ArrowRight, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";
export default function PaymentCheckout() {
  const { t } = useLanguage()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // معرّفات أنواع الدفع
  const groupId = searchParams.get("groupId");
  const assignmentId = searchParams.get("assignmentId");
  const serviceId = searchParams.get("serviceId");
  const topup = searchParams.get("topup");

  // معاملات callback من Tap بعد الرجوع
  const tapCallback = searchParams.get("tap_callback");
  const tapId = searchParams.get("tap_id");

  const [method, setMethod] = React.useState("card");
  const [loading, setLoading] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState(null);
  const [transactionId, setTransactionId] = React.useState(null);
  const [topupAmount, setTopupAmount] = React.useState("");

  // ============================
  // 1. التحقق من callback من Tap
  // ============================
  React.useEffect(() => {
    if (tapCallback === "true" && tapId) {
      verifyTapPayment(tapId);
    }
  }, [tapCallback, tapId]);

  const verifyTapPayment = async (chargeId) => {
    setPageLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-tap-payment', {
        body: { tap_id: chargeId }
      });

      if (error) throw error;
      if (!data.success) {
        setIsFailed(true);
        setPageLoading(false);
        return;
      }

      // الدفع نجح! سجّل في قاعدة البيانات
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', user.id)
        .single();
      const userEmail = profile?.email || user.email;

      const metadata = data.metadata || {};
      const paymentType = metadata.payment_type || searchParams.get("payment_type") || "wallet_topup";
      const relatedId = metadata.related_id || searchParams.get("related_id");
      const teacherEmail = metadata.teacher_email || searchParams.get("teacher_email");
      const amount = data.amount || Number(searchParams.get("amount"));

      // سجّل الدفع
      await supabase.from('payments').insert({
        student_email: userEmail,
        teacher_email: teacherEmail || null,
        amount: amount,
        currency: data.currency || "KWD",
        payment_type: paymentType,
        related_id: relatedId || null,
        payment_method: 'tap_payment',
        status: 'completed',
        transaction_id: chargeId
      });

      // إذا اشتراك → أنشئ التسجيل
      if (paymentType === 'enrollment' && relatedId) {
        const { data: existing } = await supabase
          .from('enrollments')
          .select('id')
          .eq('student_email', userEmail)
          .eq('group_id', relatedId)
          .eq('status', 'active')
          .maybeSingle();

        if (!existing) {
          const { data: group } = await supabase
            .from('study_groups')
            .select('teacher_email')
            .eq('id', relatedId)
            .single();

          await supabase.from('enrollments').insert({
            student_email: userEmail,
            group_id: relatedId,
            teacher_email: group?.teacher_email || teacherEmail,
            status: 'active',
            progress_percentage: 0,
            attendance_count: 0,
            total_sessions: 0
          });

          await supabase.from('notifications').insert([
            {
              user_email: userEmail,
              title: 'تم الاشتراك بنجاح',
              message: `تم تسجيلك بنجاح بعد الدفع`,
              type: 'enrollment',
              link: '/studentcalendar',
              related_id: relatedId
            },
            {
              user_email: group?.teacher_email || teacherEmail,
              title: 'طالب جديد',
              message: `تم تسجيل طالب جديد بعد الدفع`,
              type: 'enrollment',
              related_id: relatedId
            }
          ]);
        }
      }

      // إذا شحن محفظة → حدّث الرصيد
      if (paymentType === 'wallet_topup') {
        const { data: wallet } = await supabase
          .from('wallets')
          .select('id, balance')
          .eq('user_email', userEmail)
          .maybeSingle();

        if (wallet) {
          await supabase.from('wallets')
            .update({ balance: wallet.balance + amount })
            .eq('id', wallet.id);
        } else {
          await supabase.from('wallets').insert({
            user_email: userEmail,
            balance: amount,
            currency: 'KWD'
          });
        }

        await supabase.from('notifications').insert({
          user_email: userEmail,
          title: 'تم شحن المحفظة',
          message: `تم إضافة ${amount} د.ك إلى محفظتك`,
          type: 'payment'
        });
      }

      setTransactionId(chargeId);
      setPaymentData({ amount, type: paymentType });
      setIsSuccess(true);

    } catch (err) {
      console.error("Verify error:", err);
      setIsFailed(true);
    } finally {
      setPageLoading(false);
    }
  };

  // ============================
  // 2. جلب بيانات الدفع (عادي)
  // ============================
  React.useEffect(() => {
    if (tapCallback) return; // لا تجلب بيانات إذا راجع من Tap

    const fetchPaymentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("يجب تسجيل الدخول أولاً");
          navigate(createPageUrl("Auth"));
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single();

        const userEmail = profile?.email || user.email;
        const userName = profile?.full_name || '';

        if (groupId) {
          const { data: group, error } = await supabase
            .from('study_groups')
            .select('id, name, subject, stage, teacher_email, price_per_session, curriculum')
            .eq('id', groupId)
            .single();
          if (error) throw error;

          const { data: teacher } = await supabase
            .from('teacher_profiles')
            .select('name')
            .eq('user_email', group.teacher_email)
            .single();

          setPaymentData({
            title: `الاشتراك في مجموعة ${group.name}`,
            description: `${group.subject} - ${group.stage}`,
            amount: group.price_per_session,
            teacherEmail: group.teacher_email,
            teacherName: teacher?.name || group.teacher_email,
            relatedId: group.id,
            type: 'enrollment',
            userEmail,
            userName
          });

        } else if (assignmentId) {
          const { data: assignment, error } = await supabase
            .from('assignments')
            .select('id, title, teacher_email, group_id')
            .eq('id', assignmentId)
            .single();
          if (error) throw error;

          let groupPrice = 0, groupName = '';
          if (assignment.group_id) {
            const { data: group } = await supabase
              .from('study_groups')
              .select('name, price_per_session')
              .eq('id', assignment.group_id)
              .single();
            groupPrice = group?.price_per_session || 0;
            groupName = group?.name || '';
          }

          setPaymentData({
            title: `دفع واجب: ${assignment.title}`,
            description: groupName,
            amount: groupPrice,
            teacherEmail: assignment.teacher_email,
            relatedId: assignment.id,
            type: 'assignment',
            userEmail,
            userName
          });

        } else if (serviceId) {
          const { data: service, error } = await supabase
            .from('educational_services')
            .select('id, title, service_type, price, provider_email, delivery_days')
            .eq('id', serviceId)
            .single();
          if (error) throw error;

          setPaymentData({
            title: service.title,
            description: `${service.service_type} - التسليم خلال ${service.delivery_days} أيام`,
            amount: service.price,
            teacherEmail: service.provider_email,
            relatedId: service.id,
            type: 'service',
            userEmail,
            userName
          });

        } else if (topup === "true") {
          setPaymentData({
            title: 'شحن المحفظة الإلكترونية',
            description: 'أدخل المبلغ الذي تريد شحنه',
            amount: 0,
            teacherEmail: null,
            relatedId: null,
            type: 'wallet_topup',
            userEmail,
            userName
          });

        } else {
          throw new Error("معلومات الدفع غير صحيحة");
        }
      } catch (error) {
        console.error("Payment data fetch error:", error);
        toast.error("فشل تحميل بيانات الدفع");
        navigate(-1);
      } finally {
        setPageLoading(false);
      }
    };

    fetchPaymentData();
  }, [groupId, assignmentId, serviceId, topup, navigate, tapCallback]);

  // ============================
  // 3. إنشاء عملية دفع Tap
  // ============================
  const handleTapPayment = async () => {
    const finalAmount = paymentData.type === 'wallet_topup' ? Number(topupAmount) : Number(paymentData.amount);

    if (!finalAmount || finalAmount <= 0) {
      toast.error("أدخل مبلغ صحيح");
      return;
    }

    setLoading(true);
    try {
      // التحقق هل المستخدم داخل التطبيق (Capacitor) أم المتصفح
      const isApp = window.location.protocol === 'http:' || window.location.protocol === 'file:';

      // الرابط الأساسي للرجوع
      const baseRedirect = isApp
        ? `com.osama.ostazy://paymentcheckout?tap_callback=true&amount=${finalAmount}`
        : `${window.location.origin}/paymentcheckout?tap_callback=true&amount=${finalAmount}`;

      const reqData = {
        amount: finalAmount,
        currency: "KWD",
        description: paymentData.title,
        payment_type: paymentData.type,
        related_id: paymentData.relatedId,
        teacher_email: paymentData.teacherEmail,
        customer_email: paymentData.userEmail,
        customer_name: paymentData.userName,
        custom_redirect_url: baseRedirect
      }
      console.log(reqData)

      const { data, error } = await supabase.functions.invoke('create-tap-charge', {
        body: {
          amount: finalAmount,
          currency: "KWD",
          description: paymentData.title,
          payment_type: paymentData.type,
          related_id: paymentData.relatedId,
          teacher_email: paymentData.teacherEmail,
          customer_email: paymentData.userEmail,
          customer_name: paymentData.userName,
          custom_redirect_url: baseRedirect // نرسل الرابط المخصص هنا
        }
      });


      if (error || !data.success) throw new Error(error?.message || data.error);

      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      console.error("Tap error:", error);
      toast.error("فشل إعداد الدفع: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 4. الدفع بالمحفظة (بدون Tap)
  // ============================
  const handleWalletPayment = async () => {
    const finalAmount = Number(paymentData.amount);
    if (!finalAmount || finalAmount <= 0) {
      toast.error("المبلغ غير صحيح");
      return;
    }

    setLoading(true);
    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_email', paymentData.userEmail)
        .single();

      if (!wallet || wallet.balance < finalAmount) {
        toast.error("رصيد المحفظة غير كافي");
        setLoading(false);
        return;
      }

      const txnId = `WALLET-${Date.now()}`;

      // خصم من المحفظة
      await supabase.from('wallets')
        .update({ balance: wallet.balance - finalAmount })
        .eq('id', wallet.id);

      // سجّل الدفع
      await supabase.from('payments').insert({
        student_email: paymentData.userEmail,
        teacher_email: paymentData.teacherEmail || null,
        amount: finalAmount,
        currency: "KWD",
        payment_type: paymentData.type,
        related_id: paymentData.relatedId,
        payment_method: 'wallet',
        status: 'completed',
        transaction_id: txnId
      });

      // إذا اشتراك
      if (paymentData.type === 'enrollment' && paymentData.relatedId) {
        const { data: group } = await supabase
          .from('study_groups')
          .select('teacher_email')
          .eq('id', paymentData.relatedId)
          .single();

        await supabase.from('enrollments').insert({
          student_email: paymentData.userEmail,
          group_id: paymentData.relatedId,
          teacher_email: group?.teacher_email || paymentData.teacherEmail,
          status: 'active',
          progress_percentage: 0,
          attendance_count: 0,
          total_sessions: 0
        });
      }

      setTransactionId(txnId);
      setIsSuccess(true);
      toast.success("تم الدفع بنجاح!");

      setTimeout(() => {
        navigate(paymentData.type === 'enrollment'
          ? createPageUrl("StudentCalendar")
          : createPageUrl("StudentDashboard"));
      }, 3000);

    } catch (error) {
      toast.error("فشلت عملية الدفع: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // الـ UI
  // ============================

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">جاري التحقق من الدفع...</p>
        </div>
      </div>
    );
  }

  // صفحة فشل الدفع
  if (isFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('payment.failed_title')}</h2>
            <p className="text-gray-500">{t('payment.failed_desc')}</p>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1" onClick={() => navigate(-1)}>{t('payment.back')}</Button>
              <Button className="flex-1 bg-green-600" onClick={() => {
                setIsFailed(false);
                navigate(createPageUrl("PaymentCheckout") + "?topup=true");
              }}>
                {t('payment.try_again')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // صفحة نجاح الدفع
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('payment.success_title')}</h2>
            <p className="text-gray-500">
              {paymentData?.type === 'wallet_topup'
                ? t('payment.wallet_success')
                : t('payment.service_success')}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('payment.transaction_id')}</span>
                <span className="font-mono text-xs">{transactionId}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{t('payment.amount_paid')}</span>
                <span className="text-green-600">{paymentData?.amount} {t('payment.kw')}</span>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
              onClick={() => {
                navigate(paymentData?.type === 'enrollment'
                  ? createPageUrl("StudentCalendar")
                  : createPageUrl("StudentDashboard"));
              }}
            >
              {paymentData?.type === 'enrollment' ? t('payment.view_schedule') : t('payment.back_to_dashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayAmount = paymentData?.type === 'wallet_topup'
    ? (topupAmount || '0')
    : paymentData?.amount;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowRight className="w-4 h-4 ml-2" />
          {t('payment.go_back')}
        </Button>

        <Card className="shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
            <h1 className="text-xl font-bold mb-1">
              {paymentData?.type === 'wallet_topup' ? t('payment.wallet_topup') : t('payment.complete_payment')}
            </h1>
            <p className="text-gray-300 text-sm">{paymentData?.title}</p>
            {paymentData?.description && (
              <p className="text-gray-400 text-xs mt-1">{paymentData.description}</p>
            )}
            {paymentData?.teacherName && (
              <p className="text-gray-400 text-xs mt-1">{t('payment.teacher')}: {paymentData.teacherName}</p>
            )}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold">{displayAmount}</span>
              <span className="text-lg font-normal text-gray-400">{t('payment.currency_full')}</span>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* حقل مبلغ الشحن */}
            {paymentData?.type === 'wallet_topup' && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('payment.topup_amount_label')}</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder={t('payment.enter_amount_placeholder')}
                  value={topupAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTopupAmount(val);
                    setPaymentData(prev => ({ ...prev, amount: Number(val) }));
                  }}
                  className="text-lg h-12 text-center font-bold"
                />
                <div className="flex gap-2">
                  {[5, 10, 25, 50].map(amt => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setTopupAmount(String(amt));
                        setPaymentData(prev => ({ ...prev, amount: amt }));
                      }}
                    >
                      {amt} {t('payment.kw')}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* طرق الدفع */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">{t('payment.choose_method')}</Label>
              <RadioGroup value={method} onValueChange={setMethod} className="grid gap-4">
                {/* بطاقة بنكية عبر Tap */}
                <div className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${method === 'card' ? 'border-green-600 bg-green-50 ring-2 ring-green-600' : 'hover:bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border shadow-sm">
                        <CreditCard className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{t('payment.card_payment')}</div>
                        <div className="text-xs text-gray-500">{t('payment.tap_secure')}</div>
                      </div>
                    </Label>
                  </div>
                </div>

                {/* المحفظة - فقط لغير شحن المحفظة */}
                {paymentData?.type !== 'wallet_topup' && (
                  <div className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${method === 'wallet' ? 'border-yellow-600 bg-yellow-50 ring-2 ring-yellow-600' : 'hover:bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="cursor-pointer flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border shadow-sm">
                          <Wallet className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{t('payment.e_wallet')}</div>
                          <div className="text-xs text-gray-500">{t('payment.use_balance')}</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                )}
              </RadioGroup>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 items-start text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-blue-900">{t('payment.secure_note')}</p>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800"
              onClick={method === 'wallet' ? handleWalletPayment : handleTapPayment}
              disabled={loading || (paymentData?.type === 'wallet_topup' && (!topupAmount || Number(topupAmount) <= 0))}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  {t('payment.redirecting')}
                </>
              ) : (
                <span>
                  {method === 'wallet'
                    ? `${t('payment.pay_wallet')} • ${displayAmount} ${t('payment.kw')}`
                    : `${t('payment.pay_now')} • ${displayAmount} ${t('payment.kw')}`}
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}