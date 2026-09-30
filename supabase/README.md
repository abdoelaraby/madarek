# Supabase — project `madarek` (eu-central-1)

الجداول: categories, teachers, courses, course_sections, lessons, lesson_files, plans, faqs,
students, testimonials, enrollments, payments, refunds, payouts, subscriptions, submissions,
questions, coupons, tickets, audit_log, teacher_applications, notifications, site_stats.

- RLS مفعّل على كل الجداول.
- سياسة `public read (demo)` بتسمح بالقراءة لـ anon/authenticated (بيانات تجريبية).
- `teacher_applications`: insert بس (من فورم «انضم كمدرس»)، ومفيش قراءة عامة.
- الأرقام المجمّعة للوحات (إيراد الشهر، مبيعات المدرس…) في جدول `site_stats` (key/value).

قبل الإطلاق الحقيقي: اقفل القراءة العامة لجداول students/payments/enrollments… واربطها بـ Supabase Auth.
