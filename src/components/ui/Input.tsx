import { cn } from '@/utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-secondary mb-2">{label}</label>
      )}
      <input
        className={cn(
          'w-full bg-surface-light rounded-xl px-4 py-3 text-white placeholder-secondary/50',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'transition-all',
          className
        )}
        {...props}
      />
      {error && <p className="text-rose-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
