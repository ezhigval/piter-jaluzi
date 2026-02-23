import { NextResponse } from 'next/server'

export async function GET() {
  try {
    if (!process.env.API_BASE_URL) {
      return NextResponse.json([])
    }

    const res = await fetch(`${process.env.API_BASE_URL}/api/promotions`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
