import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { useFinanceStore } from '../store/useFinanceStore'

export default function CategoriesPage() {
  const categories = useFinanceStore((state) => state.categories)
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all')

  const filteredCategories = categories.filter((c) => 
    filter === 'all' || c.type === filter
  )

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-4">Категории</h1>
        
        {/* Фильтры */}
        <div className="flex gap-2">
          {(['all', 'expense', 'income'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              {type === 'all' ? 'Все' : type === 'expense' ? 'Расходы' : 'Доходы'}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1E293B] rounded-2xl p-4 flex flex-col items-center gap-2"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: category.color + '33', color: category.color }}
              >
                {category.icon}
              </div>
              <span className="text-xs text-[#F8FAFC] text-center truncate w-full">
                {category.name}
              </span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* FAB для добавления */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
      >
        <Plus size={24} className="text-white" />
      </motion.button>

      <BottomNavigation />
    </div>
  )
}
