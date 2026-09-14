import { useApp } from '@/hooks/useApp';
import { formatAmount, formatDate, formatTime, cn } from '@/utils/helpers';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function TransactionItem({ transaction, index }: { transaction: any; index: number }) {
  const navigate = useNavigate();
  const { categories } = useApp();
  
  const category = categories.find(c => c.id === transaction.categoryId);
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/transaction/${transaction.id}`)}
      className="flex items-center gap-3 p-3 bg-surface rounded-xl active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        {category?.icon || '📦'}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">{category?.name || 'Без категории'}</div>
        <div className="text-sm text-secondary">
          {formatDate(transaction.date)}, {formatTime(transaction.date)}
        </div>
      </div>
      
      <div className={cn(
        'font-semibold tabular-nums',
        isIncome ? 'text-income' : 'text-expense'
      )}>
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </div>
    </motion.div>
  );
}
