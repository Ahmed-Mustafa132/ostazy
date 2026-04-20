import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Copy, CheckCircle, Apple, FileText, Globe, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AppStoreInfo() {
  const navigate = useNavigate();
  const [copiedSection, setCopiedSection] = React.useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success("تم النسخ إلى الحافظة");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const APP_DESCRIPTION_AR = `منصة أستاذي - التعليم الإلكتروني

منصة تعليمية تربط الطلاب بالمعلمين والمراكز التعليمية في جميع أنحاء الوطن العربي.

المميزات الرئيسية:
• البحث عن معلمين ومراكز تعليمية معتمدة
• دروس مباشرة عبر الإنترنت أو في المنزل
• متابعة التقدم الدراسي والواجبات
• نظام محادثة آمن بين الطلاب والمعلمين
• جدول منظم للحصص والمواعيد
• نظام دفع آمن ومحمي

للطلاب:
- التواصل مع معلمين مؤهلين
- متابعة الأهداف الدراسية
- استلام الواجبات والتقييمات
- الدروس المباشرة عبر الفيديو

للمعلمين:
- إدارة المجموعات الدراسية
- تتبع حضور الطلاب وتقدمهم
- إنشاء واجبات وتقييمات
- نظام محفظة للمدفوعات

الخصوصية والأمان:
• نحترم خصوصية بياناتك
• تشفير شامل للمحادثات
• إمكانية حذف الحساب في أي وقت
• عدم مشاركة البيانات مع أطراف ثالثة

التطبيق يتطلب اتصال بالإنترنت للوصول للمحتوى والخدمات.`;

  const APP_DESCRIPTION_EN = `Ostathi Platform - E-Learning

An educational platform connecting students with teachers and educational centers across the Arab world.

Key Features:
• Search for verified teachers and educational centers
• Live lessons online or at home
• Track academic progress and assignments
• Secure chat system between students and teachers
• Organized schedule for sessions and appointments
• Safe and secure payment system

For Students:
- Connect with qualified teachers
- Track academic goals
- Receive assignments and evaluations
- Live video lessons

For Teachers:
- Manage study groups
- Track student attendance and progress
- Create assignments and assessments
- Wallet system for payments

Privacy & Security:
• We respect your data privacy
• End-to-end encryption for chats
• Account deletion available anytime
• No data sharing with third parties

The app requires an internet connection to access content and services.`;

  const APP_REVIEW_NOTES = `Dear Apple Review Team,

Thank you for reviewing our app. Please note the following important information:

✅ TECHNICAL IMPLEMENTATION:
1. The app uses WebView to display platform content while maintaining native iOS functionality
2. All external links automatically open in the device's default browser (Safari)
3. Service Worker is DISABLED within iOS WebView for App Store compliance
4. The app does not interfere with iOS system functions or settings

✅ COMPLIANCE & POLICIES:
1. Privacy Policy: Available at /privacy-policy (accessible within the app)
2. Terms & Conditions: Available at /terms-and-conditions (accessible within the app)
3. Cookies Policy: Available at /cookies-policy (accessible within the app)
4. Support Page: Available at /support (accessible within the app)
5. Delete Account: Available at /delete-account (accessible within the app)

✅ ACCOUNT DELETION (Required by Apple):
- Users can request account deletion through the in-app form at /delete-account
- Deletion requests are processed within 7 business days
- All user data is permanently deleted:
  * Personal information (name, email, profile)
  * Study content, assignments, and grades
  * Subscriptions and group memberships
  * Chat and message history
- The process is irreversible as clearly stated to users
- No login required to access deletion page

✅ DATA HANDLING:
- The app collects only necessary user data (email, name, profile info)
- All data is stored securely with encryption
- No data is shared with third parties without user consent
- Users can access, modify, or delete their data at any time

✅ CONTENT MODERATION:
- Educational content is monitored by platform administrators
- Users can report inappropriate content
- Content guidelines are enforced to maintain quality

✅ USER AUTHENTICATION:
- Email/password authentication via secure backend
- OAuth options for Google login
- Secure session management

✅ EXTERNAL LINKS:
- All external links open in Safari (not within WebView)
- Complies with Apple's WebView policies

✅ SERVICE WORKER:
- Disabled on iOS WebView
- Enabled only for web browsers and Android
- No impact on iOS app functionality

The app is fully functional on iOS and complies with all Apple App Store guidelines.

Best regards,
Ostathi Development Team`;

  const GOOGLE_PLAY_DESCRIPTION = `منصة أستاذي - التعليم الإلكتروني

🎓 منصة تعليمية شاملة تربط الطلاب بالمعلمين والمراكز التعليمية

✨ المميزات الرئيسية:
• 🔍 البحث عن معلمين ومراكز تعليمية معتمدة
• 📹 دروس مباشرة عبر الإنترنت أو في المنزل
• 📊 متابعة التقدم الدراسي والواجبات
• 💬 نظام محادثة آمن بين الطلاب والمعلمين
• 📅 جدول منظم للحصص والمواعيد
• 💳 نظام دفع آمن ومحمي

👨‍🎓 للطلاب:
✓ التواصل مع معلمين مؤهلين
✓ متابعة الأهداف الدراسية
✓ استلام الواجبات والتقييمات
✓ الدروس المباشرة عبر الفيديو

👨‍🏫 للمعلمين:
✓ إدارة المجموعات الدراسية
✓ تتبع حضور الطلاب وتقدمهم
✓ إنشاء واجبات وتقييمات
✓ نظام محفظة للمدفوعات

🔒 الخصوصية والأمان:
• حماية كاملة لبياناتك
• تشفير شامل للمحادثات
• إمكانية حذف الحساب في أي وقت
• عدم مشاركة البيانات مع أطراف ثالثة

📱 متطلبات التطبيق:
• اتصال بالإنترنت
• Android 5.0 فما فوق

حمّل التطبيق الآن وابدأ رحلتك التعليمية!`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:bg-green-600 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              عودة
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-8 h-8 text-green-600" />
                معلومات التسجيل في المتاجر
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Apple App Store & Google Play Store</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="apple" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <TabsTrigger value="apple" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              Apple App Store
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Google Play
            </TabsTrigger>
          </TabsList>

          {/* Apple App Store Tab */}
          <TabsContent value="apple" className="space-y-6">
            {/* App Description */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5 text-blue-600" />
                    وصف التطبيق - App Description
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(APP_DESCRIPTION_AR, 'ar')}
                  >
                    {copiedSection === 'ar' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    نسخ العربي
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">النسخة العربية:</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{APP_DESCRIPTION_AR}</pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(APP_DESCRIPTION_EN, 'en')}
                  className="w-full"
                >
                  {copiedSection === 'en' ? <CheckCircle className="w-4 h-4 text-green-600 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
                  نسخ النسخة الإنجليزية
                </Button>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">English Version:</h3>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{APP_DESCRIPTION_EN}</pre>
                </div>
              </CardContent>
            </Card>

            {/* App Review Notes */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Shield className="w-5 h-5 text-red-600" />
                    App Review Notes
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(APP_REVIEW_NOTES, 'notes')}
                  >
                    {copiedSection === 'notes' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    نسخ
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{APP_REVIEW_NOTES}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">معلومات أساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span>Education</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Age Rating:</span>
                    <span>4+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Keywords:</span>
                    <span className="text-xs">تعليم,معلم,دروس,education,teacher</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">روابط مطلوبة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-semibold">Privacy Policy:</span>
                    <p className="text-xs">/privacy-policy</p>
                  </div>
                  <div>
                    <span className="font-semibold">Terms:</span>
                    <p className="text-xs">/terms-and-conditions</p>
                  </div>
                  <div>
                    <span className="font-semibold">Support:</span>
                    <p className="text-xs">/support</p>
                  </div>
                  <div>
                    <span className="font-semibold">Delete Account:</span>
                    <p className="text-xs">/delete-account</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Google Play Tab */}
          <TabsContent value="google" className="space-y-6">
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5 text-green-600" />
                    وصف التطبيق - Google Play Description
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(GOOGLE_PLAY_DESCRIPTION, 'google')}
                  >
                    {copiedSection === 'google' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    نسخ
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{GOOGLE_PLAY_DESCRIPTION}</pre>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">معلومات Google Play</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span>Education</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Content Rating:</span>
                    <span>Everyone</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Min SDK:</span>
                    <span>21 (Android 5.0)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">الأذونات المطلوبة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>• INTERNET</div>
                  <div>• CAMERA (للصور)</div>
                  <div>• STORAGE (للملفات)</div>
                  <div>• NOTIFICATIONS</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Checklist */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">✅ قائمة التحقق النهائية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <div>✓ Privacy Policy متاحة (/privacy-policy)</div>
            <div>✓ Terms & Conditions متاحة (/terms-and-conditions)</div>
            <div>✓ Support Page متاحة (/support)</div>
            <div>✓ Delete Account متاحة (/delete-account)</div>
            <div>✓ روابط خارجية تفتح في Safari</div>
            <div>✓ Service Worker معطل على iOS</div>
            <div>✓ وصف التطبيق جاهز</div>
            <div>✓ App Review Notes جاهزة</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}