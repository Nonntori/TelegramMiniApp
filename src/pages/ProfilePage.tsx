import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Bell, Eye, EyeOff, Moon, Sun, Globe, DollarSign } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { useFinanceStore } from '../store/useFinanceStore'
import { getTelegramUser } from '../lib/telegram'

export default function ProfilePage() {
  const settings = useFinanceStore((state) => state.settings)
  const updateSettings = useFinanceStore((state) => state.updateSettings)
  const resetData = useFinanceStore((state) => state.resetData)
  
  const tgUser = getTelegramUser()
  
  const [hideBalance, setHideBalance] = useState(settings.hideBalance)
  const [notifications, setNotifications] = useState(settings.notifications)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-lg px-4 py-4">
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Профиль</h1>
      </header>

      {/* Content */}
      <main className="px-4 py-4 space-y-6">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
            {tgUser?.first_name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-lg font-bold text-[#F8FAFC]">
              {tgUser?.first_name || 'Пользователь'}
            </p>
            <p className="text-sm text-[#94A3B8]">
              @{tgUser?.username || 'user'}
            </p>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Appearance */}
          <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
            <p className="px-4 py-3 text-xs text-[#94A3B8] uppercase tracking-wider">
              Внешний вид
            </p>
            
            <button 
              onClick={() => setHideBalance(!hideBalance)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors"
            >
              <div className="flex items-center gap-3">
                {hideBalance ? <EyeOff size={20} className="text-[#94A3B8]" /> : <Eye size={20} className="text-emerald-400" />}
                <span className="text-[#F8FAFC]">Скрывать баланс</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${hideBalance ? 'bg-emerald-500' : 'bg-[#334155]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${hideBalance ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
              </div>
            </button>

            <div className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-[#94A3B8]" />
                <span className="text-[#F8FAFC]">Тема</span>
              </div>
              <span className="text-sm text-[#94A3B8]">Тёмная</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
            <p className="px-4 py-3 text-xs text-[#94A3B8] uppercase tracking-wider">
              Настройки
            </p>
            
            <div className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-emerald-400" />
                <span className="text-[#F8FAFC]">Валюта</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#94A3B8]">RUB</span>
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>

            <div className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-blue-400" />
                <span className="text-[#F8FAFC]">Язык</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#94A3B8]">Русский</span>
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>

            <button 
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className={notifications ? 'text-emerald-400' : 'text-[#94A3B8]'} />
                <span className="text-[#F8FAFC]">Уведомления</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-emerald-500' : 'bg-[#334155]'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
              </div>
            </button>
          </div>

          {/* Data */}
          <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
            <p className="px-4 py-3 text-xs text-[#94A3B8] uppercase tracking-wider">
              Данные
            </p>
            
            <button 
              onClick={resetData}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#334155] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-rose-400">🔄</span>
                <span className="text-[#F8FAFC]">Сбросить демо данные</span>
              </div>
              <ChevronRight size={16} className="text-[#94A3B8]" />
            </button>
          </div>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs text-[#94A3B8]">
          Финансы v1.0.0
        </p>
      </main>

      <BottomNavigation />
    </div>
  )
}
