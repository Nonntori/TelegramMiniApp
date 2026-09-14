import { useApp } from '@/hooks/useApp';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from './ui/EmptyState';
import { SkeletonList } from './ui/Skeleton';
import { Wallet } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export function RecentTransactions() {
  const navigate = useNavigate();
  const { transactions, isLoading } = useApp();
  
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return <SkeletonList />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Wallet />}
        title="Пока нет операций"
        description="Добавьте первую операцию, чтобы начать вести учёт."
        action={
          <Button onClick={() => navigate('/add')}>
            Добавить операцию
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {recentTransactions.map((transaction, index) => (
        <TransactionItem key={transaction.id} transaction={transaction} index={index} />
      ))}
    </div>
  );
}
