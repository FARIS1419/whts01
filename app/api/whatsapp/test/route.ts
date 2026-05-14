import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumberId, accessToken, apiVersion } = await request.json()
    const url = `https://graph.facebook.com/${apiVersion || 'v19.0'}/${phoneNumberId}?access_token=${accessToken}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.error) return NextResponse.json({ success: false, error: data.error.message }, { status: 400 })
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Connection failed' }, { status: 500 })
  }
}
