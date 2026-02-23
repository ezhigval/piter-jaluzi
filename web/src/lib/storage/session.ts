// Работа с sessionStorage

export class SessionManager {
  /**
   * Устанавливает значение в sessionStorage
   */
  static set(key: string, value: string): void {
    if (typeof sessionStorage === 'undefined') return
    try {
      sessionStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to set sessionStorage item:', error)
    }
  }

  /**
   * Получает значение из sessionStorage
   */
  static get(key: string): string | null {
    if (typeof sessionStorage === 'undefined') return null
    try {
      return sessionStorage.getItem(key)
    } catch (error) {
      console.warn('Failed to get sessionStorage item:', error)
      return null
    }
  }

  /**
   * Удаляет значение из sessionStorage
   */
  static remove(key: string): void {
    if (typeof sessionStorage === 'undefined') return
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove sessionStorage item:', error)
    }
  }

  /**
   * Очищает sessionStorage
   */
  static clear(): void {
    if (typeof sessionStorage === 'undefined') return
    try {
      sessionStorage.clear()
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error)
    }
  }

  /**
   * Проверяет существование ключа
   */
  static exists(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Устанавливает JSON объект
   */
  static setJSON(key: string, value: any): void {
    this.set(key, JSON.stringify(value))
  }

  /**
   * Получает JSON объект
   */
  static getJSON<T>(key: string): T | null {
    const value = this.get(key)
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.warn('Failed to parse JSON from sessionStorage:', error)
      return null
    }
  }
}

// Специфичные функции для сайта
export const SiteSession = {
  // Отслеживание текущей сессии
  getSessionId(): string {
    let sessionId = SessionManager.get('jaluxi_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      SessionManager.set('jaluxi_session_id', sessionId)
    }
    return sessionId
  },

  // Отметка о загрузке страницы
  markPageLoad(): void {
    const loads = parseInt(SessionManager.get('jaluxi_page_loads') || '0') + 1
    SessionManager.set('jaluxi_page_loads', loads.toString())
  },

  // Получение количества загрузок
  getPageLoads(): number {
    return parseInt(SessionManager.get('jaluxi_page_loads') || '0')
  },

  // Сохранение состояния калькулятора
  saveCalculatorState(state: any): void {
    SessionManager.setJSON('jaluxi_calculator_state', state)
  },

  // Получение состояния калькулятора
  getCalculatorState(): any {
    return SessionManager.getJSON('jaluxi_calculator_state')
  },

  // Сохранение фильтров каталога
  saveCatalogFilters(filters: any): void {
    SessionManager.setJSON('jaluxi_catalog_filters', filters)
  },

  // Получение фильтров каталога
  getCatalogFilters(): any {
    return SessionManager.getJSON('jaluxi_catalog_filters')
  },

  // Очистка при выходе
  clearOnLogout(): void {
    const keysToKeep = ['jaluxi_theme', 'jaluxi_lang']
    const allKeys = Object.keys(sessionStorage)
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        SessionManager.remove(key)
      }
    })
  }
}
