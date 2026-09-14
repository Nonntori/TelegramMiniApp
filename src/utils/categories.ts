import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense categories
  { id: 'cat_products', name: 'Продукты', icon: '🛒', color: '#34D399', type: 'expense', isSystem: true },
  { id: 'cat_transport', name: 'Транспорт', icon: '🚗', color: '#3B82F6', type: 'expense', isSystem: true },
  { id: 'cat_cafe', name: 'Кафе и рестораны', icon: '🍽', color: '#F59E0B', type: 'expense', isSystem: true },
  { id: 'cat_entertainment', name: 'Развлечения', icon: '🎮', color: '#8B5CF6', type: 'expense', isSystem: true },
  { id: 'cat_clothing', name: 'Одежда', icon: '👕', color: '#EC4899', type: 'expense', isSystem: true },
  { id: 'cat_health', name: 'Здоровье', icon: '❤️', color: '#EF4444', type: 'expense', isSystem: true },
  { id: 'cat_utilities', name: 'Коммуналка', icon: '🏠', color: '#6366F1', type: 'expense', isSystem: true },
  { id: 'cat_communication', name: 'Связь', icon: '📱', color: '#14B8A6', type: 'expense', isSystem: true },
  { id: 'cat_travel', name: 'Путешествия', icon: '✈️', color: '#0EA5E9', type: 'expense', isSystem: true },
  { id: 'cat_education', name: 'Образование', icon: '🎓', color: '#84CC16', type: 'expense', isSystem: true },
  { id: 'cat_gifts', name: 'Подарки', icon: '🎁', color: '#F472B6', type: 'expense', isSystem: true },
  { id: 'cat_other_expense', name: 'Другое', icon: '•••', color: '#94A3B8', type: 'expense', isSystem: true },
  
  // Income categories
  { id: 'cat_salary', name: 'Зарплата', icon: '💼', color: '#34D399', type: 'income', isSystem: true },
  { id: 'cat_freelance', name: 'Фриланс', icon: '💻', color: '#10B981', type: 'income', isSystem: true },
  { id: 'cat_investments', name: 'Инвестиции', icon: '📈', color: '#059669', type: 'income', isSystem: true },
  { id: 'cat_gifts_income', name: 'Подарки', icon: '🎁', color: '#F472B6', type: 'income', isSystem: true },
  { id: 'cat_other_income', name: 'Другое', icon: '•••', color: '#94A3B8', type: 'income', isSystem: true },
];

export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find(cat => cat.id === id);
}

export function getExpenseCategories(): Category[] {
  return DEFAULT_CATEGORIES.filter(cat => cat.type === 'expense');
}

export function getIncomeCategories(): Category[] {
  return DEFAULT_CATEGORIES.filter(cat => cat.type === 'income');
}
