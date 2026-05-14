import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '@/lib/whatsapp/api'

export async function POST(req: NextRequest) {
  try {
    const { phone_number_id, access_token, api_version } = await req.json()

    if (!phone_number_id || !access_token) {
      return NextResponse.json({ error: 'Phone Number ID و Access Token مطلوبان' }, { status: 400 })
    }

    const result = await testConnection(phone_number_id, access_token, api_version || 'v20.0')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: 'خطأ في الاتصال' }, { status: 500 })
  }
}
