import { Plus, PieChart, Settings, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const quickActions = [
  { icon: Plus, label: 'Добавить', color: 'bg-emerald-500', route: '/add' },
  { icon: PieChart, label: 'Аналитика', color: 'bg-blue-500', route: '/analytics' },
  { icon: Layers, label: 'Категории', color: 'bg-purple-500', route: '/categories' },
  { icon: Settings, label: 'Настройки', color: 'bg-orange-500', route: '/profile' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between gap-2">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(action.route)}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center shadow-lg active:scale-95 transition-transform`}
            >
              <Icon size={24} className="text-white" />
            </div>
            <span className="text-xs text-secondary font-medium">{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
