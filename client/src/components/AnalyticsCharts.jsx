import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnalyticsCharts({ trend = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const maxVal = Math.max(
    ...trend.map(t => Math.max(t.sales || 0, t.expenses || 0)),
    1000
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base">7-Day Revenue & Expense Flow</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Live Trend
            </span>
          </div>
          <p className="text-xs text-slate-500">Compare daily customer receipts vs store outlays</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
            <span className="text-slate-600">Sales (Money In)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
            <span className="text-slate-600">Expenses (Money Out)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mt-6 pt-2">
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 px-2">
          {trend.map((item, idx) => {
            const salesHeight = Math.max(4, Math.round(((item.sales || 0) / maxVal) * 190));
            const expensesHeight = Math.max(4, Math.round(((item.expenses || 0) / maxVal) * 190));
            const dayProfit = (item.sales || 0) - (item.expenses || 0);

            return (
              <div
                key={item.date || idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
              >
                {/* Tooltip */}
                {hoveredIdx === idx && (
                  <div className="absolute -top-20 z-30 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs min-w-[130px] border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-none">
                    <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-[11px] text-slate-300">
                      {item.date}
                    </p>
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>In:</span>
                        <span>{formatCurrency(item.sales)}</span>
                      </div>
                      <div className="flex justify-between text-rose-400 font-semibold">
                        <span>Out:</span>
                        <span>{formatCurrency(item.expenses)}</span>
                      </div>
                      <div className={`flex justify-between pt-1 border-t border-slate-800 font-bold ${dayProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        <span>Net:</span>
                        <span>{dayProfit >= 0 ? '+' : ''}{formatCurrency(dayProfit)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-[200px]">
                  {/* Sales Bar */}
                  <div
                    className="w-1/2 max-w-[24px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                    style={{ height: `${salesHeight}px` }}
                  />
                  {/* Expenses Bar */}
                  <div
                    className="w-1/2 max-w-[24px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                    style={{ height: `${expensesHeight}px` }}
                  />
                </div>

                {/* Date Label */}
                <span className="mt-3 text-[11px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors truncate">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
