import type { Category, Transaction } from '../types';

// Системные категории расходов
const expenseCategories: Category[] = [
  { id: 'cat_products', name: 'Продукты', icon: '🛒', color: '#34D399', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_transport', name: 'Транспорт', icon: '🚗', color: '#3B82F6', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_cafe', name: 'Кафе и рестораны', icon: '🍽', color: '#F59E0B', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_entertainment', name: 'Развлечения', icon: '🎮', color: '#8B5CF6', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_clothes', name: 'Одежда', icon: '👕', color: '#EC4899', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_health', name: 'Здоровье', icon: '❤️', color: '#EF4444', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_utilities', name: 'Коммуналка', icon: '🏠', color: '#6366F1', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_communication', name: 'Связь', icon: '📱', color: '#14B8A6', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_travel', name: 'Путешествия', icon: '✈️', color: '#0EA5E9', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_education', name: 'Образование', icon: '🎓', color: '#84CC16', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_gifts', name: 'Подарки', icon: '🎁', color: '#F97316', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_other_expense', name: 'Другое', icon: '•••', color: '#94A3B8', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
];

// Системные категории доходов
const incomeCategories: Category[] = [
  { id: 'cat_salary', name: 'Зарплата', icon: '💼', color: '#34D399', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_freelance', name: 'Фриланс', icon: '💻', color: '#3B82F6', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_investments', name: 'Инвестиции', icon: '📈', color: '#8B5CF6', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_gifts_income', name: 'Подарки', icon: '🎁', color: '#F97316', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
  { id: 'cat_other_income', name: 'Другое', icon: '•••', color: '#94A3B8', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
];

export const categories: Category[] = [...expenseCategories, ...incomeCategories];

// Демо-транзакции для seed data
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

export const transactions: Transaction[] = [
  // Сегодня
  {
    id: 'tx_1',
    userId: 'demo_user',
    type: 'expense',
    amount: 248000, // 2 480 ₽ в копейках
    categoryId: 'cat_products',
    comment: '',
    date: today.toISOString(),
    createdAt: new Date(today.setHours(14, 32)).toISOString(),
    updatedAt: new Date(today.setHours(14, 32)).toISOString(),
  },
  {
    id: 'tx_2',
    userId: 'demo_user',
    type: 'income',
    amount: 9500000, // 95 000 ₽
    categoryId: 'cat_salary',
    comment: 'Ежемесячная зарплата',
    date: today.toISOString(),
    createdAt: new Date(today.setHours(10, 0)).toISOString(),
    updatedAt: new Date(today.setHours(10, 0)).toISOString(),
  },
  // Вчера
  {
    id: 'tx_3',
    userId: 'demo_user',
    type: 'expense',
    amount: 125000, // 1 250 ₽
    categoryId: 'cat_cafe',
    comment: 'Ужин с друзьями',
    date: yesterday.toISOString(),
    createdAt: new Date(yesterday.setHours(19, 15)).toISOString(),
    updatedAt: new Date(yesterday.setHours(19, 15)).toISOString(),
  },
  {
    id: 'tx_4',
    userId: 'demo_user',
    type: 'expense',
    amount: 32000, // 320 ₽
    categoryId: 'cat_transport',
    comment: '',
    date: yesterday.toISOString(),
    createdAt: new Date(yesterday.setHours(8, 40)).toISOString(),
    updatedAt: new Date(yesterday.setHours(8, 40)).toISOString(),
  },
  // Два дня назад
  {
    id: 'tx_5',
    userId: 'demo_user',
    type: 'expense',
    amount: 599000, // 5 990 ₽
    categoryId: 'cat_clothes',
    comment: 'Новая куртка',
    date: twoDaysAgo.toISOString(),
    createdAt: new Date(twoDaysAgo.setHours(16, 20)).toISOString(),
    updatedAt: new Date(twoDaysAgo.setHours(16, 20)).toISOString(),
  },
  {
    id: 'tx_6',
    userId: 'demo_user',
    type: 'expense',
    amount: 320000, // 3 200 ₽
    categoryId: 'cat_utilities',
    comment: 'Оплата коммунальных услуг',
    date: twoDaysAgo.toISOString(),
    createdAt: new Date(twoDaysAgo.setHours(11, 0)).toISOString(),
    updatedAt: new Date(twoDaysAgo.setHours(11, 0)).toISOString(),
  },
  // Неделя назад
  {
    id: 'tx_7',
    userId: 'demo_user',
    type: 'expense',
    amount: 45000, // 450 ₽
    categoryId: 'cat_entertainment',
    comment: 'Кинотеатр',
    date: weekAgo.toISOString(),
    createdAt: new Date(weekAgo.setHours(20, 0)).toISOString(),
    updatedAt: new Date(weekAgo.setHours(20, 0)).toISOString(),
  },
  {
    id: 'tx_8',
    userId: 'demo_user',
    type: 'income',
    amount: 1500000, // 15 000 ₽
    categoryId: 'cat_freelance',
    comment: 'Проект для клиента',
    date: weekAgo.toISOString(),
    createdAt: new Date(weekAgo.setHours(15, 0)).toISOString(),
    updatedAt: new Date(weekAgo.setHours(15, 0)).toISOString(),
  },
];

export const seedData = {
  categories,
  transactions,
};
