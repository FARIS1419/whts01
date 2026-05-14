// WhatsApp Cloud API - Server-side only
// All API calls must go through here - never expose token to frontend

export interface WATextMessage {
  to: string
  text: string
  phoneNumberId: string
  accessToken: string
  apiVersion?: string
}

export interface WATemplateMessage {
  to: string
  templateName: string
  language: string
  variables: string[]
  phoneNumberId: string
  accessToken: string
  apiVersion?: string
}

export interface WAApiResponse {
  messages?: Array<{ id: string }>
  error?: {
    message: string
    type: string
    code: number
    error_data?: unknown
  }
}

const BASE_URL = 'https://graph.facebook.com'

export async function sendTextMessage(params: WATextMessage): Promise<WAApiResponse> {
  const { to, text, phoneNumberId, accessToken, apiVersion = 'v20.0' } = params
  
  const response = await fetch(`${BASE_URL}/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: { preview_url: false, body: text }
    }),
  })

  return response.json()
}

export async function sendTemplateMessage(params: WATemplateMessage): Promise<WAApiResponse> {
  const { to, templateName, language, variables, phoneNumberId, accessToken, apiVersion = 'v20.0' } = params

  const components = variables.length > 0 ? [{
    type: 'body',
    parameters: variables.map(v => ({ type: 'text', text: v }))
  }] : []

  const response = await fetch(`${BASE_URL}/${apiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        components,
      }
    }),
  })

  return response.json()
}

export async function testConnection(phoneNumberId: string, accessToken: string, apiVersion = 'v20.0'): Promise<{ success: boolean; phoneNumber?: string; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/${apiVersion}/${phoneNumberId}?fields=display_phone_number,verified_name`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    const data = await response.json()
    
    if (data.error) {
      return { success: false, error: data.error.message }
    }
    return { success: true, phoneNumber: data.display_phone_number }
  } catch (err) {
    return { success: false, error: 'فشل الاتصال بالخادم' }
  }
}

export async function getTemplates(wabaId: string, accessToken: string, apiVersion = 'v20.0') {
  const response = await fetch(`${BASE_URL}/${apiVersion}/${wabaId}/message_templates?limit=100`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
  return response.json()
}

export function verifyWebhook(mode: string, token: string, challenge: string, verifyToken: string): string | null {
  if (mode === 'subscribe' && token === verifyToken) {
    return challenge
  }
  return null
}

export function parseWebhookPayload(body: unknown): {
  type: 'message' | 'status' | 'unknown'
  data: unknown
} {
  const payload = body as Record<string, unknown>
  
  try {
    const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown>
    const changes = (entry?.changes as unknown[])?.[0] as Record<string, unknown>
    const value = changes?.value as Record<string, unknown>
    
    if (value?.messages) {
      return { type: 'message', data: value }
    }
    if (value?.statuses) {
      return { type: 'status', data: value }
    }
  } catch {}
  
  return { type: 'unknown', data: null }
}
