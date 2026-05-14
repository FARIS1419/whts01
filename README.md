# WhatsApp Business CRM

منصة إدارة رسائل WhatsApp Business Cloud API - عربية RTL

## الإعداد السريع

### 1. تثبيت الحزم
```bash
npm install
```

### 2. متغيرات البيئة
انسخ `.env.local` وأضف قيمك:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ORG_ID=00000000-0000-0000-0000-000000000001
NEXT_PUBLIC_DEMO_MODE=true
```

### 3. قاعدة البيانات
في Supabase SQL Editor، شغّل `supabase_schema.sql`

### 4. تشغيل المشروع
```bash
npm run dev
```
المشروع يعمل على: http://localhost:3000

## الصفحات
- `/dashboard` - لوحة التحكم
- `/inbox` - صندوق الوارد  
- `/contacts` - جهات الاتصال
- `/flows` - الفلوز
- `/broadcast` - إطلاق الرسائل
- `/templates` - القوالب
- `/logs` - سجل الرسائل
- `/settings` - الإعدادات
- `/settings/whatsapp` - إعدادات WhatsApp API

## Webhook URL
```
https://your-domain.com/api/webhook
```

## وضع التجربة
النظام يعمل بـ Demo Mode افتراضياً. لتفعيل الـ API الحقيقي:
1. اذهب لـ `/settings/whatsapp`
2. أضف بياناتك
3. غيّر `NEXT_PUBLIC_DEMO_MODE=false`
