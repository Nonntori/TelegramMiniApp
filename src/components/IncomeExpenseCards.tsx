import { useApp } from '@/hooks/useApp';
import { formatAmount } from '@/utils/helpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

export function IncomeExpenseCards() {
  const { totalIncome, totalExpense } = useApp();

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-surface/80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ArrowUpRight size={16} className="text-emerald-400" />
            </div>
            <span className="text-secondary text-sm">Доходы</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            {formatAmount(totalIncome)}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-surface/80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
              <ArrowDownRight size={16} className="text-rose-400" />
            </div>
            <span className="text-secondary text-sm">Расходы</span>
          </div>
          <div className="text-xl font-bold text-white tabular-nums">
            {formatAmount(totalExpense)}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
