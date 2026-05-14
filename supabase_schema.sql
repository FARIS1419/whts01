-- ============================================
-- WhatsApp Business CRM - Supabase Schema
-- انسخ هذا الكود كاملاً في SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. organizations
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. users
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. whatsapp_accounts
-- ============================================
CREATE TABLE whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  app_id TEXT,
  waba_id TEXT,
  phone_number_id TEXT,
  display_phone_number TEXT,
  access_token_encrypted TEXT,
  webhook_verify_token TEXT DEFAULT 'whatsapp_verify_' || substr(md5(random()::text), 1, 12),
  api_version TEXT DEFAULT 'v19.0',
  status TEXT DEFAULT 'needs_setup' CHECK (status IN ('connected', 'disconnected', 'needs_setup')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. contacts
-- ============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  tags JSONB DEFAULT '[]',
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'webhook', 'api')),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, phone)
);

-- ============================================
-- 5. conversations
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  unread_count INTEGER DEFAULT 0,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. messages
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'template', 'interactive', 'sticker', 'location')),
  content TEXT,
  media_url TEXT,
  whatsapp_message_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. templates
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT DEFAULT 'ar',
  category TEXT DEFAULT 'MARKETING' CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'draft')),
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. campaigns
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES templates(id),
  audience_filter JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. campaign_messages
-- ============================================
CREATE TABLE campaign_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  message_id UUID REFERENCES messages(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. flows
-- ============================================
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
  trigger_type TEXT CHECK (trigger_type IN ('keyword', 'new_contact', 'tag_change', 'no_reply', 'any_message')),
  trigger_config JSONB DEFAULT '{}',
  actions_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. webhook_events
-- ============================================
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  event_type TEXT,
  raw_payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. activity_logs
-- ============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES للأداء
-- ============================================
CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_conversations_org ON conversations(organization_id);
CREATE INDEX idx_conversations_contact ON conversations(contact_id);
CREATE INDEX idx_conversations_last_msg ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_whatsapp_id ON messages(whatsapp_message_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_org ON messages(organization_id);
CREATE INDEX idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ============================================
-- DEMO DATA - بيانات تجريبية
-- ============================================

-- إضافة Organization تجريبية
INSERT INTO organizations (id, name, status) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'شركتي للتجارة', 'active');

-- إضافة WhatsApp Account (needs_setup)
INSERT INTO whatsapp_accounts (organization_id, display_phone_number, status, webhook_verify_token) VALUES 
  ('00000000-0000-0000-0000-000000000001', '+966501234567', 'needs_setup', 'my_verify_token_123');

-- إضافة جهات اتصال تجريبية
INSERT INTO contacts (organization_id, name, phone, email, tags, source, last_message_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'أحمد محمد', '+966501111111', 'ahmed@example.com', '["عميل","مهم"]', 'manual', NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 'سارة العمري', '+966502222222', 'sara@example.com', '["عميلة"]', 'webhook', NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000001', 'خالد الزهراني', '+966503333333', NULL, '["محتمل"]', 'manual', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'نورة السالم', '+966504444444', 'noura@example.com', '["VIP","عميلة"]', 'import', NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000001', 'فهد الحربي', '+966505555555', NULL, '["جديد"]', 'webhook', NOW() - INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000000000001', 'ريم القحطاني', '+966506666666', 'reem@example.com', '["عميلة","مهم"]', 'manual', NOW() - INTERVAL '6 hours');

-- إضافة قوالب تجريبية
INSERT INTO templates (organization_id, name, language, category, status, body, variables) VALUES
  ('00000000-0000-0000-0000-000000000001', 'ترحيب_جديد', 'ar', 'MARKETING', 'approved', 'أهلاً {{1}}! 👋 مرحباً بك في {{2}}. نحن هنا لخدمتك على مدار الساعة.', '["اسم العميل","اسم الشركة"]'),
  ('00000000-0000-0000-0000-000000000001', 'تأكيد_طلب', 'ar', 'UTILITY', 'approved', 'عزيزي {{1}}، تم تأكيد طلبك رقم {{2}} بنجاح ✅ سيتم التوصيل خلال {{3}} أيام.', '["اسم العميل","رقم الطلب","مدة التوصيل"]'),
  ('00000000-0000-0000-0000-000000000001', 'عرض_خاص', 'ar', 'MARKETING', 'approved', '🎉 عرض خاص لك {{1}}! احصل على خصم {{2}}% على جميع المنتجات. العرض ساري حتى {{3}}.', '["اسم العميل","نسبة الخصم","تاريخ الانتهاء"]'),
  ('00000000-0000-0000-0000-000000000001', 'تذكير_موعد', 'ar', 'UTILITY', 'approved', 'تذكير: لديك موعد غداً {{1}} الساعة {{2}}. للتأكيد أو الإلغاء تواصل معنا.', '["التاريخ","الوقت"]');

-- إضافة محادثات تجريبية
WITH org_contacts AS (
  SELECT id, name FROM contacts WHERE organization_id = '00000000-0000-0000-0000-000000000001'
),
wa_account AS (
  SELECT id FROM whatsapp_accounts WHERE organization_id = '00000000-0000-0000-0000-000000000001' LIMIT 1
)
INSERT INTO conversations (organization_id, contact_id, whatsapp_account_id, status, unread_count, last_message_text, last_message_at)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  c.id,
  w.id,
  CASE WHEN c.name IN ('أحمد محمد', 'فهد الحربي') THEN 'open' ELSE 'open' END,
  CASE WHEN c.name = 'فهد الحربي' THEN 3 WHEN c.name = 'أحمد محمد' THEN 1 ELSE 0 END,
  CASE 
    WHEN c.name = 'أحمد محمد' THEN 'شكراً جزيلاً، متى يصل الطلب؟'
    WHEN c.name = 'سارة العمري' THEN 'حسناً، سأنتظر ردكم'
    WHEN c.name = 'خالد الزهراني' THEN 'هل العرض لا يزال متاحاً؟'
    WHEN c.name = 'نورة السالم' THEN 'ممتاز، شكراً للمتابعة'
    WHEN c.name = 'فهد الحربي' THEN 'السلام عليكم، أريد الاستفسار'
    ELSE 'مرحباً'
  END,
  NOW() - INTERVAL '30 minutes'
FROM org_contacts c, wa_account w;

-- إضافة رسائل تجريبية للمحادثة الأولى
WITH first_conv AS (
  SELECT conv.id as conv_id, conv.contact_id, conv.whatsapp_account_id
  FROM conversations conv
  JOIN contacts c ON c.id = conv.contact_id
  WHERE c.name = 'أحمد محمد' AND c.organization_id = '00000000-0000-0000-0000-000000000001'
  LIMIT 1
)
INSERT INTO messages (organization_id, conversation_id, contact_id, whatsapp_account_id, direction, message_type, content, status, created_at)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  fc.conv_id,
  fc.contact_id,
  fc.whatsapp_account_id,
  m.direction,
  'text',
  m.content,
  'read',
  m.created_at
FROM first_conv fc,
(VALUES 
  ('outgoing', 'أهلاً أحمد! 👋 مرحباً بك في شركتنا. كيف يمكنني مساعدتك؟', NOW() - INTERVAL '3 hours'),
  ('incoming', 'وعليكم السلام، أريد الاستفسار عن طلبي رقم 12345', NOW() - INTERVAL '2 hours 50 minutes'),
  ('outgoing', 'بالتأكيد، طلبك رقم 12345 قيد التجهيز الآن ✅', NOW() - INTERVAL '2 hours 45 minutes'),
  ('incoming', 'متى سيتم الشحن؟', NOW() - INTERVAL '2 hours 30 minutes'),
  ('outgoing', 'سيتم الشحن غداً إن شاء الله وستصلك رسالة تأكيد 📦', NOW() - INTERVAL '2 hours 20 minutes'),
  ('incoming', 'شكراً جزيلاً، متى يصل الطلب؟', NOW() - INTERVAL '30 minutes')
) AS m(direction, content, created_at);

-- إضافة حملة تجريبية
INSERT INTO campaigns (organization_id, name, template_id, status, total_recipients, sent_count, delivered_count, read_count, failed_count, created_at)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  'حملة العروض الرمضانية',
  t.id,
  'completed',
  150,
  148,
  142,
  98,
  2,
  NOW() - INTERVAL '2 days'
FROM templates t 
WHERE t.name = 'عرض_خاص' AND t.organization_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1;

INSERT INTO campaigns (organization_id, name, status, total_recipients, sent_count, delivered_count, read_count, failed_count, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'حملة ترحيب العملاء الجدد', 'sending', 45, 23, 20, 15, 0, NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000001', 'تذكير المواعيد - أبريل', 'draft', 0, 0, 0, 0, 0, NOW() - INTERVAL '30 minutes');

-- إضافة flows تجريبية
INSERT INTO flows (organization_id, name, status, trigger_type, trigger_config, actions_json) VALUES
  ('00000000-0000-0000-0000-000000000001', 'رد تلقائي على مرحبا', 'active', 'keyword', 
   '{"keywords": ["مرحبا", "هلا", "السلام عليكم", "اهلا"]}',
   '[{"type": "send_text", "delay": 0, "content": "أهلاً وسهلاً! 👋 شكراً لتواصلك معنا. سيرد عليك أحد ممثلي خدمة العملاء قريباً."}]'),
  ('00000000-0000-0000-0000-000000000001', 'رسالة ترحيب للعملاء الجدد', 'active', 'new_contact',
   '{}',
   '[{"type": "wait", "duration": 60}, {"type": "send_template", "template": "ترحيب_جديد"}]'),
  ('00000000-0000-0000-0000-000000000001', 'متابعة عدم الرد', 'inactive', 'no_reply',
   '{"hours": 24}',
   '[{"type": "send_text", "content": "مرحباً، هل تحتاج مساعدة؟ نحن هنا لخدمتك 😊"}]');

-- ============================================
-- Row Level Security (RLS) - أساسي
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

-- Policy مؤقتة للتطوير - تسمح بكل العمليات
-- ستُعدَّل لاحقاً بعد إضافة Auth
CREATE POLICY "Allow all for development" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON flows FOR ALL USING (true);

-- ============================================
-- انتهى! ✅
-- تحقق من الجداول في Table Editor
-- ============================================
