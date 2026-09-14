import { formatAmount } from '../utils/helpers'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFinanceStore } from '../store/useFinanceStore'

export default function BalanceCard() {
  const balance = useFinanceStore((state) => state.balance)
  const balanceChange = useFinanceStore((state) => state.balanceChange)
  const settings = useFinanceStore((state) => state.settings)
  const [isHidden, setIsHidden] = useState(false)

  const shouldHide = settings.hideBalance || isHidden

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl shadow-emerald-900/20"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-emerald-100 text-sm font-medium">Общий баланс</span>
        <button
          onClick={() => setIsHidden(!isHidden)}
          className="text-emerald-200 hover:text-white transition-colors"
        >
          {shouldHide ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      
      {shouldHide ? (
        <div className="text-4xl font-bold text-white tabular-nums mb-3">••••• ₽</div>
      ) : (
        <div className="text-4xl font-bold text-white tabular-nums mb-3">
          {formatAmount(balance)}
        </div>
      )}
      
      <div className="flex items-center gap-2 text-emerald-100 text-sm">
        <span className={balanceChange >= 0 ? 'text-emerald-200' : 'text-rose-300'}>
          {balanceChange >= 0 ? '↑' : '↓'} {formatAmount(Math.abs(balanceChange))}
        </span>
        <span>за последние 30 дней</span>
      </div>
    </motion.div>
  )
}
