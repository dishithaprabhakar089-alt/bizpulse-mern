import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  Scale, 
  Banknote, 
  Smartphone, 
  CreditCard,
  Building2,
  Package,
  Zap,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OverviewCards({ summary, salesByMethod, expensesByCategory }) {
  const { 
    totalSales = 0, 
    salesCount = 0, 
    totalExpenses = 0, 
    expensesCount = 0, 
    netProfitOrLoss = 0, 
    status = 'breakeven', 
    profitMargin = 0 
  } = summary || {};

  const isProfit = status === 'profit';
  const isLoss = status === 'loss';
  const isBreakEven = status === 'breakeven';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(val || 0));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* CARD 1: TOTAL SALES (MONEY IN) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              Total Sales (Money In)
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {salesCount} {salesCount === 1 ? 'sale' : 'sales'}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalSales)}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Every Cash, UPI, and Card sale automatically adds up here.
            </p>
          </div>
        </div>

        {/* Channels Quick Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>UPI (GPay / PhonePe)</span>
            </span>
            <span className="font-bold text-slate-900">{formatCurrency(salesByMethod?.UPI?.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cash at Counter</span>
            </span>
            <span className="font-bold text-slate-900">{formatCurrency(salesByMethod?.Cash?.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-500" />
              <span>Card Swipes</span>
            </span>
            <span className="font-bold text-slate-900">{formatCurrency(salesByMethod?.Card?.amount)}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: TOTAL EXPENSES (MONEY OUT) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
              Total Expenses (Money Out)
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {expensesCount} {expensesCount === 1 ? 'expense' : 'expenses'}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              All outlays for stock, shop rent, electricity bills & salaries.
            </p>
          </div>
        </div>

        {/* Expenses Categories Quick Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-violet-500" />
              <span>Shop Rent</span>
            </span>
            <span className="font-bold text-slate-900">{formatCurrency(expensesByCategory?.['Shop Rent'])}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>Stock Restock</span>
            </span>
            <span className="font-bold text-slate-900">{formatCurrency(expensesByCategory?.Stock)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>Electricity & Wages</span>
            </span>
            <span className="font-bold text-slate-900">
              {formatCurrency((expensesByCategory?.['Electricity Bills'] || 0) + (expensesByCategory?.['Staff Salaries'] || 0))}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: ⭐ NET PROFIT / LOSS (DYNAMIC GREEN OR RED) ⭐ */}
      <div 
        className={`rounded-2xl p-6 shadow-md flex flex-col justify-between transition-all duration-500 text-white relative overflow-hidden ${
          isProfit 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-2 border-emerald-400 shadow-emerald-600/20' 
            : isLoss 
            ? 'bg-gradient-to-br from-rose-600 to-red-700 border-2 border-rose-400 shadow-rose-600/20' 
            : 'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600'
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-black/20 border border-white/20 backdrop-blur-xs">
              Net Profit / Loss
            </span>

            {/* Dynamic Status Badge */}
            {isProfit && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-100 border border-emerald-300/40">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                TURNS GREEN (PROFIT)
              </span>
            )}
            {isLoss && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-950/40 text-rose-100 border border-rose-300/40 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-200" />
                TURNS RED (LOSS)
              </span>
            )}
            {isBreakEven && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/20 text-slate-200">
                BREAK-EVEN
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-1">
              <span>{isProfit ? '+' : isLoss ? '-' : ''}</span>
              <span>{formatCurrency(netProfitOrLoss)}</span>
            </div>
            
            <p className="text-xs font-semibold mt-1 opacity-95">
              {isProfit && '🌟 Profit: Sales exceed expenses. Great financial health!'}
              {isLoss && '⚠️ Loss: Expenses exceed sales. Cut overheads or increase sales.'}
              {isBreakEven && 'Break-even: Total sales equal total expenses.'}
            </p>
          </div>
        </div>

        {/* Formula breakdown bar */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="p-2 rounded-xl bg-black/20 text-[11px] font-mono flex items-center justify-between">
            <span>Sales {formatCurrency(totalSales)}</span>
            <span className="opacity-60">−</span>
            <span>Expenses {formatCurrency(totalExpenses)}</span>
            <span className="opacity-60">=</span>
            <span className="font-bold underline">
              {isProfit ? '+' : isLoss ? '-' : ''}{formatCurrency(netProfitOrLoss)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-medium">
            <span className="opacity-80">Profit Margin: <strong>{profitMargin}%</strong></span>
            {isProfit && (
              <button
                type="button"
                onClick={triggerConfetti}
                className="px-2.5 py-1 text-[11px] font-bold bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg shadow-xs cursor-pointer transition-all"
              >
                🎉 Confetti
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
