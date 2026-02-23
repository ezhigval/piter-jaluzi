import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session')
  
  return NextResponse.json({
    hasCookie: !!adminSession,
    cookieValue: adminSession?.value,
    allCookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value }))
  })
}
