import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { sendTemplateMessage } from '@/lib/whatsapp/api'

export async function POST(req: NextRequest) {
  try {
    const { campaign_id, organization_id } = await req.json()
    if (!campaign_id || !organization_id) {
      return NextResponse.json({ error: 'campaign_id و organization_id مطلوبان' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get campaign details
    const { data: campaign } = await supabase
      .from('campaigns').select('*, template:templates(*)').eq('id', campaign_id).single()

    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return NextResponse.json({ error: 'Campaign cannot be launched in current status' }, { status: 400 })
    }

    // Get contacts (apply audience filter if any)
    const { data: contacts } = await supabase
      .from('contacts').select('*')
      .eq('organization_id', organization_id).eq('status', 'active')

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts found' }, { status: 400 })
    }

    // Update campaign status to sending
    await supabase.from('campaigns').update({
      status: 'sending',
      total_recipients: contacts.length,
    }).eq('id', campaign_id)

    // In demo mode, simulate sending
    if (process.env.DEMO_MODE === 'true') {
      setTimeout(async () => {
        await supabase.from('campaigns').update({
          status: 'completed',
          sent_count: contacts.length,
          delivered_count: Math.floor(contacts.length * 0.96),
          read_count: Math.floor(contacts.length * 0.72),
          failed_count: Math.floor(contacts.length * 0.04),
        }).eq('id', campaign_id)
      }, 5000)

      return NextResponse.json({ success: true, demo: true, recipients: contacts.length })
    }

    // Real: Get WA account & send
    const { data: waAccount } = await supabase
      .from('whatsapp_accounts').select('*')
      .eq('organization_id', organization_id).eq('status', 'connected').single()

    if (!waAccount) return NextResponse.json({ error: 'WhatsApp account not connected' }, { status: 400 })

    let sentCount = 0, failedCount = 0

    for (const contact of contacts) {
      try {
        const result = await sendTemplateMessage({
          to: contact.phone,
          templateName: campaign.template.name,
          language: campaign.template.language || 'ar',
          variables: [],
          phoneNumberId: waAccount.phone_number_id,
          accessToken: waAccount.access_token_encrypted,
          apiVersion: waAccount.api_version,
        })

        const status = result.error ? 'failed' : 'sent'
        if (!result.error) sentCount++
        else failedCount++

        await supabase.from('campaign_messages').insert({
          organization_id, campaign_id, contact_id: contact.id,
          status, error_message: result.error?.message,
        })
      } catch {
        failedCount++
      }
    }

    await supabase.from('campaigns').update({
      status: 'completed', sent_count: sentCount, failed_count: failedCount,
    }).eq('id', campaign_id)

    return NextResponse.json({ success: true, sent: sentCount, failed: failedCount })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
