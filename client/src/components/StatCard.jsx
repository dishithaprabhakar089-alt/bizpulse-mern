import React from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function StatCard({ title, amount, subtitle, type = 'sale', icon: Icon, badge, count }) {
  const isSale = type === 'sale';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      
      {/* Accent corner glow */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 pointer-events-none ${
          isSale ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(amount)}
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
            isSale
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}
        >
          {Icon ? <Icon className="w-6 h-6" /> : isSale ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium flex items-center gap-1.5">
          {isSale ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          )}
          {count !== undefined ? `${count} ${count === 1 ? 'transaction' : 'transactions'}` : subtitle}
        </span>
        {badge && (
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
              isSale
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

    </div>
  );
}
