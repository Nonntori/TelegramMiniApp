import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, Category, BalanceSummary, AnalyticsData, PeriodType } from '../types';
import { storage } from '../lib/storage';
import { getDateRange, getStartOfMonth, getEndOfMonth } from '../utils/helpers';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  initUser: (telegramId: string, telegramData?: any) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  getBalanceSummary: (period?: PeriodType) => BalanceSummary;
  getAnalytics: (period: PeriodType) => AnalyticsData;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initUser = (telegramId: string, telegramData?: any) => {
    try {
      const initializedUser = storage.initUser(telegramId);
      
      // Update with Telegram data if available
      if (telegramData) {
        initializedUser.username = telegramData.username || initializedUser.username;
        initializedUser.firstName = telegramData.first_name || initializedUser.firstName;
        initializedUser.lastName = telegramData.last_name || initializedUser.lastName;
        initializedUser.avatarUrl = telegramData.photo_url || initializedUser.avatarUrl;
        storage.updateUser(initializedUser);
      }
      
      setUser(initializedUser);
      setTransactions(storage.getTransactions(initializedUser.id));
      setCategories(storage.getCategories());
    } catch (error) {
      console.error('Failed to initialize user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Transaction => {
    if (!user) throw new Error('User not initialized');
    
    const newTransaction = storage.createTransaction({
      ...data,
      userId: user.id,
    });
    
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (transaction: Transaction) => {
    storage.updateTransaction(transaction);
    setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
  };

  const deleteTransaction = (id: string) => {
    storage.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
    storage.updateUser(updatedUser);
    setUser(updatedUser);
  };

  const getBalanceSummary = (period: PeriodType = 'month'): BalanceSummary => {
    const now = new Date();
    let periodStart: Date;
    
    switch (period) {
      case 'week':
        periodStart = getDateRange('week').start;
        break;
      case 'month':
        periodStart = getStartOfMonth(now);
        break;
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const periodTransactions = transactions.filter(t => new Date(t.date) >= periodStart);
    
    const periodIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const periodExpense = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      periodIncome,
      periodExpense,
    };
  };

  const getAnalytics = (period: PeriodType): AnalyticsData => {
    const range = getDateRange(period);
    const periodTransactions = transactions.filter(
      t => new Date(t.date) >= range.start && new Date(t.date) <= range.end
    );

    const totalExpense = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Categories breakdown
    const expenseByCategory = new Map<string, number>();
    periodTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory.set(t.categoryId, (expenseByCategory.get(t.categoryId) || 0) + t.amount);
      });

    const categoriesBreakdown = Array.from(expenseByCategory.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Неизвестно',
          color: category?.color || '#94A3B8',
          amount,
          percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Daily expenses
    const dailyExpensesMap = new Map<string, number>();
    periodTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const dateKey = new Date(t.date).toISOString().split('T')[0];
        dailyExpensesMap.set(dateKey, (dailyExpensesMap.get(dateKey) || 0) + t.amount);
      });

    const dailyExpenses = Array.from(dailyExpensesMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const daysInPeriod = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const averageDailyExpense = Math.round(totalExpense / daysInPeriod);

    const mostExpensiveCategory = categoriesBreakdown[0]?.categoryName;

    return {
      periodStart: range.start.toISOString(),
      periodEnd: range.end.toISOString(),
      totalExpense,
      totalIncome,
      categoriesBreakdown,
      dailyExpenses,
      averageDailyExpense,
      mostExpensiveCategory,
      transactionCount: periodTransactions.length,
      savings: totalIncome - totalExpense,
    };
  };

  const value: AppContextType = {
    user,
    transactions,
    categories,
    isLoading,
    initUser,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateUser,
    getBalanceSummary,
    getAnalytics,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
