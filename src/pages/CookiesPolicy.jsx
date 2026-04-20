import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cookie } from "lucide-react";

export default function CookiesPolicy() {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "سياسة ملفات تعريف الارتباط - Cookies Policy | أستاذي";
  }, []);

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
            <Cookie className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              سياسة ملفات تعريف الارتباط
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Cookies Policy
          </h2>

          {/* Arabic Version */}
          <div className="space-y-6 mb-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">ما هي ملفات تعريف الارتباط (Cookies)؟</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة منصة "أستاذي". تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمات مخصصة.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">أنواع البيانات المخزنة</h3>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>تفضيلات اللغة والوضع الليلي</li>
                    <li>معلومات تسجيل الدخول (جلسة المصادقة)</li>
                    <li>إحصائيات الاستخدام والتفاعل</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">2. LocalStorage</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>إعدادات المستخدم المحلية</li>
                    <li>بيانات التخزين المؤقت للأداء</li>
                    <li>حالة التطبيق والتفضيلات</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">3. Supabase Auth Sessions</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>رموز المصادقة الآمنة (JWT Tokens)</li>
                    <li>معلومات الجلسة المشفرة</li>
                    <li>حالة تسجيل الدخول</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">لماذا نستخدم Cookies؟</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>تحسين الأداء:</strong> تسريع تحميل الصفحات وتقليل استهلاك البيانات</li>
                <li><strong>التخصيص:</strong> حفظ تفضيلاتك (اللغة، الوضع الليلي، إلخ)</li>
                <li><strong>الأمان:</strong> حماية حسابك والحفاظ على جلسة آمنة</li>
                <li><strong>التحليل:</strong> فهم كيفية استخدام المنصة لتحسين الخدمات</li>
                <li><strong>الوظائف:</strong> تمكين ميزات مثل الدفع، الدردشة، الجلسات المباشرة</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">مدة الاحتفاظ بالبيانات</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Cookies المؤقتة:</strong> تُحذف عند إغلاق المتصفح</li>
                <li><strong>Cookies الدائمة:</strong> تبقى لمدة تصل إلى 30 يوماً</li>
                <li><strong>جلسات المصادقة:</strong> تنتهي بعد 7 أيام من عدم النشاط</li>
                <li><strong>LocalStorage:</strong> يبقى حتى تقوم بحذفه يدوياً</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">التحكم في Cookies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                يمكنك التحكم في ملفات تعريف الارتباط من خلال:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>إعدادات المتصفح: حذف أو حظر Cookies</li>
                <li>وضع التصفح الخاص (Private/Incognito Mode)</li>
                <li>أدوات إدارة البيانات في المتصفح</li>
                <li>تسجيل الخروج: يحذف جلسة المصادقة</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>ملاحظة:</strong> حظر جميع ملفات Cookies قد يؤثر على وظائف المنصة مثل تسجيل الدخول والدفع.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cookies من أطراف ثالثة</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نستخدم خدمات من أطراف ثالثة موثوقة قد تضع ملفات Cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                <li>خدمات التحليلات لفهم سلوك المستخدمين</li>
                <li>بوابات الدفع لمعالجة المعاملات المالية</li>
                <li>خدمات الفيديو للجلسات المباشرة</li>
              </ul>
            </div>
          </div>

          {/* English Version */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What are Cookies?</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Cookies are small text files stored on your device when you visit the Ostathi platform. These files help us improve your experience and provide personalized services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Types of Data Stored</h3>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Language and dark mode preferences</li>
                    <li>Login information (authentication session)</li>
                    <li>Usage and interaction statistics</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">2. LocalStorage</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Local user settings</li>
                    <li>Performance cache data</li>
                    <li>Application state and preferences</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">3. Supabase Auth Sessions</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Secure authentication tokens (JWT Tokens)</li>
                    <li>Encrypted session information</li>
                    <li>Login state</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Why We Use Cookies</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Performance:</strong> Speed up page loading and reduce data consumption</li>
                <li><strong>Personalization:</strong> Save your preferences (language, dark mode, etc.)</li>
                <li><strong>Security:</strong> Protect your account and maintain a secure session</li>
                <li><strong>Analytics:</strong> Understand platform usage to improve services</li>
                <li><strong>Functionality:</strong> Enable features like payments, chat, live sessions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Retention Period</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Session Cookies:</strong> Deleted when browser is closed</li>
                <li><strong>Persistent Cookies:</strong> Remain for up to 30 days</li>
                <li><strong>Authentication Sessions:</strong> Expire after 7 days of inactivity</li>
                <li><strong>LocalStorage:</strong> Remains until manually deleted</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cookie Control</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                You can control cookies through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Browser settings: Delete or block cookies</li>
                <li>Private/Incognito browsing mode</li>
                <li>Browser data management tools</li>
                <li>Logout: Deletes authentication session</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Blocking all cookies may affect platform functionality such as login and payment.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Third-Party Cookies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use trusted third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                <li>Analytics services to understand user behavior</li>
                <li>Payment gateways to process financial transactions</li>
                <li>Video services for live sessions</li>
              </ul>
            </div>

            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <p>Last updated: January 2026</p>
              <p>آخر تحديث: يناير 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}