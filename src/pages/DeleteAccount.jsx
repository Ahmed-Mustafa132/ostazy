import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/components/SupabaseClient";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    reason: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    document.title = "حذف الحساب - Delete Account | أستاذي";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('DeleteAccountRequest').insert({
        email: formData.email,
        reason: formData.reason,
        status: 'معلق'
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ email: "", reason: "" });
      
      // Reset after 8 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 8000);
    } catch (error) {
      console.error('Error submitting delete request:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-green-600 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للرئيسية / Back to Home
          </Button>
        </div>

        {/* Content Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                حذف الحساب
              </h1>
              <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Delete Account
              </h2>
            </div>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  تم إرسال طلبك بنجاح!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your request has been submitted successfully!
                </p>
              </div>
            </div>
          )}

          {/* Warning Alert */}
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900 dark:text-red-100">
              <p className="font-semibold mb-1">تحذير مهم / Important Warning</p>
              <p className="text-sm">
                حذف الحساب إجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائيًا.
              </p>
              <p className="text-sm mt-1">
                Account deletion is permanent and cannot be undone. All your data will be deleted permanently.
              </p>
            </AlertDescription>
          </Alert>

          {/* Information Section */}
          <div className="mb-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ما الذي سيتم حذفه؟ / What will be deleted?
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>حسابك الشخصي بالكامل / Your personal account completely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>جميع البيانات الشخصية (الاسم، البريد الإلكتروني، الصورة) / All personal data (name, email, photo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>محتوى الدراسة والواجبات والتقييمات / Study content, assignments, and grades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>جميع الاشتراكات والمجموعات / All subscriptions and groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>سجل المحادثات والرسائل / Chat and message history</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                المدة الزمنية / Timeline
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                سيتم معالجة طلب الحذف خلال <strong>7 أيام عمل</strong> من تاريخ تقديمه.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Your deletion request will be processed within <strong>7 business days</strong> from submission.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                هل يمكن استرجاع الحساب؟ / Can the account be recovered?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-red-600">لا</strong>، لا يمكن استرجاع الحساب أو البيانات بعد إتمام عملية الحذف.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                <strong className="text-red-600">No</strong>, the account and data cannot be recovered after deletion is completed.
              </p>
            </div>
          </div>

          {/* Deletion Request Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Trash2 className="w-5 h-5 text-red-600" />
                طلب حذف الحساب / Account Deletion Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">
                    البريد الإلكتروني / Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                    className="mt-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    أدخل البريد الإلكتروني المسجل في حسابك / Enter your registered email
                  </p>
                </div>

                <div>
                  <Label htmlFor="reason" className="text-gray-900 dark:text-white">
                    سبب الحذف (اختياري) / Reason for Deletion (Optional)
                  </Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="يمكنك إخبارنا بسبب قرارك... / You can tell us your reason..."
                    rows={4}
                    className="mt-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    ⚠️ بإرسال هذا الطلب، أنت توافق على حذف حسابك وجميع بياناتك بشكل نهائي ولا رجعة فيه.
                  </p>
                  <p className="text-sm text-yellow-900 dark:text-yellow-100 mt-1">
                    By submitting this request, you agree to permanently and irreversibly delete your account and all data.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmitting ? "جاري الإرسال... / Sending..." : "إرسال طلب الحذف / Submit Deletion Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              تحتاج مساعدة؟ / Need help?
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                إذا كنت تواجه مشاكل في استخدام المنصة، يمكنك التواصل مع فريق الدعم قبل اتخاذ قرار الحذف.
              </p>
              <p>
                If you're facing issues with the platform, you can contact our support team before deciding to delete.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(createPageUrl("Support"))}
                className="mt-3"
              >
                تواصل مع الدعم / Contact Support
              </Button>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>Last updated: January 2026</p>
            <p>آخر تحديث: يناير 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}