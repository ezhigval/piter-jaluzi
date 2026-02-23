import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.API_BASE_URL) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    const payload = await req.json()

    const res = await fetch(`${process.env.API_BASE_URL}/api/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    try {
      const json = JSON.parse(text)
      return NextResponse.json(json, { status: res.status })
    } catch {
      return NextResponse.json({ error: 'Bad upstream response' }, { status: 502 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to estimate' }, { status: 500 })
  }
}
