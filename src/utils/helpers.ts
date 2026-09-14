import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number, currency: string = 'RUB'): string {
  const rubles = Math.abs(Math.floor(amount / 100));
  const formatted = rubles.toLocaleString('ru-RU');
  const sign = amount < 0 ? '-' : '';
  return `${sign}${formatted} ₽`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Сегодня';
  } else if (isSameDay(date, yesterday)) {
    return 'Вчера';
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function getStartOfWeek(date: Date, startOnMonday: boolean = true): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = startOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getStartOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function getDateRange(period: 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return {
        start: getStartOfWeek(now, true),
        end: getEndOfDay(now),
      };
    case 'month':
      return {
        start: getStartOfMonth(now),
        end: getEndOfDay(now),
      };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: getEndOfDay(now),
      };
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
