import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatAmount, formatDateTime } from '../utils/helpers'
import { useState } from 'react'

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const transaction = useFinanceStore((state) => 
    state.getTransactions().find((t) => t.id === id)
  )
  const category = useFinanceStore((state) => 
    state.categories.find((c) => c.id === transaction?.categoryId)
  )
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction)
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!transaction || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <p className="text-[#94A3B8]">Операция не найдена</p>
      </div>
    )
  }

  const handleDelete = () => {
    deleteTransaction(transaction.id)
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-[#1E293B] text-[#94A3B8]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Детали операции</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-8 text-center ${
            transaction.type === 'income'
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
              : 'bg-gradient-to-br from-rose-500 to-pink-600'
          }`}
        >
          <div className="text-2xl mb-2">{category.icon}</div>
          <p className="text-4xl font-bold text-white mb-2">
            {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
          </p>
          <p className="text-sm text-white/80">{category.name}</p>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E293B] rounded-2xl overflow-hidden"
        >
          <div className="px-4 py-4 border-b border-[#334155]">
            <p className="text-xs text-[#94A3B8] mb-1">Категория</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-[#F8FAFC] font-medium">{category.name}</span>
            </div>
          </div>

          <div className="px-4 py-4 border-b border-[#334155]">
            <p className="text-xs text-[#94A3B8] mb-1">Дата и время</p>
            <p className="text-[#F8FAFC] font-medium">
              {formatDateTime(transaction.date)}
            </p>
          </div>

          {transaction.comment && (
            <div className="px-4 py-4">
              <p className="text-xs text-[#94A3B8] mb-1">Комментарий</p>
              <p className="text-[#F8FAFC]">{transaction.comment}</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <button
            onClick={() => navigate(`/add?edit=${id}`)}
            className="w-full py-4 bg-[#1E293B] rounded-2xl flex items-center justify-center gap-2 text-[#F8FAFC] font-medium"
          >
            <Edit2 size={20} />
            Редактировать
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-4 bg-rose-500/10 rounded-2xl flex items-center justify-center gap-2 text-rose-400 font-medium"
          >
            <Trash2 size={20} />
            Удалить
          </button>
        </motion.div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              className="bg-[#1E293B] rounded-t-3xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xl font-bold text-[#F8FAFC] mb-2">Удалить операцию?</p>
              <p className="text-sm text-[#94A3B8] mb-6">
                Это действие нельзя отменить. Операция будет удалена безвозвратно.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-[#334155] rounded-xl text-[#F8FAFC] font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-rose-500 rounded-xl text-white font-medium"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
