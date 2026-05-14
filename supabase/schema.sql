-- =============================================
-- WhatsApp CRM Platform - Supabase Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ORGANIZATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USERS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WHATSAPP ACCOUNTS
-- =============================================
CREATE TABLE IF NOT EXISTS whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  app_id VARCHAR(255),
  waba_id VARCHAR(255),
  phone_number_id VARCHAR(255),
  display_phone_number VARCHAR(50),
  access_token_encrypted TEXT,
  webhook_verify_token VARCHAR(255),
  api_version VARCHAR(20) DEFAULT 'v20.0',
  status VARCHAR(50) DEFAULT 'needs_setup' CHECK (status IN ('connected', 'disconnected', 'needs_setup', 'error')),
  last_tested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTACTS
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'unsubscribed')),
  source VARCHAR(100) DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'webhook', 'api')),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, phone)
);

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending', 'resolved')),
  unread_count INTEGER DEFAULT 0,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'template', 'interactive', 'location', 'sticker')),
  content TEXT,
  media_url TEXT,
  whatsapp_message_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(20) DEFAULT 'ar',
  category VARCHAR(100) DEFAULT 'MARKETING' CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected', 'draft')),
  body TEXT NOT NULL,
  header TEXT,
  footer TEXT,
  variables JSONB DEFAULT '[]',
  buttons JSONB DEFAULT '[]',
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CAMPAIGNS
-- =============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES templates(id),
  audience_filter JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed', 'paused')),
  scheduled_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CAMPAIGN MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS campaign_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  message_id UUID REFERENCES messages(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FLOWS / AUTOMATION
-- =============================================
CREATE TABLE IF NOT EXISTS flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'draft')),
  trigger_type VARCHAR(100) CHECK (trigger_type IN ('keyword', 'new_contact', 'tag_change', 'no_reply', 'opt_in', 'campaign_reply')),
  trigger_config JSONB DEFAULT '{}',
  actions_json JSONB DEFAULT '[]',
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WEBHOOK EVENTS
-- =============================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  whatsapp_account_id UUID REFERENCES whatsapp_accounts(id),
  event_type VARCHAR(100),
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_contacts_org ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_conversations_org ON conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_org ON messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_wa_id ON messages(whatsapp_message_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_flows_org ON flows(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_activity_logs_org ON activity_logs(organization_id);

-- =============================================
-- DEMO DATA - Organization
-- =============================================
INSERT INTO organizations (id, name, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'واتس بيز - Demo Workspace', 'active')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - WhatsApp Account
-- =============================================
INSERT INTO whatsapp_accounts (id, organization_id, display_phone_number, status, api_version) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '+966 50 000 0000', 'needs_setup', 'v20.0')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Contacts
-- =============================================
INSERT INTO contacts (id, organization_id, name, phone, email, tags, status, source, last_message_at) VALUES
  ('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'أحمد محمد السعيد', '966501234567', 'ahmed@example.com', ARRAY['عميل VIP', 'مهتم'], 'active', 'manual', NOW() - INTERVAL '2 hours'),
  ('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'فاطمة علي الزهراني', '966502345678', 'fatima@example.com', ARRAY['عميل جديد'], 'active', 'webhook', NOW() - INTERVAL '5 hours'),
  ('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'محمد عبدالله القحطاني', '966503456789', 'mohammed@example.com', ARRAY['متابعة'], 'active', 'import', NOW() - INTERVAL '1 day'),
  ('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'نورة سالم العتيبي', '966504567890', 'noura@example.com', ARRAY['عميل VIP', 'مشترك'], 'active', 'manual', NOW() - INTERVAL '3 hours'),
  ('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'خالد يوسف الغامدي', '966505678901', 'khaled@example.com', ARRAY['استفسار'], 'active', 'webhook', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Conversations
-- =============================================
INSERT INTO conversations (id, organization_id, contact_id, whatsapp_account_id, status, unread_count, last_message_text, last_message_at) VALUES
  ('cccccccc-0001-0001-0001-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'open', 2, 'شكراً جزيلاً، سأراجع العرض', NOW() - INTERVAL '2 hours'),
  ('cccccccc-0002-0002-0002-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'open', 0, 'هل يمكنني الاستفسار عن المنتج؟', NOW() - INTERVAL '5 hours'),
  ('cccccccc-0003-0003-0003-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'pending', 1, 'متى سيكون متاحاً؟', NOW() - INTERVAL '1 day'),
  ('cccccccc-0004-0004-0004-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'open', 3, 'أريد الاشتراك في الباقة المميزة', NOW() - INTERVAL '3 hours'),
  ('cccccccc-0005-0005-0005-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'closed', 0, 'تمام، شكراً لك', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Templates
-- =============================================
INSERT INTO templates (id, organization_id, name, language, category, status, body, variables) VALUES
  ('tttttttt-0001-0001-0001-tttttttttttt', '11111111-1111-1111-1111-111111111111', 'ترحيب بالعملاء الجدد', 'ar', 'MARKETING', 'approved', 'مرحباً {{1}}! 👋 نرحب بك في {{2}}. نحن هنا لخدمتك على مدار الساعة. هل يمكننا مساعدتك بشيء؟', '["اسم العميل", "اسم الشركة"]'),
  ('tttttttt-0002-0002-0002-tttttttttttt', '11111111-1111-1111-1111-111111111111', 'تذكير بالموعد', 'ar', 'UTILITY', 'approved', 'تذكير: لديك موعد في {{1}} بتاريخ {{2}}. الرجاء التأكيد بالرد بـ "نعم" أو "لا".', '["الوقت", "التاريخ"]'),
  ('tttttttt-0003-0003-0003-tttttttttttt', '11111111-1111-1111-1111-111111111111', 'عرض خاص', 'ar', 'MARKETING', 'approved', '🎉 عرض خاص لك {{1}}! احصل على خصم {{2}}% على جميع منتجاتنا حتى تاريخ {{3}}. استخدم الكود: {{4}}', '["اسم العميل", "نسبة الخصم", "تاريخ الانتهاء", "كود الخصم"]'),
  ('tttttttt-0004-0004-0004-tttttttttttt', '11111111-1111-1111-1111-111111111111', 'تأكيد الطلب', 'ar', 'UTILITY', 'pending', 'تم استلام طلبك رقم {{1}} بنجاح ✅. سيتم التواصل معك خلال {{2}} ساعة. شكراً لثقتك بنا!', '["رقم الطلب", "عدد الساعات"]')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Messages
-- =============================================
INSERT INTO messages (organization_id, conversation_id, contact_id, whatsapp_account_id, direction, message_type, content, status, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-0001-0001-0001-cccccccccccc', 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'incoming', 'text', 'السلام عليكم، أريد الاستفسار عن منتجاتكم', 'read', NOW() - INTERVAL '3 hours'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-0001-0001-0001-cccccccccccc', 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'outgoing', 'text', 'وعليكم السلام! أهلاً بك أحمد، يسعدنا مساعدتك. ما الذي تود الاستفسار عنه؟', 'read', NOW() - INTERVAL '2 hours 50 min'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-0001-0001-0001-cccccccccccc', 'aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'incoming', 'text', 'شكراً جزيلاً، سأراجع العرض', 'delivered', NOW() - INTERVAL '2 hours'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-0002-0002-0002-cccccccccccc', 'aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'incoming', 'text', 'هل يمكنني الاستفسار عن المنتج؟', 'read', NOW() - INTERVAL '5 hours'),
  ('11111111-1111-1111-1111-111111111111', 'cccccccc-0004-0004-0004-cccccccccccc', 'aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'incoming', 'text', 'أريد الاشتراك في الباقة المميزة', 'delivered', NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Campaigns
-- =============================================
INSERT INTO campaigns (id, organization_id, name, template_id, status, total_recipients, sent_count, delivered_count, read_count, failed_count) VALUES
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'حملة رمضان 2025', 'tttttttt-0003-0003-0003-tttttttttttt', 'completed', 150, 148, 142, 98, 2),
  ('bbbbbbbb-0002-0002-0002-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'ترحيب بالعملاء الجدد - مايو', 'tttttttt-0001-0001-0001-tttttttttttt', 'completed', 45, 45, 43, 38, 0),
  ('bbbbbbbb-0003-0003-0003-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'حملة تذكير المشتركين', 'tttttttt-0002-0002-0002-tttttttttttt', 'draft', 0, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO DATA - Flows
-- =============================================
INSERT INTO flows (id, organization_id, name, status, trigger_type, trigger_config, actions_json) VALUES
  ('ffffffff-0001-0001-0001-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'رد تلقائي على الترحيب', 'active', 'keyword',
   '{"keywords": ["مرحبا", "السلام عليكم", "هلا"], "match_type": "contains"}',
   '[{"type": "send_text", "delay": 0, "content": "أهلاً وسهلاً! مرحباً بك. سيتم التواصل معك قريباً 😊"}, {"type": "add_tag", "tag": "محتاج متابعة"}]'),
  ('ffffffff-0002-0002-0002-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'متابعة العملاء الجدد', 'active', 'new_contact',
   '{}',
   '[{"type": "send_template", "template_id": "tttttttt-0001-0001-0001-tttttttttttt", "delay": 0}]'),
  ('ffffffff-0003-0003-0003-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'تذكير بعدم الرد', 'inactive', 'no_reply',
   '{"hours": 24}',
   '[{"type": "send_text", "content": "مرحباً، هل تحتاج مساعدة؟ نحن هنا 🙂"}, {"type": "add_tag", "tag": "يحتاج متابعة"}]')
ON CONFLICT DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS) - Basic Setup
-- =============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

-- Permissive policies for MVP (tighten later with auth)
CREATE POLICY "Allow all for now" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON flows FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON whatsapp_accounts FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON campaign_messages FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON webhook_events FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON activity_logs FOR ALL USING (true);
