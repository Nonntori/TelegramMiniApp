import { useApp } from '@/hooks/useApp';
import { formatAmount, formatDate, generateId } from '@/utils/helpers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AddTransactionPageProps {
  initialEditId?: string;
}

export function AddTransactionPage({ initialEditId }: AddTransactionPageProps) {
  const navigate = useNavigate();
  const { addTransaction, categories, transactions } = useApp();
  
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [comment, setComment] = useState('');

  const filteredCategories = type === 'expense'
    ? categories.filter(c => c.type === 'expense')
    : categories.filter(c => c.type === 'income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId) return;

    const amountInKopecks = Math.round(parseFloat(amount.replace(/\s/g, '')) * 100);
    const dateTime = new Date(`${date}T${time}`).toISOString();

    addTransaction({
      type,
      amount: type === 'expense' ? -amountInKopecks : amountInKopecks,
      categoryId,
      comment: comment || undefined,
      date: dateTime,
    });

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    navigate('/');
  };

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    if (amount.length >= 10) return;
    setAmount(prev => prev + num);
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 px-4 py-4 flex items-center justify-between border-b border-surface-light">
        <button onClick={() => navigate(-1)} className="p-2 text-secondary hover:text-white">
          <X size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white">Добавить операцию</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Type Toggle */}
        <div className="flex bg-surface rounded-xl p-1">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'text-secondary hover:text-white'
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-secondary hover:text-white'
            }`}
          >
            Доход
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-white tabular-nums">
            {amount ? formatAmount(Math.round(parseFloat(amount) * 100)) : '0 ₽'}
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumberClick(num.toString())}
              className="bg-surface-light rounded-xl py-4 text-2xl font-semibold text-white active:bg-surface transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="bg-surface-light rounded-xl py-4 text-lg font-medium text-secondary active:bg-surface transition-colors"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => handleNumberClick('0')}
            className="bg-surface-light rounded-xl py-4 text-2xl font-semibold text-white active:bg-surface transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="bg-surface-light rounded-xl py-4 text-xl font-medium text-white active:bg-surface transition-colors"
          >
            ⌫
          </button>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm text-secondary mb-2">Категория</label>
          <div className="grid grid-cols-3 gap-2">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  categoryId === cat.id
                    ? 'bg-primary/20 ring-2 ring-primary'
                    : 'bg-surface hover:bg-surface-light'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-secondary truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-secondary mb-2">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-light rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-secondary mb-2">Время</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-surface-light rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm text-secondary mb-2">Комментарий (необязательно)</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Что это было?"
            className="w-full bg-surface-light rounded-xl px-4 py-3 text-white placeholder-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || !categoryId}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
