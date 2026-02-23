import { NextRequest, NextResponse } from 'next/server'

type LeadKind = 'request' | 'measure'

type LeadPayload = {
  kind: LeadKind
  name: string
  phone: string
  comment?: string
  pageUrl?: string
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

function escapeTelegram(text: string): string {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

export async function POST(req: NextRequest) {
  try {
    const token = requireEnv('TELEGRAM_BOT_TOKEN')
    const chatId = requireEnv('TELEGRAM_CHAT_ID')

    const payload = (await req.json()) as Partial<LeadPayload>

    const kind = payload.kind
    const name = (payload.name ?? '').trim()
    const phone = (payload.phone ?? '').trim()
    const comment = (payload.comment ?? '').trim()
    const pageUrl = (payload.pageUrl ?? '').trim()

    if (kind !== 'request' && kind !== 'measure') {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
    }

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const title = kind === 'measure' ? 'Вызов замерщика' : 'Заявка'

    const lines: string[] = []
    lines.push(`*${escapeTelegram(title)}*`)
    lines.push('')
    lines.push(`*Имя:* ${escapeTelegram(name)}`)
    lines.push(`*Телефон:* ${escapeTelegram(phone)}`)
    if (comment) lines.push(`*Комментарий:* ${escapeTelegram(comment)}`)
    if (pageUrl) lines.push(`*Страница:* ${escapeTelegram(pageUrl)}`)

    const text = lines.join('\n')

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      }),
    })

    const tgText = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: 'Telegram send failed', details: tgText }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to send lead'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
