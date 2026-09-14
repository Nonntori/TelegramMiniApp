import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import TransactionItem from '../components/TransactionItem'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatAmount, formatDate, formatTime } from '../utils/helpers'

type FilterType = 'all' | 'income' | 'expense'
type PeriodFilter = 'all' | 'today' | 'week' | 'month'

export default function TransactionsPage() {
  const navigate = useNavigate()
  const transactions = useFinanceStore((state) => state.getTransactions())
  const categories = useFinanceStore((state) => state.categories)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')

  const filteredTransactions = transactions.filter((t) => {
    // Поиск по названию категории или комментарию
    const category = categories.find((c) => c.id === t.categoryId)
    const matchesSearch = searchQuery === '' || 
      category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.comment && t.comment.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Фильтр по типу
    const matchesType = filterType === 'all' || t.type === filterType
    
    // Фильтр по периоду
    let matchesPeriod = true
    if (periodFilter !== 'all') {
      const now = new Date()
      const transactionDate = new Date(t.date)
      
      switch (periodFilter) {
        case 'today':
          matchesPeriod = transactionDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesPeriod = transactionDate >= weekAgo
          break
        case 'month':
          matchesPeriod = transactionDate.getMonth() === now.getMonth() && 
                         transactionDate.getFullYear() === now.getFullYear()
          break
      }
    }
    
    return matchesSearch && matchesType && matchesPeriod
  })

  // Группировка транзакций по датам
  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const dateKey = new Date(t.date).toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(t)
    return acc
  }, {} as Record<string, typeof transactions>)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-4">Операции</h1>
        
        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] rounded-xl pl-10 pr-4 py-3 text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Filter size={20} />
          </button>
        </div>

        {/* Фильтры по типу */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
            </button>
          ))}
        </div>

        {/* Фильтры по периоду */}
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'today', 'week', 'month'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                periodFilter === period
                  ? 'bg-[#334155] text-[#F8FAFC]'
                  : 'bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              {period === 'all' ? 'Все время' : period === 'today' ? 'Сегодня' : period === 'week' ? 'Неделя' : 'Месяц'}
            </button>
          ))}
        </div>
      </header>

      {/* Список операций */}
      <main className="px-4 py-4 space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-[#F8FAFC] font-medium mb-2">Нет операций</p>
            <p className="text-[#94A3B8] text-sm">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, items]) => {
            const date = new Date(dateKey)
            const dayIncome = items.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
            const dayExpense = items.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

            return (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#94A3B8]">
                    {formatDate(date.toISOString())}
                  </span>
                  <div className="flex gap-3 text-xs">
                    {dayIncome > 0 && (
                      <span className="text-emerald-400">+{formatAmount(dayIncome)}</span>
                    )}
                    {dayExpense > 0 && (
                      <span className="text-rose-400">-{formatAmount(dayExpense)}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {items.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      category={categories.find((c) => c.id === transaction.categoryId)}
                      onClick={() => navigate(`/transaction/${transaction.id}`)}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
