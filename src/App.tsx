import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { AddTransactionPage } from './pages/AddTransactionPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CategoriesPage from './pages/CategoriesPage'
import ProfilePage from './pages/ProfilePage'
import TransactionDetailPage from './pages/TransactionDetailPage'

function App() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddTransactionPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/transaction/:id" element={<TransactionDetailPage />} />
      </Routes>
    </div>
  )
}

export default App
