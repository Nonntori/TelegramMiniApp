import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, Category, UserSettings } from '../types'
import { storage } from '../lib/storage'

interface FinanceState {
  // Данные
  transactions: Transaction[]
  categories: Category[]
  settings: UserSettings
  
  // UI состояния
  isLoading: boolean
  error: string | null
  
  // Actions для транзакций
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, data: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  getTransactions: () => Transaction[]
  getTransactionsByPeriod: (period: 'week' | 'month' | 'year') => Transaction[]
  
  // Actions для категорий
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Actions для настроек
  updateSettings: (settings: Partial<UserSettings>) => void
  
  // Вычисляемые значения
  balance: number
  totalIncome: number
  totalExpense: number
  balanceChange: number
  
  // Утилиты
  resetData: () => void
}

const defaultCategories: Category[] = [
  // Расходы
  { id: 'c1', name: 'Продукты', icon: '🛒', color: '#34D399', type: 'expense', isSystem: true },
  { id: 'c2', name: 'Транспорт', icon: '🚗', color: '#3B82F6', type: 'expense', isSystem: true },
  { id: 'c3', name: 'Кафе и рестораны', icon: '🍽', color: '#F59E0B', type: 'expense', isSystem: true },
  { id: 'c4', name: 'Развлечения', icon: '🎮', color: '#8B5CF6', type: 'expense', isSystem: true },
  { id: 'c5', name: 'Одежда', icon: '👕', color: '#EC4899', type: 'expense', isSystem: true },
  { id: 'c6', name: 'Здоровье', icon: '❤️', color: '#EF4444', type: 'expense', isSystem: true },
  { id: 'c7', name: 'Коммуналка', icon: '🏠', color: '#6366F1', type: 'expense', isSystem: true },
  { id: 'c8', name: 'Связь', icon: '📱', color: '#14B8A6', type: 'expense', isSystem: true },
  { id: 'c9', name: 'Путешествия', icon: '✈️', color: '#0EA5E9', type: 'expense', isSystem: true },
  { id: 'c10', name: 'Образование', icon: '🎓', color: '#84CC16', type: 'expense', isSystem: true },
  { id: 'c11', name: 'Подарки', icon: '🎁', color: '#F97316', type: 'expense', isSystem: true },
  { id: 'c12', name: 'Другое', icon: '•••', color: '#94A3B8', type: 'expense', isSystem: true },
  
  // Доходы
  { id: 'c13', name: 'Зарплата', icon: '💼', color: '#34D399', type: 'income', isSystem: true },
  { id: 'c14', name: 'Фриланс', icon: '💻', color: '#10B981', type: 'income', isSystem: true },
  { id: 'c15', name: 'Инвестиции', icon: '📈', color: '#059669', type: 'income', isSystem: true },
  { id: 'c16', name: 'Подарки', icon: '🎁', color: '#F59E0B', type: 'income', isSystem: true },
  { id: 'c17', name: 'Другое', icon: '•••', color: '#64748B', type: 'income', isSystem: true },
]

const defaultSettings: UserSettings = {
  currency: 'RUB',
  language: 'ru',
  theme: 'dark',
  firstDayOfWeek: 'monday',
  notifications: true,
  hideBalance: false,
}

// Демо данные для разработки
const demoTransactions: Transaction[] = [
  { id: 't1', userId: 'demo', type: 'income', amount: 9500000, categoryId: 'c13', comment: '', date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't2', userId: 'demo', type: 'expense', amount: 248000, categoryId: 'c1', comment: '', date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't3', userId: 'demo', type: 'expense', amount: 125000, categoryId: 'c3', comment: '', date: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't4', userId: 'demo', type: 'expense', amount: 32000, categoryId: 'c2', comment: '', date: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't5', userId: 'demo', type: 'expense', amount: 599000, categoryId: 'c5', comment: '', date: new Date(Date.now() - 172800000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't6', userId: 'demo', type: 'expense', amount: 320000, categoryId: 'c7', comment: '', date: new Date(Date.now() - 259200000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't7', userId: 'demo', type: 'income', amount: 8700000, categoryId: 'c14', comment: 'Проект для клиента', date: new Date(Date.now() - 345600000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't8', userId: 'demo', type: 'expense', amount: 89000, categoryId: 'c4', comment: '', date: new Date(Date.now() - 432000000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't9', userId: 'demo', type: 'expense', amount: 45000, categoryId: 'c8', comment: '', date: new Date(Date.now() - 518400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't10', userId: 'demo', type: 'expense', amount: 156000, categoryId: 'c6', comment: '', date: new Date(Date.now() - 604800000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      transactions: demoTransactions,
      categories: defaultCategories,
      settings: defaultSettings,
      isLoading: false,
      error: null,
      
      // Добавление транзакции
      addTransaction: (data) => {
        const newTransaction: Transaction = {
          ...data,
          id: `t${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))
        
        // Haptic feedback через Telegram
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
        }
      },
      
      // Обновление транзакции
      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },
      
      // Удаление транзакции
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },
      
      // Получение всех транзакций
      getTransactions: () => {
        return get().transactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      },
      
      // Получение транзакций за период
      getTransactionsByPeriod: (period) => {
        const now = new Date()
        let startDate: Date
        
        switch (period) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
        }
        
        return get().transactions.filter((t) => 
          new Date(t.date) >= startDate
        )
      },
      
      // Добавление категории
      addCategory: (data) => {
        const newCategory: Category = {
          ...data,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },
      
      // Обновление категории
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }))
      },
      
      // Удаление категории
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
      
      // Обновление настроек
      updateSettings: (data) => {
        set((state) => ({
          settings: { ...state.settings, ...data },
        }))
      },
      
      // Вычисляемый баланс (в копейках)
      get balance() {
        const { transactions } = get()
        return transactions.reduce((acc, t) => {
          return t.type === 'income' ? acc + t.amount : acc - t.amount
        }, 0)
      },
      
      // Вычисляемый общий доход
      get totalIncome() {
        const { transactions } = get()
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0)
      },
      
      // Вычисляемый общий расход
      get totalExpense() {
        const { transactions } = get()
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0)
      },
      
      // Изменение баланса за 30 дней
      get balanceChange() {
        const { transactions } = get()
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        
        return transactions
          .filter((t) => new Date(t.date) >= thirtyDaysAgo)
          .reduce((acc, t) => {
            return t.type === 'income' ? acc + t.amount : acc - t.amount
          }, 0)
      },
      
      // Сброс данных
      resetData: () => {
        set({
          transactions: demoTransactions,
          categories: defaultCategories,
          settings: defaultSettings,
        })
      },
    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        settings: state.settings,
      }),
    }
  )
)
