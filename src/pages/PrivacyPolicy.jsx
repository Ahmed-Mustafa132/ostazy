import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "سياسة الخصوصية - Privacy Policy | أستاذي";
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
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              سياسة الخصوصية
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Privacy Policy
          </h2>

          {/* Arabic Version */}
          <div className="space-y-6 mb-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">مقدمة</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نحن في منصة "أستاذي" نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا التعليمية.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">المعلومات التي نجمعها</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>معلومات التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف</li>
                <li>معلومات الملف الشخصي: الصورة الشخصية، المؤهلات، الخبرات</li>
                <li>البيانات التعليمية: المواد، المراحل الدراسية، السجل الأكاديمي</li>
                <li>معلومات الدفع: تفاصيل المعاملات المالية (مشفرة)</li>
                <li>بيانات الاستخدام: سجلات النشاط، الحضور، التفاعل مع المحتوى</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">كيف نستخدم معلوماتك</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>توفير وتحسين خدماتنا التعليمية</li>
                <li>التواصل معك بشأن حسابك والخدمات</li>
                <li>معالجة المدفوعات والمعاملات المالية</li>
                <li>تحليل وتحسين أداء المنصة</li>
                <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">حماية البيانات</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نستخدم تقنيات التشفير المتقدمة وبروتوكولات الأمان لحماية بياناتك. يتم تخزين جميع المعلومات على خوادم آمنة مع نسخ احتياطية منتظمة.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">مشاركة المعلومات</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                لن نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                <li>بموافقتك الصريحة</li>
                <li>لمعالجة المدفوعات مع مزودي خدمات الدفع المعتمدين</li>
                <li>للامتثال للمتطلبات القانونية</li>
                <li>لحماية حقوقنا وسلامة المستخدمين</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">حقوقك</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                لديك الحق في الوصول إلى بياناتك، تعديلها، حذفها، أو تقييد استخدامها. يمكنك أيضاً الاعتراض على معالجة بياناتك أو طلب نقلها.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">ملفات تعريف الارتباط (Cookies)</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك، حفظ تفضيلاتك، وتحليل استخدام المنصة. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">التواصل معنا</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                لأي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@ostathi.com
              </p>
            </div>
          </div>

          {/* English Version */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Introduction</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                At Ostathi platform, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information when using our educational platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Registration information: Name, email, phone number</li>
                <li>Profile information: Profile picture, qualifications, experience</li>
                <li>Educational data: Subjects, grades, academic records</li>
                <li>Payment information: Financial transaction details (encrypted)</li>
                <li>Usage data: Activity logs, attendance, content interaction</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Provide and improve our educational services</li>
                <li>Communicate with you about your account and services</li>
                <li>Process payments and financial transactions</li>
                <li>Analyze and improve platform performance</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Protection</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use advanced encryption technologies and security protocols to protect your data. All information is stored on secure servers with regular backups.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Information Sharing</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We will not share your personal information with third parties except in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                <li>With your explicit consent</li>
                <li>To process payments with approved payment service providers</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and user safety</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Your Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You have the right to access, modify, delete, or restrict the use of your data. You can also object to data processing or request data portability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cookies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use cookies to improve your experience, save your preferences, and analyze platform usage. You can control cookie settings through your browser.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Contact Us</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For any inquiries about the privacy policy, please contact us at: privacy@ostathi.com
              </p>
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