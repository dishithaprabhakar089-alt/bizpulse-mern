import React from 'react';
import { ChevronRight, Smartphone, Banknote, CreditCard, Building2, Package, Zap, Users } from 'lucide-react';

export default function QuickBreakdownCard({ salesByMethod, expensesByCategory, totalSales = 0, totalExpenses = 0, onViewAnalytics }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getSalePct = (amt) => totalSales > 0 ? Math.round((amt / totalSales) * 100) : 0;
  const getExpPct = (amt) => totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Cashflow Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution by payment modes & spending</p>
          </div>
          <button
            onClick={onViewAnalytics}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Charts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          
          {/* Sales Channels */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              Sales by Channel
            </span>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-indigo-500" /> UPI
                  </span>
                  <span className="font-bold text-slate-800">{formatCurrency(salesByMethod?.UPI?.amount)} ({getSalePct(salesByMethod?.UPI?.amount)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${getSalePct(salesByMethod?.UPI?.amount)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-emerald-500" /> Cash
                  </span>
                  <span className="font-bold text-slate-800">{formatCurrency(salesByMethod?.Cash?.amount)} ({getSalePct(salesByMethod?.Cash?.amount)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${getSalePct(salesByMethod?.Cash?.amount)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-blue-500" /> Card
                  </span>
                  <span className="font-bold text-slate-800">{formatCurrency(salesByMethod?.Card?.amount)} ({getSalePct(salesByMethod?.Card?.amount)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${getSalePct(salesByMethod?.Card?.amount)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-2">
              Major Expense Categories
            </span>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-violet-500" /> Shop Rent
                  </span>
                  <span className="font-bold text-slate-800">{formatCurrency(expensesByCategory?.['Shop Rent'])} ({getExpPct(expensesByCategory?.['Shop Rent'])}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full" style={{ width: `${getExpPct(expensesByCategory?.['Shop Rent'])}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3 text-amber-500" /> Stock Purchase
                  </span>
                  <span className="font-bold text-slate-800">{formatCurrency(expensesByCategory?.Stock)} ({getExpPct(expensesByCategory?.Stock)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${getExpPct(expensesByCategory?.Stock)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange-500" /> Electricity & Wages
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency((expensesByCategory?.['Electricity Bills'] || 0) + (expensesByCategory?.['Staff Salaries'] || 0))}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${getExpPct((expensesByCategory?.['Electricity Bills'] || 0) + (expensesByCategory?.['Staff Salaries'] || 0))}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
        Aggregated automatically from all transaction records
      </div>
    </div>
  );
}
