import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { sendTemplateMessage } from '@/lib/whatsapp/api'

export async function POST(req: NextRequest) {
  try {
    const { to, template_name, language, variables, organization_id, contact_id, conversation_id } = await req.json()

    if (!to || !template_name || !organization_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get WhatsApp account
    const { data: waAccount } = await supabase
      .from('whatsapp_accounts')
      .select('*')
      .eq('organization_id', organization_id)
      .eq('status', 'connected')
      .single()

    if (!waAccount) {
      if (process.env.DEMO_MODE === 'true') {
        const fakeWaId = `wamid.TMPL${Date.now()}`
        if (conversation_id) {
          await supabase.from('messages').insert({
            organization_id, conversation_id, contact_id,
            direction: 'outgoing', message_type: 'template',
            content: `[قالب: ${template_name}]`,
            whatsapp_message_id: fakeWaId, status: 'sent',
          })
        }
        return NextResponse.json({ success: true, message_id: fakeWaId, demo: true })
      }
      return NextResponse.json({ error: 'WhatsApp account not configured' }, { status: 400 })
    }

    const result = await sendTemplateMessage({
      to,
      templateName: template_name,
      language: language || 'ar',
      variables: variables || [],
      phoneNumberId: waAccount.phone_number_id,
      accessToken: waAccount.access_token_encrypted,
      apiVersion: waAccount.api_version,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    const waMessageId = result.messages?.[0]?.id

    if (conversation_id) {
      await supabase.from('messages').insert({
        organization_id, conversation_id, contact_id,
        whatsapp_account_id: waAccount.id,
        direction: 'outgoing', message_type: 'template',
        content: `[قالب: ${template_name}]`,
        whatsapp_message_id: waMessageId, status: 'sent',
      })
    }

    return NextResponse.json({ success: true, message_id: waMessageId })
  } catch (error) {
    console.error('Send template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
