import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// GET - Webhook Verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'my_verify_token_123'

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST - Receive Messages & Status Updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerClient()
    const orgId = process.env.NEXT_PUBLIC_ORG_ID!

    // Save raw webhook event
    await supabase.from('webhook_events').insert({
      organization_id: orgId,
      event_type: 'webhook',
      raw_payload: body,
      processed: false,
    })

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value) return NextResponse.json({ success: true })

    // Get WhatsApp account
    const { data: waAccount } = await supabase
      .from('whatsapp_accounts')
      .select('id')
      .eq('organization_id', orgId)
      .single()

    // Handle incoming messages
    if (value.messages?.length > 0) {
      for (const msg of value.messages) {
        const contact = value.contacts?.[0]
        const phone = msg.from
        const name = contact?.profile?.name || phone

        // Find or create contact
        let { data: contactRecord } = await supabase
          .from('contacts')
          .select('id')
          .eq('organization_id', orgId)
          .eq('phone', phone)
          .single()

        if (!contactRecord) {
          const { data: newContact } = await supabase
            .from('contacts')
            .insert({ organization_id: orgId, name, phone, source: 'webhook' })
            .select('id')
            .single()
          contactRecord = newContact
        }

        // Find or create conversation
        let { data: conv } = await supabase
          .from('conversations')
          .select('id, unread_count')
          .eq('organization_id', orgId)
          .eq('contact_id', contactRecord!.id)
          .single()

        const msgText = msg.text?.body || '[رسالة وسائط]'

        if (!conv) {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              organization_id: orgId,
              contact_id: contactRecord!.id,
              whatsapp_account_id: waAccount?.id,
              status: 'open',
              unread_count: 1,
              last_message_text: msgText,
              last_message_at: new Date().toISOString(),
            })
            .select('id, unread_count')
            .single()
          conv = newConv
        } else {
          await supabase.from('conversations').update({
            unread_count: (conv.unread_count || 0) + 1,
            last_message_text: msgText,
            last_message_at: new Date().toISOString(),
          }).eq('id', conv.id)
        }

        // Save message
        await supabase.from('messages').insert({
          organization_id: orgId,
          conversation_id: conv!.id,
          contact_id: contactRecord!.id,
          whatsapp_account_id: waAccount?.id,
          direction: 'incoming',
          message_type: msg.type || 'text',
          content: msgText,
          whatsapp_message_id: msg.id,
          status: 'received',
          raw_payload: msg,
        })

        // Update contact last message time
        await supabase.from('contacts').update({
          last_message_at: new Date().toISOString()
        }).eq('id', contactRecord!.id)
      }
    }

    // Handle status updates
    if (value.statuses?.length > 0) {
      for (const status of value.statuses) {
        await supabase.from('messages').update({
          status: status.status,
          raw_payload: status,
        }).eq('whatsapp_message_id', status.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
