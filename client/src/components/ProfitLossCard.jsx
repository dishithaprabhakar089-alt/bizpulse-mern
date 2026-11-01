import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  Scale, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfitLossCard({ summary }) {
  const { totalSales = 0, totalExpenses = 0, netProfitOrLoss = 0, status = 'breakeven', profitMargin = 0 } = summary || {};

  const isProfit = status === 'profit';
  const isLoss = status === 'loss';
  const isBreakEven = status === 'breakeven';

  // Fire confetti celebration when profit is clicked or achieved
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (isProfit && totalSales > 0) {
      // Gentle celebratory burst
      triggerConfetti();
    }
  }, [isProfit, netProfitOrLoss]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(val));
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white transition-all duration-500 shadow-xl ${
        isProfit
          ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 profit-glow border-2 border-emerald-400/40'
          : isLoss
          ? 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 loss-glow border-2 border-rose-400/40'
          : 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-600/40'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Headline & Dynamic Badge */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold opacity-80">
              Real-time Business Health
            </span>
            
            {/* Dynamic Status Pill */}
            {isProfit && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950/40 text-emerald-100 border border-emerald-300/40 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                NET PROFIT (TURNS GREEN)
              </span>
            )}
            
            {isLoss && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-950/40 text-rose-100 border border-rose-300/40 backdrop-blur-sm animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />
                NET LOSS (TURNS RED)
              </span>
            )}

            {isBreakEven && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-900/40 text-slate-200 border border-slate-500/40 backdrop-blur-sm">
                <Scale className="w-3.5 h-3.5 text-slate-300" />
                BREAK-EVEN (BALANCED)
              </span>
            )}
          </div>

          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center gap-2">
              {isProfit && '+'}
              {isLoss && '-'}
              {formatCurrency(netProfitOrLoss)}
            </h2>
            <p className="mt-1 text-sm sm:text-base font-medium opacity-90">
              {isProfit && '🌟 High Performance! Your total sales comfortably surpass business overheads.'}
              {isLoss && '⚠️ Caution: Total expenses exceed money collected. Track your stock and operational costs.'}
              {isBreakEven && 'Sales and Expenses are currently equal. Add more sales to turn this Green!'}
            </p>
          </div>

          {/* Mathematical Formula Display */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono bg-black/20 p-2.5 rounded-xl border border-white/10 w-fit">
            <span className="text-emerald-200 font-semibold">Sales: {formatCurrency(totalSales)}</span>
            <span className="opacity-60">-</span>
            <span className="text-rose-200 font-semibold">Expenses: {formatCurrency(totalExpenses)}</span>
            <span className="opacity-60">=</span>
            <span className="font-bold underline decoration-2">
              Net {isProfit ? 'Profit' : (isLoss ? 'Loss' : 'Zero')}: {formatCurrency(netProfitOrLoss)}
            </span>
          </div>
        </div>

        {/* Right Side: Key Metrics & Celebration Trigger */}
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-8">
          
          <div className="text-left md:text-right">
            <span className="text-xs font-medium opacity-75 block">Profit Margin</span>
            <div className="flex items-center md:justify-end gap-1 text-2xl font-black">
              {isProfit ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-200" />
              ) : isLoss ? (
                <ArrowDownRight className="w-6 h-6 text-rose-200" />
              ) : null}
              <span>{profitMargin}%</span>
            </div>
          </div>

          {isProfit && (
            <button
              onClick={triggerConfetti}
              className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-200 hover:bg-white active:scale-95 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Celebrate Profit 🎉</span>
            </button>
          )}

          <div className="text-left md:text-right text-[11px] opacity-75 font-mono">
            Auto-calculated via MERN Engine
          </div>

        </div>

      </div>
    </div>
  );
}
