import { WebApp } from '@telegram-apps/sdk'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export function initTelegramWebApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    
    // Сообщаем Telegram что приложение готово
    tg.ready()
    
    // Разворачиваем на весь экран
    tg.expand()
    
    // Настраиваем цвета хедера
    tg.setHeaderColor('#0F172A')
    tg.setBackgroundColor('#0F172A')
    
    // Включаем подтверждение закрытия если есть несохранённые данные
    tg.enableClosingConfirmation()
    
    console.log('Telegram WebApp initialized')
  } else {
    console.log('Running outside Telegram - using fallback mode')
  }
}

export function getTelegramUser() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user || null
  }
  return null
}

export function getTelegramInitData(): string {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initData || ''
  }
  return ''
}

export function isDarkMode(): boolean {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.colorScheme === 'dark'
  }
  return true // По умолчанию тёмная тема
}

export function triggerHapticFeedback(type: 'impact' | 'notification' | 'selection', style?: string): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const haptic = window.Telegram.WebApp.HapticFeedback
    if (type === 'impact' && style) {
      haptic.impactOccurred(style as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft')
    } else if (type === 'notification' && style) {
      haptic.notificationOccurred(style as 'error' | 'success' | 'warning')
    } else if (type === 'selection') {
      haptic.selectionChanged()
    }
  }
}

export function closeTelegramApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close()
  }
}
