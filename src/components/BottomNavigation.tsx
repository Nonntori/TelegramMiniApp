import { Wallet, TrendingUp, PieChart, User } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Wallet, label: 'Главная' },
  { path: '/transactions', icon: TrendingUp, label: 'Операции' },
  { path: '/analytics', icon: PieChart, label: 'Аналитика' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-surface-light safe-bottom z-30">
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-secondary hover:text-white'
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
