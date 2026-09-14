import { Transaction, User, Category } from '../types';
import { generateId, getStartOfMonth, getEndOfMonth, getStartOfWeek } from '../utils/helpers';
import { DEFAULT_CATEGORIES } from '../utils/categories';

// Seed data for demo purposes
export function generateSeedData(userId: string): { transactions: Transaction[]; user: User } {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Generate realistic transactions for the current month
  const transactions: Transaction[] = [
    // Income
    {
      id: generateId(),
      userId,
      type: 'income',
      amount: 9500000, // 95,000 ₽ in kopecks
      categoryId: 'cat_salary',
      comment: 'Ежемесячная зарплата',
      date: new Date(currentYear, currentMonth, 10, 10, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'income',
      amount: 2500000, // 25,000 ₽
      categoryId: 'cat_freelance',
      comment: 'Проект для клиента',
      date: new Date(currentYear, currentMonth, 15, 14, 30).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'income',
      amount: 1200000, // 12,000 ₽
      categoryId: 'cat_investments',
      comment: 'Дивиденды',
      date: new Date(currentYear, currentMonth, 20, 9, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Products
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 248000, // 2,480 ₽
      categoryId: 'cat_products',
      comment: 'Продукты на неделю',
      date: new Date(currentYear, currentMonth, 14, 14, 32).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 185000, // 1,850 ₽
      categoryId: 'cat_products',
      date: new Date(currentYear, currentMonth, 7, 18, 15).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 320000, // 3,200 ₽
      categoryId: 'cat_products',
      date: new Date(currentYear, currentMonth, 1, 12, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Cafe
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 125000, // 1,250 ₽
      categoryId: 'cat_cafe',
      comment: 'Обед с коллегами',
      date: new Date(currentYear, currentMonth, 13, 19, 15).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 68000, // 680 ₽
      categoryId: 'cat_cafe',
      comment: 'Кофе',
      date: new Date(currentYear, currentMonth, 5, 8, 45).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Transport
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 32000, // 320 ₽
      categoryId: 'cat_transport',
      comment: 'Метро',
      date: new Date(currentYear, currentMonth, 13, 8, 40).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 45000, // 450 ₽
      categoryId: 'cat_transport',
      comment: 'Такси',
      date: new Date(currentYear, currentMonth, 8, 22, 30).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 250000, // 2,500 ₽
      categoryId: 'cat_transport',
      comment: 'Бензин',
      date: new Date(currentYear, currentMonth, 3, 17, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Clothing
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 599000, // 5,990 ₽
      categoryId: 'cat_clothing',
      comment: 'Новая куртка',
      date: new Date(currentYear, currentMonth, 12, 16, 20).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Utilities
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 320000, // 3,200 ₽
      categoryId: 'cat_utilities',
      comment: 'Коммунальные услуги',
      date: new Date(currentYear, currentMonth, 5, 10, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Entertainment
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 150000, // 1,500 ₽
      categoryId: 'cat_entertainment',
      comment: 'Кино',
      date: new Date(currentYear, currentMonth, 11, 20, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 89000, // 890 ₽
      categoryId: 'cat_entertainment',
      comment: 'Подписка на сервисы',
      date: new Date(currentYear, currentMonth, 1, 9, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Health
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 250000, // 2,500 ₽
      categoryId: 'cat_health',
      comment: 'Витамины',
      date: new Date(currentYear, currentMonth, 9, 11, 30).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Communication
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 45000, // 450 ₽
      categoryId: 'cat_communication',
      comment: 'Мобильная связь',
      date: new Date(currentYear, currentMonth, 2, 14, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    
    // Expenses - Education
    {
      id: generateId(),
      userId,
      type: 'expense',
      amount: 1500000, // 15,000 ₽
      categoryId: 'cat_education',
      comment: 'Онлайн-курс',
      date: new Date(currentYear, currentMonth, 6, 10, 0).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const user: User = {
    id: generateId(),
    telegramId: userId,
    username: 'demo_user',
    firstName: 'Демо',
    lastName: 'Пользователь',
    avatarUrl: undefined,
    currency: 'RUB',
    language: 'ru',
    hideBalance: false,
    firstDayOfWeek: 1,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { transactions, user };
}

// In-memory storage (for demo purposes)
class Storage {
  private data: {
    users: Map<string, User>;
    transactions: Map<string, Transaction>;
    categories: Map<string, Category>;
  };

  constructor() {
    this.data = {
      users: new Map(),
      transactions: new Map(),
      categories: new Map(),
    };
    
    // Initialize default categories
    DEFAULT_CATEGORIES.forEach(cat => {
      this.data.categories.set(cat.id, cat);
    });
  }

  initUser(telegramId: string): User {
    const existingUser = Array.from(this.data.users.values()).find(u => u.telegramId === telegramId);
    if (existingUser) {
      return existingUser;
    }

    const { user, transactions } = generateSeedData(telegramId);
    this.data.users.set(user.id, user);
    transactions.forEach(t => this.data.transactions.set(t.id, t));
    
    return user;
  }

  getUserByTelegramId(telegramId: string): User | null {
    return Array.from(this.data.users.values()).find(u => u.telegramId === telegramId) || null;
  }

  getUserById(id: string): User | null {
    return this.data.users.get(id) || null;
  }

  updateUser(user: User): User {
    this.data.users.set(user.id, user);
    return user;
  }

  getTransactions(userId: string): Transaction[] {
    return Array.from(this.data.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTransaction(id: string): Transaction | null {
    return this.data.transactions.get(id) || null;
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.transactions.set(newTransaction.id, newTransaction);
    return newTransaction;
  }

  updateTransaction(transaction: Transaction): Transaction {
    transaction.updatedAt = new Date().toISOString();
    this.data.transactions.set(transaction.id, transaction);
    return transaction;
  }

  deleteTransaction(id: string): boolean {
    return this.data.transactions.delete(id);
  }

  getCategories(): Category[] {
    return Array.from(this.data.categories.values());
  }

  getCategory(id: string): Category | null {
    return this.data.categories.get(id) || null;
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    this.data.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  updateCategory(category: Category): Category {
    this.data.categories.set(category.id, category);
    return category;
  }

  deleteCategory(id: string): boolean {
    const category = this.data.categories.get(id);
    if (category?.isSystem) {
      return false;
    }
    return this.data.categories.delete(id);
  }
}

export const storage = new Storage();
