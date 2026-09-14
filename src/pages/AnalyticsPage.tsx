import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import BottomNavigation from '../components/BottomNavigation'
import { useFinanceStore } from '../store/useFinanceStore'
import { formatAmount } from '../utils/helpers'

type Period = 'week' | 'month' | 'year'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('month')
  
  const transactions = useFinanceStore((state) => state.getTransactionsByPeriod(period))
  const categories = useFinanceStore((state) => state.categories)

  // Фильтрация по периоду
  const filteredTransactions = transactions.filter((t) => {
    const now = new Date()
    const transactionDate = new Date(t.date)
    
    switch (period) {
      case 'week':
        return transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
      case 'year':
        return transactionDate.getFullYear() === now.getFullYear()
    }
  })

  // Общие суммы
  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  // Расходы по категориям
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const pieData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === categoryId)
    return {
      name: category?.name || 'Другое',
      value: amount,
      color: category?.color || '#94A3B8',
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }
  }).sort((a, b) => b.value - a.value)

  // Дневные расходы для графика
  const dailyExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      acc[date] = (acc[date] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const barData = Object.entries(dailyExpenses).map(([date, amount]) => ({
    date,
    amount,
  }))

  // Статистика
  const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const averageDailyExpense = Math.round(totalExpense / daysInPeriod)
  const mostExpensiveCategory = pieData[0]?.name
  const savings = totalIncome - totalExpense

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] px-3 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-[#F8FAFC]">{payload[0].payload.name}</p>
          <p className="text-sm font-bold text-emerald-400">{formatAmount(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] px-3 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-[#F8FAFC]">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-rose-400">{formatAmount(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-4">Аналитика</h1>
        
        {/* Переключатель периода */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#1E293B] text-[#94A3B8]'
              }`}
            >
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>

        {/* Дата диапазон */}
        <p className="text-xs text-[#94A3B8] mt-3">
          {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </p>
      </header>

      {/* Content */}
      <main className="px-4 py-4 space-y-4">
        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E293B] rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Расходы по категориям</h2>
          
          {pieData.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Центр с общей суммой */}
              <div className="absolute text-center">
                <p className="text-xl font-bold text-[#F8FAFC]">{formatAmount(totalExpense)}</p>
                <p className="text-xs text-[#94A3B8]">всего расходов</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#94A3B8]">Нет данных за выбранный период</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {pieData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#F8FAFC]">{item.name}</span>
                </div>
                <span className="text-[#94A3B8]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E293B] rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Динамика расходов</h2>
          
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={barData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="#F43F5E" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#94A3B8]">Нет данных за выбранный период</p>
            </div>
          )}
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Средний расход в день</p>
            <p className="text-lg font-bold text-[#F8FAFC]">{formatAmount(averageDailyExpense)}</p>
          </div>
          
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Самая дорогая категория</p>
            <p className="text-lg font-bold text-[#F8FAFC] truncate">{mostExpensiveCategory || '—'}</p>
          </div>
          
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Количество операций</p>
            <p className="text-lg font-bold text-[#F8FAFC]">{filteredTransactions.length}</p>
          </div>
          
          <div className="bg-[#1E293B] rounded-2xl p-4">
            <p className="text-xs text-[#94A3B8] mb-1">Накоплено за период</p>
            <p className={`text-lg font-bold ${savings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {savings >= 0 ? '+' : ''}{formatAmount(savings)}
            </p>
          </div>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
