import { NextRequest, NextResponse } from 'next/server'

import {
  subscribeTelegramChat,
  unsubscribeTelegramChat,
} from '@/lib/telegram-subscribers'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

async function tgSendMessage(token: string, chatId: number, text: string, extra?: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...extra,
    }),
  })

  if (!res.ok) {
    const details = await res.text().catch(() => '')
    throw new Error(`Telegram sendMessage failed: ${details}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = requireEnv('TELEGRAM_BOT_TOKEN')

    const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN
    if (secret) {
      const provided = req.headers.get('x-telegram-bot-api-secret-token')
      if (provided !== secret) {
        return NextResponse.json({ error: 'Invalid secret token' }, { status: 401 })
      }
    }

    const update = (await req.json()) as any

    // /start flow
    const messageText: string | undefined = update?.message?.text
    const messageChatId: number | undefined = update?.message?.chat?.id

    if (messageText && typeof messageChatId === 'number') {
      if (messageText.startsWith('/start')) {
        await tgSendMessage(token, messageChatId, 'Присылать уведомления с сайта?', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Да', callback_data: 'site_notify_yes' },
              { text: 'Нет', callback_data: 'site_notify_no' },
            ]],
          },
        })
      }

      return NextResponse.json({ ok: true })
    }

    // Button callbacks
    const cbData: string | undefined = update?.callback_query?.data
    const cbChatId: number | undefined = update?.callback_query?.message?.chat?.id

    if (cbData && typeof cbChatId === 'number') {
      if (cbData === 'site_notify_yes') {
        subscribeTelegramChat(cbChatId)
        await tgSendMessage(token, cbChatId, 'Готово. Буду присылать уведомления с сайта.')
      }

      if (cbData === 'site_notify_no') {
        unsubscribeTelegramChat(cbChatId)
        await tgSendMessage(token, cbChatId, 'Ок. Уведомления отключены.')
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Telegram webhook failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
