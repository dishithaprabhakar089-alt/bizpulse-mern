import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import OverviewCards from './components/OverviewCards';
import RecentTransactionsCard from './components/RecentTransactionsCard';
import QuickBreakdownCard from './components/QuickBreakdownCard';
import TransactionsTable from './components/TransactionsTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import PaymentMethodsCard from './components/PaymentMethodsCard';
import ExpensesCategoriesCard from './components/ExpensesCategoriesCard';
import AddSaleModal from './components/AddSaleModal';
import AddExpenseModal from './components/AddExpenseModal';
import ReceiptModal from './components/ReceiptModal';
import { api } from './services/api';
import { 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bizpulse_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      parsed.name = 'Store Owner';
      localStorage.setItem('bizpulse_user', JSON.stringify(parsed));
      return parsed;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('bizpulse_token') || '');

  // Active Navigation Tab: 'overview' | 'transactions' | 'analytics'
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Data State
  const [summaryData, setSummaryData] = useState({
    summary: {
      totalSales: 0,
      salesCount: 0,
      totalExpenses: 0,
      expensesCount: 0,
      netProfitOrLoss: 0,
      status: 'breakeven',
      profitMargin: 0
    },
    salesByMethod: {},
    expensesByCategory: {},
    recentTransactions: [],
    trend: []
  });

  const [timeRange, setTimeRange] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (user, jwtToken) => {
    const cleanUser = {
      ...user,
      name: 'Store Owner'
    };
    setCurrentUser(cleanUser);
    setToken(jwtToken);
    localStorage.setItem('bizpulse_user', JSON.stringify(cleanUser));
    localStorage.setItem('bizpulse_token', jwtToken);
    showToast(`Welcome! Logged in as Store Owner`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('bizpulse_user');
    localStorage.removeItem('bizpulse_token');
    showToast('Signed out successfully', 'success');
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSummary(timeRange);
      if (res.success && res.data) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      showToast('Could not fetch data. Please ensure backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [timeRange, currentUser]);

  const handleSaleCreated = async (saleData) => {
    try {
      const res = await api.createSale(saleData);
      showToast(`Sale of ₹${saleData.amount.toLocaleString('en-IN')} added to Total Sales!`, 'success');
      await loadDashboardData();
      return res;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleExpenseCreated = async (expenseData) => {
    try {
      const res = await api.createExpense(expenseData);
      showToast(`Expense of ₹${expenseData.amount.toLocaleString('en-IN')} recorded!`, 'success');
      await loadDashboardData();
      return res;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteTransaction = async (tx) => {
    if (!window.confirm(`Are you sure you want to delete this ${tx.type === 'SALE' ? 'Sale' : 'Expense'} of ₹${tx.amount.toLocaleString('en-IN')}?`)) {
      return;
    }

    try {
      if (tx.type === 'SALE') {
        await api.deleteSale(tx._id);
        showToast('Sale deleted from database', 'success');
      } else {
        await api.deleteExpense(tx._id);
        showToast('Expense deleted from database', 'success');
      }
      await loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSeedData = async () => {
    try {
      setIsLoading(true);
      await api.seedDemo();
      showToast('Sample store sales & expenses seeded successfully!', 'success');
      await loadDashboardData();
    } catch (err) {
      showToast('Failed to seed demo data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to clear ALL sales and expenses? This will reset your store to zero.')) {
      return;
    }

    try {
      setIsLoading(true);
      await api.resetData();
      showToast('All transaction records cleared.', 'success');
      await loadDashboardData();
    } catch (err) {
      showToast('Failed to reset store', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, render Login Page
  if (!currentUser) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white border ${
                toastMessage.type === 'error'
                  ? 'bg-rose-600 border-rose-500'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-200" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>{toastMessage.message}</span>
            </div>
          </div>
        )}
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const summary = summaryData.summary || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white border ${
              toastMessage.type === 'error'
                ? 'bg-rose-600 border-rose-500'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-200" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar with Tab Switcher */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenSaleModal={() => setIsSaleModalOpen(true)}
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW                                */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter Bar & Quick Tools */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Time Period:
                </span>
                <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: 'This Week' },
                    { id: 'month', label: 'This Month' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTimeRange(tab.id)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        timeRange === tab.id
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedData}
                  disabled={isLoading}
                  title="Fill with realistic sample data"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load Sample Data</span>
                </button>

                <button
                  onClick={handleResetData}
                  disabled={isLoading}
                  title="Clear all records"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  title="Refresh from MongoDB"
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* ⭐ THE 3 PRIMARY CARDS: SALES, EXPENSES, AND NET PROFIT/LOSS ⭐ */}
            <OverviewCards
              summary={summary}
              salesByMethod={summaryData.salesByMethod}
              expensesByCategory={summaryData.expensesByCategory}
            />

            {/* 2-Column Split: Recent Activity + Quick Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactionsCard
                transactions={summaryData.recentTransactions}
                onViewAll={() => setActiveTab('transactions')}
                onViewReceipt={(tx) => setActiveReceipt(tx)}
                onOpenSaleModal={() => setIsSaleModalOpen(true)}
              />

              <QuickBreakdownCard
                salesByMethod={summaryData.salesByMethod}
                expensesByCategory={summaryData.expensesByCategory}
                totalSales={summary.totalSales}
                totalExpenses={summary.totalExpenses}
                onViewAnalytics={() => setActiveTab('analytics')}
              />
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TRANSACTIONS LEDGER                               */}
        {/* ======================================================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TransactionsTable
              transactions={summaryData.recentTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onViewReceipt={(tx) => setActiveReceipt(tx)}
              onOpenSaleModal={() => setIsSaleModalOpen(true)}
              onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INSIGHTS & CHARTS                                 */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AnalyticsCharts trend={summaryData.trend} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PaymentMethodsCard
                salesByMethod={summaryData.salesByMethod}
                totalSales={summary.totalSales}
              />
              <ExpensesCategoriesCard
                expensesByCategory={summaryData.expensesByCategory}
                totalExpenses={summary.totalExpenses}
              />
            </div>
          </div>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="mt-auto py-5 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">BizPulse • Small Business Management System</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          MERN Stack • Automated Real-Time Sales & Expenses Net Profit Engine
        </p>
      </footer>

      {/* Add Sale Modal */}
      <AddSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSaleCreated={handleSaleCreated}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onExpenseCreated={handleExpenseCreated}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

    </div>
  );
}
