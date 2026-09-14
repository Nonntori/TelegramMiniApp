import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Category, User } from '../types';
import { seedData } from '../data/seed';

const STORAGE_KEY_TRANSACTIONS = 'finance_app_transactions';
const STORAGE_KEY_CATEGORIES = 'finance_app_categories';
const STORAGE_KEY_USER = 'finance_app_user';

export function useApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHiddenBalance, setIsHiddenBalance] = useState(false);

  // Инициализация данных
  useEffect(() => {
    const initData = async () => {
      try {
        // Проверяем Telegram WebApp
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
          tg.ready();
          tg.expand();
          
          const tgUser = tg.initDataUnsafe?.user;
          if (tgUser) {
            const storedUser = localStorage.getItem(STORAGE_KEY_USER);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              const newUser: User = {
                id: tgUser.id.toString(),
                telegramId: tgUser.id.toString(),
                username: tgUser.username || '',
                firstName: tgUser.first_name || '',
                lastName: tgUser.last_name || '',
                avatarUrl: tgUser.photo_url || '',
                currency: 'RUB',
                language: 'ru',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setUser(newUser);
              localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
            }
          }
        }

        // Загружаем категории
        const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          setCategories(seedData.categories);
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(seedData.categories));
        }

        // Загружаем транзакции
        const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          setTransactions(seedData.transactions);
          localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(seedData.transactions));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // Добавление транзакции
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });

    // Haptic feedback
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

    return newTransaction;
  }, []);

  // Обновление транзакции
  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => {
      const updated = prev.map(t => 
        t.id === id 
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      );
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Удаление транзакции
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Добавление категории
  const addCategory = useCallback((category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setCategories(prev => {
      const updated = [...prev, newCategory];
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      return updated;
    });

    return newCategory;
  }, []);

  // Обновление категории
  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev => {
      const updated = prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      );
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Удаление категории
  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Переключение видимости баланса
  const toggleHiddenBalance = useCallback(() => {
    setIsHiddenBalance(prev => !prev);
  }, []);

  // Вычисление баланса
  const balance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Вычисление доходов
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  // Вычисление расходов
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    transactions,
    categories,
    user,
    isLoading,
    isHiddenBalance,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleHiddenBalance,
  };
}
