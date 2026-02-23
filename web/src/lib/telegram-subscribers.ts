type ChatId = number

const globalForTelegram = globalThis as unknown as {
  __jaluxiTelegramSubscribers?: Set<ChatId>
}

export function getTelegramSubscribers(): Set<ChatId> {
  if (!globalForTelegram.__jaluxiTelegramSubscribers) {
    globalForTelegram.__jaluxiTelegramSubscribers = new Set<ChatId>()
  }
  return globalForTelegram.__jaluxiTelegramSubscribers
}

export function subscribeTelegramChat(chatId: ChatId) {
  getTelegramSubscribers().add(chatId)
}

export function unsubscribeTelegramChat(chatId: ChatId) {
  getTelegramSubscribers().delete(chatId)
}
