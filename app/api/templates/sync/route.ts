import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { getTemplates } from '@/lib/whatsapp/api'

export async function POST(req: NextRequest) {
  try {
    const { organization_id } = await req.json()
    if (!organization_id) return NextResponse.json({ error: 'organization_id required' }, { status: 400 })

    const supabase = createServerSupabaseClient()

    const { data: waAccount } = await supabase
      .from('whatsapp_accounts').select('*')
      .eq('organization_id', organization_id).eq('status', 'connected').single()

    if (!waAccount) {
      if (process.env.DEMO_MODE === 'true') {
        return NextResponse.json({ success: true, synced: 0, demo: true, message: 'وضع التجربة: لا توجد قوالب للمزامنة' })
      }
      return NextResponse.json({ error: 'WhatsApp account not configured' }, { status: 400 })
    }

    const result = await getTemplates(waAccount.waba_id, waAccount.access_token_encrypted, waAccount.api_version)

    if (!result.data) {
      return NextResponse.json({ error: result.error?.message || 'Failed to fetch templates' }, { status: 400 })
    }

    let synced = 0
    for (const t of result.data) {
      const body = t.components?.find((c: any) => c.type === 'BODY')?.text || ''
      const header = t.components?.find((c: any) => c.type === 'HEADER')?.text
      const footer = t.components?.find((c: any) => c.type === 'FOOTER')?.text

      await supabase.from('templates').upsert({
        organization_id,
        name: t.name,
        language: t.language,
        category: t.category,
        status: t.status?.toLowerCase(),
        body,
        header,
        footer,
        raw_payload: t,
      }, { onConflict: 'organization_id,name' })
      synced++
    }

    return NextResponse.json({ success: true, synced })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
