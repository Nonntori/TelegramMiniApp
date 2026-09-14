import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BalanceCard from '../components/BalanceCard'
import { IncomeExpenseCards } from '../components/IncomeExpenseCards'
import { QuickActions } from '../components/QuickActions'
import { RecentTransactions } from '../components/RecentTransactions'
import { BottomNavigation } from '../components/BottomNavigation'
import { closeTelegramApp } from '../lib/telegram'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg"
            >
              ₽
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[#F8FAFC]">Финансы</h1>
              <p className="text-xs text-[#94A3B8]">Твой бюджет — твои правила</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full bg-[#1E293B] text-[#94A3B8]"
            >
              <Menu size={20} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={closeTelegramApp}
              className="p-2 rounded-full bg-[#1E293B] text-[#94A3B8]"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-4">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BalanceCard />
        </motion.div>

        {/* Income/Expense Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <IncomeExpenseCards />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <QuickActions />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <RecentTransactions />
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
