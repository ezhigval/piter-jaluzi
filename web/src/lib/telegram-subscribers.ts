type ChatId = number

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return (await res.json()) as T
}

export async function getTelegramSubscribers(): Promise<ChatId[]> {
  try {
    const response = await request<{subscribers: ChatId[]}>("/telegram/subscribers")
    return response.subscribers
  } catch (error) {
    console.error("Failed to fetch telegram subscribers:", error)
    return []
  }
}

export async function subscribeTelegramChat(chatId: ChatId): Promise<void> {
  try {
    await request(`/telegram/subscribers/${chatId}`, {
      method: "POST",
    })
  } catch (error) {
    console.error("Failed to subscribe telegram chat:", error)
    throw error
  }
}

export async function unsubscribeTelegramChat(chatId: ChatId): Promise<void> {
  try {
    await request(`/telegram/subscribers/${chatId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Failed to unsubscribe telegram chat:", error)
    throw error
  }
}

// Для обратной совместимости оставляем глобальное хранилище как fallback
const globalForTelegram = globalThis as unknown as {
  __jaluxiTelegramSubscribers?: Set<ChatId>
}

export function getTelegramSubscribersSync(): Set<ChatId> {
  if (!globalForTelegram.__jaluxiTelegramSubscribers) {
    globalForTelegram.__jaluxiTelegramSubscribers = new Set<ChatId>()
  }
  return globalForTelegram.__jaluxiTelegramSubscribers
}

export function subscribeTelegramChatSync(chatId: ChatId) {
  getTelegramSubscribersSync().add(chatId)
}

export function unsubscribeTelegramChatSync(chatId: ChatId) {
  getTelegramSubscribersSync().delete(chatId)
}
