export type OrgId = string

export interface Organization {
  id: string
  name: string
  logo_url?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

export interface Contact {
  id: string
  organization_id: string
  name: string
  phone: string
  email?: string
  tags: string[]
  notes?: string
  status: 'active' | 'inactive' | 'blocked'
  source: 'manual' | 'import' | 'webhook' | 'api'
  last_message_at?: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  organization_id: string
  contact_id: string
  whatsapp_account_id?: string
  status: 'open' | 'closed' | 'pending'
  unread_count: number
  last_message_text?: string
  last_message_at?: string
  assigned_to?: string
  created_at: string
  updated_at: string
  contact?: Contact
}

export interface Message {
  id: string
  organization_id: string
  conversation_id: string
  contact_id?: string
  direction: 'incoming' | 'outgoing'
  message_type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'template' | 'sticker'
  content?: string
  media_url?: string
  whatsapp_message_id?: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  error_message?: string
  created_at: string
}

export interface Template {
  id: string
  organization_id: string
  name: string
  language: string
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  status: 'approved' | 'pending' | 'rejected' | 'draft'
  body: string
  variables: string[]
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  organization_id: string
  name: string
  template_id?: string
  audience_filter: Record<string, unknown>
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'cancelled'
  scheduled_at?: string
  total_recipients: number
  sent_count: number
  delivered_count: number
  read_count: number
  failed_count: number
  reply_count: number
  created_at: string
  updated_at: string
  template?: Template
}

export interface Flow {
  id: string
  organization_id: string
  name: string
  status: 'active' | 'inactive'
  trigger_type: 'keyword' | 'new_contact' | 'tag_change' | 'no_reply' | 'any_message'
  trigger_config: Record<string, unknown>
  actions_json: FlowAction[]
  created_at: string
  updated_at: string
}

export interface FlowAction {
  type: 'send_text' | 'send_template' | 'add_tag' | 'assign_agent' | 'wait'
  content?: string
  template?: string
  tag?: string
  agent?: string
  duration?: number
  delay?: number
}

export interface WhatsAppAccount {
  id: string
  organization_id: string
  app_id?: string
  waba_id?: string
  phone_number_id?: string
  display_phone_number?: string
  webhook_verify_token?: string
  api_version: string
  status: 'connected' | 'disconnected' | 'needs_setup'
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalSent: number
  totalReceived: number
  totalFailed: number
  totalPending: number
  totalContacts: number
  openConversations: number
  replyRate: number
  last24Hours: number
}
