import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "الشروط والأحكام - Terms & Conditions | أستاذي";
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
            <FileText className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              الشروط والأحكام
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Terms & Conditions
          </h2>

          {/* Arabic Version */}
          <div className="space-y-6 mb-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. قبول الشروط</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                باستخدامك لمنصة "أستاذي"، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. التسجيل واستخدام الحساب</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>يجب أن تكون المعلومات المقدمة عند التسجيل دقيقة وكاملة</li>
                <li>أنت مسؤول عن الحفاظ على سرية بيانات حسابك</li>
                <li>يجب أن يكون عمرك 13 عاماً على الأقل لاستخدام المنصة</li>
                <li>حساب واحد لكل مستخدم (ممنوع إنشاء حسابات متعددة)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. مسؤوليات المعلمين</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>تقديم محتوى تعليمي دقيق وموثوق</li>
                <li>الالتزام بالمواعيد المحددة للدروس</li>
                <li>احترام الطلاب والحفاظ على بيئة تعليمية إيجابية</li>
                <li>عدم مشاركة معلومات الطلاب مع أطراف ثالثة</li>
                <li>الالتزام بالقوانين والأنظمة التعليمية المحلية</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. مسؤوليات الطلاب</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>احترام المعلمين والطلاب الآخرين</li>
                <li>الحضور في المواعيد المحددة</li>
                <li>دفع الرسوم المستحقة في الوقت المحدد</li>
                <li>عدم إساءة استخدام المحتوى التعليمي</li>
                <li>الالتزام بقواعد السلوك الأكاديمي</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. المدفوعات والاسترداد</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                سياسة الدفع والاسترداد:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>جميع المدفوعات تتم عبر بوابات دفع آمنة</li>
                <li>يمكن استرداد المبالغ خلال 48 ساعة من الدفع إذا لم تبدأ الخدمة</li>
                <li>لا يمكن استرداد المبالغ بعد بدء الدروس إلا في حالات استثنائية</li>
                <li>تحتفظ المنصة بعمولة على كل معاملة</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. الملكية الفكرية</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>جميع حقوق المحتوى محفوظة للمنصة والمعلمين</li>
                <li>ممنوع نسخ أو توزيع المحتوى التعليمي بدون إذن</li>
                <li>يحتفظ المعلمون بحقوق المحتوى الذي ينشئونه</li>
                <li>يمنح المعلمون المنصة ترخيصاً لعرض المحتوى</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. السلوك المحظور</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                يحظر على المستخدمين:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>التحرش أو الإساءة لأي مستخدم آخر</li>
                <li>نشر محتوى غير قانوني أو مسيء</li>
                <li>محاولة اختراق أو تعطيل المنصة</li>
                <li>استخدام المنصة لأغراض احتيالية</li>
                <li>انتحال الشخصية أو تقديم معلومات مزيفة</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. إيقاف الحسابات</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط، أو أي سلوك غير مقبول، أو استخدام احتيالي للمنصة.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. إخلاء المسؤولية</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>المنصة تعمل كوسيط بين المعلمين والطلاب</li>
                <li>لسنا مسؤولين عن جودة المحتوى التعليمي المقدم</li>
                <li>لسنا مسؤولين عن النتائج الأكاديمية للطلاب</li>
                <li>المعلمون مستقلون وليسوا موظفين لدينا</li>
                <li>نسعى لتوفير منصة آمنة ولكن لا نضمن خلوها من الأخطاء</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. التعديلات على الشروط</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعارات المنصة.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. القانون الحاكم</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                تخضع هذه الشروط لقوانين دولة الكويت. أي نزاع ينشأ عن استخدام المنصة يخضع لاختصاص المحاكم الكويتية.
              </p>
            </div>
          </div>

          {/* English Version */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By using the Ostathi platform, you agree to comply with these terms and conditions. If you do not agree with any of these terms, please do not use the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Registration and Account Use</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Information provided during registration must be accurate and complete</li>
                <li>You are responsible for maintaining the confidentiality of your account data</li>
                <li>You must be at least 13 years old to use the platform</li>
                <li>One account per user (creating multiple accounts is prohibited)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Teacher Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Provide accurate and reliable educational content</li>
                <li>Adhere to scheduled lesson times</li>
                <li>Respect students and maintain a positive learning environment</li>
                <li>Do not share student information with third parties</li>
                <li>Comply with local educational laws and regulations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Student Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Respect teachers and other students</li>
                <li>Attend at scheduled times</li>
                <li>Pay due fees on time</li>
                <li>Do not misuse educational content</li>
                <li>Follow academic conduct rules</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Payments and Refunds</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                Payment and refund policy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>All payments are processed through secure payment gateways</li>
                <li>Refunds are available within 48 hours if the service has not started</li>
                <li>No refunds after lessons begin except in exceptional cases</li>
                <li>The platform retains a commission on each transaction</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Intellectual Property</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>All content rights are reserved to the platform and teachers</li>
                <li>Copying or distributing educational content without permission is prohibited</li>
                <li>Teachers retain rights to the content they create</li>
                <li>Teachers grant the platform a license to display content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Prohibited Conduct</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                Users are prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Harassing or abusing any other user</li>
                <li>Publishing illegal or offensive content</li>
                <li>Attempting to hack or disrupt the platform</li>
                <li>Using the platform for fraudulent purposes</li>
                <li>Impersonation or providing false information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Account Suspension</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate your account in case of violation of these terms, unacceptable behavior, or fraudulent use of the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Disclaimer</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>The platform acts as an intermediary between teachers and students</li>
                <li>We are not responsible for the quality of educational content provided</li>
                <li>We are not responsible for students' academic results</li>
                <li>Teachers are independent and not our employees</li>
                <li>We strive to provide a safe platform but do not guarantee error-free service</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Amendments to Terms</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of any material changes via email or platform notifications.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. Governing Law</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms are subject to the laws of the State of Kuwait. Any dispute arising from the use of the platform is subject to the jurisdiction of Kuwaiti courts.
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