import { useApp } from '@/hooks/useApp';
import { formatAmount } from '@/utils/helpers';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function BalanceCard() {
  const { getBalanceSummary, user } = useApp();
  const [isHidden, setIsHidden] = useState(false);
  
  const summary = getBalanceSummary('month');
  const balance = summary.totalBalance;
  const periodChange = summary.periodIncome - summary.periodExpense;

  if (user?.hideBalance || isHidden) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl shadow-emerald-900/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-100 text-sm font-medium">Общий баланс</span>
          <button
            onClick={() => setIsHidden(false)}
            className="text-emerald-200 hover:text-white transition-colors"
          >
            <EyeOff size={20} />
          </button>
        </div>
        <div className="text-4xl font-bold text-white tabular-nums mb-3">
          ••••• ₽
        </div>
        <div className="flex items-center gap-2 text-emerald-100 text-sm">
          <span>{periodChange >= 0 ? '↑' : '↓'} {Math.abs(periodChange) >= 0 ? formatAmount(Math.abs(periodChange)) : '—'} за последние 30 дней</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl shadow-emerald-900/20"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-emerald-100 text-sm font-medium">Общий баланс</span>
        <button
          onClick={() => setIsHidden(true)}
          className="text-emerald-200 hover:text-white transition-colors"
        >
          <Eye size={20} />
        </button>
      </div>
      <div className="text-4xl font-bold text-white tabular-nums mb-3">
        {formatAmount(balance)}
      </div>
      <div className="flex items-center gap-2 text-emerald-100 text-sm">
        <span className={periodChange >= 0 ? 'text-emerald-200' : 'text-rose-300'}>
          {periodChange >= 0 ? '↑' : '↓'} {formatAmount(Math.abs(periodChange))}
        </span>
        <span>за последние 30 дней</span>
      </div>
    </motion.div>
  );
}
