import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { conversationId, contactId, text, phone } = await request.json()
    const supabase = createServerClient()
    const orgId = process.env.NEXT_PUBLIC_ORG_ID!
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    const { data: waAccount } = await supabase
      .from('whatsapp_accounts').select('*').eq('organization_id', orgId).single()

    const { data: message } = await supabase.from('messages').insert({
      organization_id: orgId,
      conversation_id: conversationId,
      contact_id: contactId,
      whatsapp_account_id: waAccount?.id,
      direction: 'outgoing',
      message_type: 'text',
      content: text,
      status: 'pending',
    }).select('id').single()

    if (demoMode || !waAccount?.access_token_encrypted) {
      await new Promise(r => setTimeout(r, 500))
      const fakeId = `wamid.demo_${Date.now()}`
      await supabase.from('messages').update({ status: 'sent', whatsapp_message_id: fakeId }).eq('id', message!.id)
      await supabase.from('conversations').update({ last_message_text: text, last_message_at: new Date().toISOString() }).eq('id', conversationId)
      return NextResponse.json({ success: true, messageId: fakeId, demo: true })
    }

    const apiUrl = `https://graph.facebook.com/${waAccount.api_version}/${waAccount.phone_number_id}/messages`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${waAccount.access_token_encrypted}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: phone, type: 'text', text: { body: text } }),
    })

    const result = await response.json()
    if (result.messages?.[0]?.id) {
      await supabase.from('messages').update({ status: 'sent', whatsapp_message_id: result.messages[0].id }).eq('id', message!.id)
      return NextResponse.json({ success: true, messageId: result.messages[0].id })
    }
    await supabase.from('messages').update({ status: 'failed', error_message: JSON.stringify(result.error) }).eq('id', message!.id)
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
