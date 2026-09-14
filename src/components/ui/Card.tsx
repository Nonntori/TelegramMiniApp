import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl p-4 shadow-xl',
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
