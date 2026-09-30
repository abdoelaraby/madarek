# مدارك — Madarek

منصة دورات عربية (نسخة تجريبية) مبنية من تصميم Claude Design، ومربوطة بقاعدة بيانات Supabase.

- الموقع: static site (HTML + React UMD runtime) — مفيش build step على Vercel.
- البيانات: Supabase project `madarek` (قراءة عامة عن طريق RLS، والكتابة مسموحة بس في `teacher_applications`).
- الفيديوهات: `videos/promo-history.mp4` (برومو) و `videos/lesson-trade/` (HLS لدرس «التجارة في عهد نابليون وكليبر ومينو»).
- الصور: `assets/course-*.webp` أغلفة الكورسات.

## التعديل
عدّل `src/xdc.html` (الواجهة) أو `src/logic.js` (المنطق والبيانات) وبعدين:

```
python3 src/build.py
```

ده بيطلع `index.html` جديد في الجذر.

## الصفحات
الروابط بتشتغل بالـhash: `#/courses`، `#/course/<slug>`، `#/learn/<course-id>`، `#/student`، `#/teacher-home`، `#/admin`، `#/pricing` …
