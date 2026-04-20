/**
 * ==========================================
 * Apple App Store Submission Documentation
 * ==========================================
 * 
 * This file contains all necessary information for Apple App Store submission.
 * Please copy the relevant sections to App Store Connect during submission.
 */

// ==========================================
// 1. APP DESCRIPTION (for App Store Connect)
// ==========================================

export const APP_DESCRIPTION_ARABIC = `
منصة أستاذي - التعليم الإلكتروني

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

التطبيق يتطلب اتصال بالإنترنت للوصول للمحتوى والخدمات.
`;

export const APP_DESCRIPTION_ENGLISH = `
Ostathi Platform - E-Learning

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

The app requires an internet connection to access content and services.
`;

// ==========================================
// 2. APP REVIEW NOTES (for App Store Connect)
// ==========================================

export const APP_REVIEW_NOTES = `
Dear Apple Review Team,

Thank you for reviewing our app. Please note the following important information:

TECHNICAL IMPLEMENTATION:
1. The app uses WebView to display platform content while maintaining native iOS functionality
2. All external links automatically open in the device's default browser (Safari)
3. Service Worker is DISABLED within iOS WebView for App Store compliance
4. The app does not interfere with iOS system functions or settings

COMPLIANCE & POLICIES:
1. Privacy Policy: Available at /privacy-policy (accessible within the app)
2. Terms & Conditions: Available at /terms-and-conditions (accessible within the app)
3. Support Page: Available at /support (accessible within the app)
4. Delete Account: Available at /delete-account (accessible within the app)

ACCOUNT DELETION:
- Users can request account deletion through the in-app form at /delete-account
- Deletion requests are processed within 7 business days
- All user data (personal info, content, messages) is permanently deleted
- The process is irreversible as clearly stated to users

DATA HANDLING:
- The app collects only necessary user data (email, name, profile info)
- All data is stored securely with encryption
- No data is shared with third parties without user consent
- Users can access, modify, or delete their data at any time

CONTENT MODERATION:
- Educational content is monitored by platform administrators
- Users can report inappropriate content
- Content guidelines are enforced to maintain quality

USER AUTHENTICATION:
- Email/password authentication via Supabase
- OAuth options for Google login
- Secure session management

TEST ACCOUNT (if needed):
Email: [Add test account email]
Password: [Add test account password]

The app is fully functional on iOS and complies with all Apple guidelines.

Thank you,
Ostathi Development Team
`;

// ==========================================
// 3. KEYWORDS (for App Store Optimization)
// ==========================================

export const APP_KEYWORDS = [
  'تعليم',
  'معلم',
  'دروس',
  'تعليم إلكتروني',
  'education',
  'teacher',
  'tutor',
  'online learning',
  'e-learning',
  'study',
  'lessons',
  'homework',
  'مدرس',
  'واجبات',
  'دراسة'
];

// ==========================================
// 4. PRIVACY POLICY URL
// ==========================================

export const PRIVACY_POLICY_URL = 'https://[your-domain]/privacy-policy';

// ==========================================
// 5. SUPPORT URL
// ==========================================

export const SUPPORT_URL = 'https://[your-domain]/support';

// ==========================================
// 6. MARKETING URL (Optional)
// ==========================================

export const MARKETING_URL = 'https://[your-domain]';

// ==========================================
// 7. COPYRIGHT
// ==========================================

export const COPYRIGHT = '© 2026 Ostathi Platform. All rights reserved.';

// ==========================================
// 8. CATEGORY
// ==========================================

export const PRIMARY_CATEGORY = 'Education';
export const SECONDARY_CATEGORY = 'Productivity';

// ==========================================
// 9. AGE RATING
// ==========================================

export const AGE_RATING = {
  minAge: '4+',
  contentDescriptors: [
    'No objectionable content'
  ]
};

// ==========================================
// 10. SCREENSHOTS CHECKLIST
// ==========================================

export const SCREENSHOTS_CHECKLIST = `
Required Screenshots for App Store:

iPhone (6.7" display - iPhone 14 Pro Max):
- Home screen showing main features
- Browse teachers page
- Student dashboard
- Video session interface
- Chat interface
- Account settings with delete option

iPhone (6.5" display - iPhone 11 Pro Max):
- Same as above

iPad Pro (12.9" display):
- Same screens optimized for tablet
- Show responsive design

All screenshots should:
✓ Show actual app functionality
✓ Include Arabic language interface
✓ Avoid placeholder content
✓ Show polished, production-ready screens
✓ Include Privacy Policy, Support, and Delete Account links visible
`;

// ==========================================
// 11. DEMO VIDEO SCRIPT (Optional)
// ==========================================

export const DEMO_VIDEO_SCRIPT = `
App Preview Video Script (15-30 seconds):

1. Opening (2s): App icon animation + "منصة أستاذي"
2. Browse (3s): Scrolling through teacher listings
3. Dashboard (3s): Student viewing their progress
4. Video Session (3s): Live video lesson interface
5. Chat (2s): Secure messaging between student and teacher
6. Features (2s): Quick montage of key features
7. Closing (2s): App icon + "متاح الآن"

Notes:
- Use actual app screens, no mockups
- Show smooth transitions
- Include Arabic text clearly
- Background music: Light, educational theme
- No voice-over needed
`;

// ==========================================
// 12. WHAT'S NEW (for updates)
// ==========================================

export const WHATS_NEW_V1 = `
النسخة 1.0 - الإصدار الأول

المميزات:
• منصة تعليمية كاملة تربط الطلاب بالمعلمين
• دروس مباشرة عبر الفيديو
• نظام واجبات وتقييمات شامل
• محادثة آمنة بين الطلاب والمعلمين
• جدول منظم للحصص
• إمكانية حذف الحساب
• سياسة خصوصية شاملة

Version 1.0 - Initial Release

Features:
• Complete educational platform connecting students with teachers
• Live video lessons
• Comprehensive assignments and assessments system
• Secure chat between students and teachers
• Organized class schedule
• Account deletion option
• Comprehensive privacy policy
`;

// ==========================================
// USAGE INSTRUCTIONS
// ==========================================

/*

HOW TO USE THIS FILE FOR APP STORE SUBMISSION:

1. APP DESCRIPTION:
   - Copy APP_DESCRIPTION_ARABIC to "Description (Arabic)" field
   - Copy APP_DESCRIPTION_ENGLISH to "Description (English)" field

2. APP REVIEW NOTES:
   - Copy APP_REVIEW_NOTES to "App Review Information > Notes" field
   - Replace [Add test account email/password] with actual test credentials

3. KEYWORDS:
   - Join APP_KEYWORDS array elements with commas
   - Paste in "Keywords" field (max 100 characters)

4. URLS:
   - Update [your-domain] with your actual domain
   - Add Privacy Policy URL
   - Add Support URL

5. SCREENSHOTS:
   - Follow SCREENSHOTS_CHECKLIST
   - Upload at least 3 screenshots per device size

6. DEMO VIDEO (Optional):
   - Follow DEMO_VIDEO_SCRIPT
   - Upload as App Preview

7. AGE RATING:
   - Select "4+" in Age Rating section
   - Confirm no objectionable content

Remember:
- Be honest and accurate in all descriptions
- Provide real test account if app requires login
- Ensure all URLs are accessible and working
- Test the app thoroughly before submission

*/