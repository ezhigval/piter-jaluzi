// Работа с cookies

export interface CookieOptions {
  maxAge?: number
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export class CookieManager {
  /**
   * Устанавливает cookie
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`
    }

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    }

    if (options.path) {
      cookieString += `; path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`
    }

    if (options.secure) {
      cookieString += '; secure'
    }

    if (options.httpOnly) {
      cookieString += '; httponly'
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`
    }

    document.cookie = cookieString
  }

  /**
   * Получает значение cookie
   */
  static get(name: string): string | null {
    if (typeof document === 'undefined') return null

    const nameEQ = encodeURIComponent(name) + '='
    const cookies = document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
      }
    }

    return null
  }

  /**
   * Удаляет cookie
   */
  static remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    if (typeof document === 'undefined') return

    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`

    if (options.path) {
      cookieString += `; path=${options.path}`
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`
    }

    document.cookie = cookieString
  }

  /**
   * Проверяет существование cookie
   */
  static exists(name: string): boolean {
    return this.get(name) !== null
  }
}

// Специфичные функции для сайта
export const SiteCookies = {
  // Проверка первого посещения
  isFirstVisit(): boolean {
    return !CookieManager.exists('jaluxi_visited')
  },

  // Отметка о посещении
  markVisited(): void {
    CookieManager.set('jaluxi_visited', 'true', {
      maxAge: 24 * 60 * 60, // 24 часа
      path: '/',
      sameSite: 'lax'
    })
  },

  // Получение темы
  getTheme(): 'light' | 'dark' {
    const theme = CookieManager.get('jaluxi_theme')
    return theme === 'dark' ? 'dark' : 'light'
  },

  // Установка темы
  setTheme(theme: 'light' | 'dark'): void {
    CookieManager.set('jaluxi_theme', theme, {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      path: '/',
      sameSite: 'lax'
    })
  },

  // Получение языка
  getLanguage(): string {
    return CookieManager.get('jaluxi_lang') || 'ru'
  },

  // Установка языка
  setLanguage(lang: string): void {
    CookieManager.set('jaluxi_lang', lang, {
      maxAge: 365 * 24 * 60 * 60, // 1 год
      path: '/',
      sameSite: 'lax'
    })
  }
}
