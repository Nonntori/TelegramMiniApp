export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isSystem: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // stored in kopecks (minor units)
  categoryId: string;
  category?: Category;
  comment?: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  currency: string;
  language: string;
  hideBalance: boolean;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  periodIncome: number;
  periodExpense: number;
}

export type PeriodType = 'week' | 'month' | 'year';

export interface AnalyticsData {
  periodStart: string;
  periodEnd: string;
  totalExpense: number;
  totalIncome: number;
  categoriesBreakdown: {
    categoryId: string;
    categoryName: string;
    color: string;
    amount: number;
    percentage: number;
  }[];
  dailyExpenses: {
    date: string;
    amount: number;
  }[];
  averageDailyExpense: number;
  mostExpensiveCategory?: string;
  transactionCount: number;
  savings: number;
}
