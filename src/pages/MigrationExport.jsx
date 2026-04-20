import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileJson, Database, Shield, Link as LinkIcon, List } from "lucide-react";

export default function MigrationExport() {
  
  const entitiesSchema = {
    "User": {
      "description": "المستخدم الأساسي (Built-in)",
      "fields": {
        "id": { "type": "uuid", "required": true, "description": "Primary Key" },
        "email": { "type": "string", "required": true },
        "full_name": { "type": "string", "required": false },
        "role": { "type": "string", "enum": ["admin", "user"], "default": "user" },
        "user_type": { "type": "string", "enum": ["student", "teacher", "center"], "description": "Added via profile update" },
        "created_at": { "type": "timestamp", "default": "now()" }
      }
    },
    "Notification": {
      "fields": {
        "user_email": { "type": "string", "required": true, "description": "Foreign Key to User.email" },
        "title": { "type": "string", "required": true },
        "message": { "type": "string", "required": true },
        "type": { "type": "string", "enum": ["assignment", "session", "message", "payment", "announcement", "general"] },
        "link": { "type": "string" },
        "is_read": { "type": "boolean", "default": false },
        "priority": { "type": "string", "enum": ["low", "normal", "high", "urgent"], "default": "normal" },
        "related_id": { "type": "string", "description": "Polymorphic ID reference" }
      }
    },
    "TeacherProfile": {
      "fields": {
        "user_email": { "type": "string", "required": true, "unique": true },
        "name": { "type": "string", "required": true },
        "bio": { "type": "string" },
        "subjects": { "type": "array", "items": "string", "required": true },
        "stages": { "type": "array", "items": "string", "required": true },
        "curriculum": { "type": "array", "items": "string" },
        "teaching_type": { "type": "array", "items": "string", "enum": ["online", "home"], "required": true },
        "hourly_rate": { "type": "number", "required": true },
        "currency": { "type": "string", "default": "KWD" },
        "video_url": { "type": "string" },
        "video_introduction": { "type": "string" },
        "portfolio": { 
          "type": "array", 
          "items": "object",
          "properties": {
            "title": "string",
            "description": "string",
            "file_url": "string",
            "type": "enum['lesson_plan', 'success_story', 'project', 'certificate', 'other']"
          }
        },
        "country": { "type": "string" },
        "city": { "type": "string" },
        "area": { "type": "string" },
        "years_experience": { "type": "number" },
        "is_approved": { "type": "boolean", "default": false },
        "rating": { "type": "number", "default": 0 },
        "total_students": { "type": "number", "default": 0 },
        "avatar_url": { "type": "string" }
      }
    },
    "StudyGroup": {
      "fields": {
        "teacher_email": { "type": "string", "required": true },
        "name": { "type": "string", "required": true },
        "subject": { "type": "string", "required": true },
        "stage": { "type": "string", "required": true },
        "curriculum": { "type": "string" },
        "price_per_session": { "type": "number", "required": true },
        "schedule": { 
          "type": "array", 
          "items": "object",
          "properties": { "day": "string", "time": "string" }
        },
        "students": { "type": "array", "items": "string", "description": "Array of Student Emails" },
        "max_students": { "type": "number" },
        "description": { "type": "string" },
        "image_url": { "type": "string" },
        "status": { "type": "string", "enum": ["active", "inactive", "completed"], "default": "active" }
      }
    },
    "Enrollment": {
      "fields": {
        "student_email": { "type": "string", "required": true },
        "group_id": { "type": "string", "required": true },
        "teacher_email": { "type": "string", "required": true },
        "status": { "type": "string", "enum": ["active", "completed", "cancelled"], "default": "active" },
        "progress_percentage": { "type": "number", "default": 0 },
        "attendance_count": { "type": "number", "default": 0 },
        "total_sessions": { "type": "number", "default": 0 }
      }
    },
    "Assignment": {
      "fields": {
        "teacher_email": { "type": "string", "required": true },
        "group_id": { "type": "string", "required": true },
        "title": { "type": "string", "required": true },
        "description": { "type": "string" },
        "due_date": { "type": "string", "format": "date" },
        "file_url": { "type": "string" },
        "resources": { "type": "array", "items": "object", "properties": { "name": "string", "url": "string" } },
        "max_score": { "type": "number", "default": 100 }
      }
    },
    "AssignmentSubmission": {
      "fields": {
        "assignment_id": { "type": "string", "required": true },
        "student_email": { "type": "string", "required": true },
        "submission_text": { "type": "string" },
        "file_url": { "type": "string" },
        "submitted_at": { "type": "string", "format": "date-time" },
        "score": { "type": "number" },
        "feedback": { "type": "string" },
        "status": { "type": "string", "enum": ["submitted", "graded", "late"], "default": "submitted" }
      }
    },
    "ChatMessage": {
      "fields": {
        "sender_email": { "type": "string", "required": true },
        "receiver_email": { "type": "string", "required": true },
        "group_id": { "type": "string" },
        "message": { "type": "string", "required": true },
        "file_url": { "type": "string" },
        "is_read": { "type": "boolean", "default": false }
      }
    },
    "EducationalCenter": {
      "fields": {
        "user_email": { "type": "string", "required": true },
        "name": { "type": "string", "required": true },
        "description": { "type": "string" },
        "subjects": { "type": "array", "items": "string" },
        "stages": { "type": "array", "items": "string" },
        "curriculum": { "type": "array", "items": "string" },
        "country": { "type": "string", "required": true },
        "city": { "type": "string", "required": true },
        "area": { "type": "string" },
        "address": { "type": "string" },
        "phone": { "type": "string", "required": true },
        "price_per_month": { "type": "number", "required": true },
        "video_url": { "type": "string" },
        "images": { "type": "array", "items": "string" },
        "is_approved": { "type": "boolean", "default": false },
        "rating": { "type": "number", "default": 0 },
        "total_students": { "type": "number", "default": 0 }
      }
    },
    "Review": {
      "fields": {
        "teacher_email": { "type": "string", "required": true },
        "student_email": { "type": "string", "required": true },
        "group_id": { "type": "string" },
        "rating": { "type": "number", "min": 1, "max": 5, "required": true },
        "comment": { "type": "string" },
        "aspects": { "type": "object", "properties": { "teaching_quality": "number", "communication": "number" } },
        "is_verified": { "type": "boolean", "default": false }
      }
    },
    "Wallet": {
      "fields": {
        "user_email": { "type": "string", "required": true },
        "balance": { "type": "number", "default": 0 },
        "currency": { "type": "string", "default": "KWD" },
        "total_earnings": { "type": "number", "default": 0 },
        "total_withdrawn": { "type": "number", "default": 0 },
        "pending_amount": { "type": "number", "default": 0 },
        "bank_account": { "type": "object" }
      }
    },
    "Payment": {
      "fields": {
        "student_email": { "type": "string", "required": true },
        "teacher_email": { "type": "string" },
        "amount": { "type": "number", "required": true },
        "currency": { "type": "string", "default": "KWD" },
        "payment_type": { "type": "string", "enum": ["enrollment", "service", "session"], "required": true },
        "related_id": { "type": "string" },
        "payment_method": { "type": "string" },
        "transaction_id": { "type": "string" },
        "status": { "type": "string", "default": "pending" }
      }
    },
    "EducationalService": {
      "fields": {
        "provider_email": { "type": "string", "required": true },
        "title": { "type": "string", "required": true },
        "service_type": { "type": "string", "required": true },
        "price": { "type": "number", "required": true },
        "delivery_days": { "type": "number" },
        "is_active": { "type": "boolean", "default": true }
      }
    },
    "PersonalGoal": {
      "fields": {
        "student_email": { "type": "string", "required": true },
        "title": { "type": "string", "required": true },
        "category": { "type": "string", "required": true },
        "target_date": { "type": "string" },
        "progress_percentage": { "type": "number", "default": 0 },
        "status": { "type": "string", "default": "active" }
      }
    }
  };

  const relations = {
    "User": {
      "relations": {
        "has_one_teacher_profile": { "target": "TeacherProfile", "key": "user_email", "foreign_key": "email" },
        "has_one_center_profile": { "target": "EducationalCenter", "key": "user_email", "foreign_key": "email" },
        "has_one_wallet": { "target": "Wallet", "key": "user_email", "foreign_key": "email" },
        "has_many_enrollments": { "target": "Enrollment", "key": "student_email", "foreign_key": "email" }
      }
    },
    "TeacherProfile": {
      "relations": {
        "belongs_to_user": { "target": "User", "key": "email", "foreign_key": "user_email" },
        "has_many_groups": { "target": "StudyGroup", "key": "teacher_email", "foreign_key": "user_email" }
      }
    },
    "StudyGroup": {
      "relations": {
        "belongs_to_teacher": { "target": "TeacherProfile", "key": "user_email", "foreign_key": "teacher_email" },
        "has_many_enrollments": { "target": "Enrollment", "key": "group_id", "foreign_key": "id" },
        "has_many_assignments": { "target": "Assignment", "key": "group_id", "foreign_key": "id" },
        "has_many_announcements": { "target": "Announcement", "key": "group_id", "foreign_key": "id" },
        "has_many_chat_messages": { "target": "ChatMessage", "key": "group_id", "foreign_key": "id" }
      }
    },
    "Enrollment": {
      "relations": {
        "belongs_to_student": { "target": "User", "key": "email", "foreign_key": "student_email" },
        "belongs_to_group": { "target": "StudyGroup", "key": "id", "foreign_key": "group_id" },
        "belongs_to_teacher": { "target": "TeacherProfile", "key": "user_email", "foreign_key": "teacher_email" }
      }
    },
    "Assignment": {
      "relations": {
        "belongs_to_group": { "target": "StudyGroup", "key": "id", "foreign_key": "group_id" },
        "belongs_to_teacher": { "target": "TeacherProfile", "key": "user_email", "foreign_key": "teacher_email" },
        "has_many_submissions": { "target": "AssignmentSubmission", "key": "assignment_id", "foreign_key": "id" }
      }
    },
    "AssignmentSubmission": {
      "relations": {
        "belongs_to_assignment": { "target": "Assignment", "key": "id", "foreign_key": "assignment_id" },
        "belongs_to_student": { "target": "User", "key": "email", "foreign_key": "student_email" }
      }
    },
    "ChatMessage": {
      "relations": {
        "sent_by": { "target": "User", "key": "email", "foreign_key": "sender_email" },
        "received_by": { "target": "User", "key": "email", "foreign_key": "receiver_email" },
        "belongs_to_group": { "target": "StudyGroup", "key": "id", "foreign_key": "group_id" }
      }
    },
    "Notification": {
      "relations": {
        "for_user": { "target": "User", "key": "email", "foreign_key": "user_email" }
      }
    },
    "Review": {
      "relations": {
        "belongs_to_teacher": { "target": "TeacherProfile", "key": "user_email", "foreign_key": "teacher_email" },
        "written_by_student": { "target": "User", "key": "email", "foreign_key": "student_email" }
      }
    }
  };

  const authSchema = {
    "authentication_provider": "Supabase Auth / Base44 Auth",
    "identification_key": "id (UUID)",
    "secondary_key": "email",
    "user_profile_strategy": "Separate 'user_profiles' table or 'TeacherProfile'/'EducationalCenter' entities linked by email",
    "fields": {
      "id": "Unique User ID (UUID) - managed by Auth Provider",
      "email": "User Email - Managed by Auth Provider",
      "encrypted_password": "Managed by Auth Provider (not accessible)",
      "created_at": "Timestamp",
      "last_sign_in": "Timestamp"
    },
    "metadata_stored_in_auth": {
      "full_name": "string",
      "role": "string (user/admin)",
      "user_type": "string (student/teacher/center)"
    },
    "migration_strategy": {
      "firebase_auth": {
        "uid": "Map from Base44/Supabase 'id'",
        "email": "Map from 'email'",
        "custom_claims": ["role", "user_type"]
      },
      "firestore_users_collection": {
        "document_id": "Must match Auth UID",
        "fields": ["email", "full_name", "role", "user_type", "created_at"]
      }
    }
  };

  const apiUsageMap = {
    "api_client_file": "components/SupabaseClient.js",
    "base_url": "https://jwfawrdwlhixjjyxposq.supabase.co",
    "files_using_api": [
      {
        "file": "components/MobileBottomNav.jsx",
        "usage": "supabase.auth.getCurrentUserWithProfile()"
      },
      {
        "file": "pages/Home.js",
        "usage": "supabase.auth.getCurrentUserWithProfile()"
      },
      {
        "file": "pages/UserLogin.js",
        "usage": [
          "supabase.auth.signUp",
          "supabase.auth.signInWithPassword",
          "supabase.from('user_profiles').insert"
        ]
      },
      {
        "file": "pages/StudentDashboard.js",
        "usage": [
          "supabase.auth.getCurrentUserWithProfile()",
          "supabase.from('enrollments').select",
          "supabase.from('study_groups').select",
          "supabase.from('assignments').select",
          "supabase.from('personal_goals').insert/update/delete"
        ]
      },
      {
        "file": "pages/TeacherDashboard.js",
        "usage": ["supabase.auth.getCurrentUserWithProfile()"]
      },
      {
        "file": "pages/TeacherGroups.js",
        "usage": [
          "supabase.auth.getCurrentUserWithProfile()",
          "supabase.from('study_groups').select"
        ]
      },
      {
        "file": "pages/Browse.js",
        "usage": ["supabase.from('study_groups').select.ilike"]
      },
      {
        "file": "pages/GroupDetails.js",
        "usage": ["supabase.from('study_groups').select.single"]
      },
      {
        "file": "pages/TeacherDetails.js",
        "usage": ["supabase.from('teacher_profiles').select.single"]
      },
      {
        "file": "pages/Messages.js",
        "usage": ["supabase.auth.getCurrentUserWithProfile()"]
      },
      {
        "file": "components/NotificationCenter.js",
        "usage": [
          "supabase.from('notifications').select",
          "supabase.from('notifications').update",
          "supabase.from('notifications').delete"
        ]
      },
      {
        "file": "pages/EnrollGroup.js",
        "usage": [
          "supabase.from('study_groups').select.single",
          "supabase.from('enrollments').insert"
        ]
      }
    ],
    "endpoints_summary": {
      "GET": [
        "rest/v1/study_groups",
        "rest/v1/teacher_profiles",
        "rest/v1/enrollments",
        "rest/v1/assignments",
        "rest/v1/notifications",
        "rest/v1/user_profiles"
      ],
      "POST": [
        "auth/v1/signup",
        "auth/v1/token",
        "rest/v1/enrollments",
        "rest/v1/personal_goals"
      ],
      "PATCH": [
        "rest/v1/notifications",
        "rest/v1/personal_goals",
        "rest/v1/user_profiles"
      ],
      "DELETE": [
        "rest/v1/notifications",
        "rest/v1/personal_goals"
      ]
    }
  };

  const sampleData = {
    "TeacherProfile_list": [
      {
        "user_email": "teacher1@example.com",
        "name": "أحمد العلي",
        "subjects": ["رياضيات", "فيزياء"],
        "stages": ["ثانوي"],
        "teaching_type": ["online"],
        "hourly_rate": 15,
        "currency": "KWD",
        "bio": "مدرس خبرة 10 سنوات",
        "country": "الكويت",
        "city": "الكويت",
        "is_approved": true
      },
      {
        "user_email": "teacher2@example.com",
        "name": "سارة محمد",
        "subjects": ["لغة إنجليزية"],
        "stages": ["متوسط", "ثانوي"],
        "teaching_type": ["home", "online"],
        "hourly_rate": 20,
        "currency": "KWD",
        "bio": "مدرسة لغة انجليزية معتمدة",
        "country": "الكويت",
        "city": "حولي",
        "is_approved": true
      },
      {
        "user_email": "teacher3@example.com",
        "name": "خالد يوسف",
        "subjects": ["كيمياء"],
        "stages": ["ثانوي"],
        "teaching_type": ["online"],
        "hourly_rate": 12,
        "currency": "KWD",
        "bio": "شرح مبسط للكيمياء",
        "country": "السعودية",
        "city": "الرياض",
        "is_approved": false
      }
    ],
    "TeacherProfile_item": {
      "user_email": "teacher1@example.com",
      "name": "أحمد العلي",
      "subjects": ["رياضيات", "فيزياء"],
      "stages": ["ثانوي"],
      "teaching_type": ["online"],
      "hourly_rate": 15,
      "currency": "KWD",
      "bio": "مدرس خبرة 10 سنوات في تدريس المناهج الكويتية",
      "video_introduction": "https://example.com/video.mp4",
      "country": "الكويت",
      "city": "الكويت",
      "years_experience": 10,
      "rating": 4.8,
      "total_students": 150,
      "is_approved": true,
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "StudyGroup_list": [
      {
        "id": "group-1",
        "teacher_email": "teacher1@example.com",
        "name": "مراجعة نهائية رياضيات",
        "subject": "رياضيات",
        "stage": "ثانوي",
        "price_per_session": 10,
        "status": "active",
        "max_students": 20,
        "students": ["student1@example.com", "student2@example.com"]
      },
      {
        "id": "group-2",
        "teacher_email": "teacher1@example.com",
        "name": "تأسيس فيزياء",
        "subject": "فيزياء",
        "stage": "ثانوي",
        "price_per_session": 12,
        "status": "active",
        "max_students": 15,
        "students": []
      },
      {
        "id": "group-3",
        "teacher_email": "teacher2@example.com",
        "name": "محادثة إنجليزي",
        "subject": "لغة إنجليزية",
        "stage": "عام",
        "price_per_session": 15,
        "status": "completed",
        "max_students": 10,
        "students": ["student3@example.com"]
      }
    ],
    "StudyGroup_item": {
      "id": "group-1",
      "teacher_email": "teacher1@example.com",
      "name": "مراجعة نهائية رياضيات",
      "subject": "رياضيات",
      "stage": "ثانوي",
      "curriculum": "المنهج الوطني",
      "price_per_session": 10,
      "schedule": [
        { "day": "الأحد", "time": "16:00" },
        { "day": "الثلاثاء", "time": "16:00" }
      ],
      "students": ["student1@example.com", "student2@example.com"],
      "max_students": 20,
      "description": "مراجعة شاملة للمنهج وحل اختبارات سابقة",
      "image_url": "https://example.com/math.jpg",
      "status": "active"
    },
    "Enrollment_list": [
      {
        "id": "enroll-1",
        "student_email": "student1@example.com",
        "group_id": "group-1",
        "teacher_email": "teacher1@example.com",
        "status": "active",
        "progress_percentage": 25
      },
      {
        "id": "enroll-2",
        "student_email": "student2@example.com",
        "group_id": "group-1",
        "teacher_email": "teacher1@example.com",
        "status": "active",
        "progress_percentage": 10
      },
      {
        "id": "enroll-3",
        "student_email": "student3@example.com",
        "group_id": "group-3",
        "teacher_email": "teacher2@example.com",
        "status": "completed",
        "progress_percentage": 100
      }
    ],
    "Enrollment_item": {
      "id": "enroll-1",
      "student_email": "student1@example.com",
      "group_id": "group-1",
      "teacher_email": "teacher1@example.com",
      "status": "active",
      "progress_percentage": 45,
      "attendance_count": 4,
      "total_sessions": 10,
      "created_at": "2024-01-15T10:00:00Z"
    },
    "Assignment_list": [
      {
        "id": "assign-1",
        "title": "حل تمارين الفصل الأول",
        "group_id": "group-1",
        "teacher_email": "teacher1@example.com",
        "due_date": "2024-02-01",
        "max_score": 10
      },
      {
        "id": "assign-2",
        "title": "مشروع الفيزياء",
        "group_id": "group-2",
        "teacher_email": "teacher1@example.com",
        "due_date": "2024-02-10",
        "max_score": 20
      },
      {
        "id": "assign-3",
        "title": "Essay Writing",
        "group_id": "group-3",
        "teacher_email": "teacher2@example.com",
        "due_date": "2024-01-20",
        "max_score": 100
      }
    ],
    "Assignment_item": {
      "id": "assign-1",
      "teacher_email": "teacher1@example.com",
      "group_id": "group-1",
      "title": "حل تمارين الفصل الأول",
      "description": "يرجى حل الصفحات من 10 إلى 15 في الكتاب المدرسي",
      "due_date": "2024-02-01",
      "file_url": "https://example.com/homework.pdf",
      "resources": [
        { "name": "فيديو شرح", "url": "https://youtube.com/..." }
      ],
      "max_score": 10
    },
    "Notification_list": [
      {
        "id": "notif-1",
        "user_email": "student1@example.com",
        "title": "واجب جديد",
        "message": "تم إضافة واجب جديد في مجموعة الرياضيات",
        "type": "assignment",
        "is_read": false
      },
      {
        "id": "notif-2",
        "user_email": "teacher1@example.com",
        "title": "طالب جديد",
        "message": "انضم طالب جديد لمجموعتك",
        "type": "general",
        "is_read": true
      },
      {
        "id": "notif-3",
        "user_email": "student1@example.com",
        "title": "تذكير بالحصة",
        "message": "حصتك القادمة تبدأ خلال ساعة",
        "type": "session",
        "is_read": false
      }
    ],
    "Notification_item": {
      "id": "notif-1",
      "user_email": "student1@example.com",
      "title": "واجب جديد: حل تمارين الفصل الأول",
      "message": "قام الأستاذ أحمد بإضافة واجب جديد، الموعد النهائي غداً.",
      "type": "assignment",
      "link": "/StudentAssignments",
      "is_read": false,
      "priority": "high",
      "related_id": "assign-1",
      "created_at": "2024-01-30T09:00:00Z"
    },
    "Review_list": [
      {
          "teacher_email": "teacher1@example.com",
          "student_email": "student1@example.com",
          "rating": 5,
          "comment": "ممتاز جداً"
      },
      {
          "teacher_email": "teacher1@example.com",
          "student_email": "student2@example.com",
          "rating": 4,
          "comment": "شرح جيد لكن سريع"
      },
      {
          "teacher_email": "teacher2@example.com",
          "student_email": "student3@example.com",
          "rating": 5,
          "comment": "أفضل مدرسة"
      }
    ],
    "Review_item": {
      "teacher_email": "teacher1@example.com",
      "student_email": "student1@example.com",
      "group_id": "group-1",
      "rating": 5,
      "comment": "شرح ممتاز وتفاعل رائع، استفدت كثيراً من الدورة.",
      "aspects": {
          "teaching_quality": 5,
          "communication": 5,
          "punctuality": 5,
          "materials": 4
      },
      "is_verified": true,
      "created_at": "2024-02-01T10:00:00Z"
    },
    "EducationalService_list": [
        { "provider_email": "center@example.com", "title": "بحث تخرج", "service_type": "research", "price": 50 },
        { "provider_email": "teacher1@example.com", "title": "حل واجبات رياضيات", "service_type": "homework", "price": 5 },
        { "provider_email": "center@example.com", "title": "عرض بوربوينت", "service_type": "presentation", "price": 15 }
    ],
    "Payment_list": [
        { "student_email": "student1@example.com", "amount": 10, "payment_type": "enrollment", "status": "completed" },
        { "student_email": "student2@example.com", "amount": 10, "payment_type": "enrollment", "status": "completed" },
        { "student_email": "student1@example.com", "amount": 5, "payment_type": "service", "status": "pending" }
    ]
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const files = [
    { name: "entities-schema.json", content: entitiesSchema, icon: Database, desc: "هيكل قاعدة البيانات والكيانات" },
    { name: "relations.json", content: relations, icon: LinkIcon, desc: "العلاقات بين الكيانات" },
    { name: "auth-schema.json", content: authSchema, icon: Shield, desc: "هيكل المصادقة والمستخدمين" },
    { name: "api-usage-map.json", content: apiUsageMap, icon: FileJson, desc: "خريطة استخدام API في الملفات" },
    { name: "sample-data.json", content: sampleData, icon: List, desc: "بيانات تجريبية للاختبار" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ملفات التهجير (Migration Files)</h1>
          <p className="text-gray-600">
            تم تجهيز الملفات التالية لمساعدتك في الانتقال إلى Firebase Firestore.
            قم بتحميلها لاستخدامها في عملية التهجير.
          </p>
        </div>

        <div className="grid gap-4">
          {files.map((file, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <file.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">{file.desc}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => downloadFile(file.name, file.content)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}