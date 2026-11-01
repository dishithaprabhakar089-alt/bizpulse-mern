import React from 'react';
import { Package, Building2, Zap, Users, MoreHorizontal, ArrowDownRight } from 'lucide-react';

export default function ExpensesCategoriesCard({ expensesByCategory, totalExpenses = 0 }) {
  const categories = [
    {
      id: 'Stock',
      label: 'Stock / Inventory',
      icon: Package,
      amount: expensesByCategory?.Stock || 0,
      color: 'bg-amber-500',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      id: 'Shop Rent',
      label: 'Shop Rent',
      icon: Building2,
      amount: expensesByCategory?.['Shop Rent'] || 0,
      color: 'bg-violet-500',
      badgeColor: 'text-violet-700 bg-violet-50 border-violet-200'
    },
    {
      id: 'Electricity Bills',
      label: 'Electricity Bills',
      icon: Zap,
      amount: expensesByCategory?.['Electricity Bills'] || 0,
      color: 'bg-orange-500',
      badgeColor: 'text-orange-700 bg-orange-50 border-orange-200'
    },
    {
      id: 'Staff Salaries',
      label: 'Staff Salaries',
      icon: Users,
      amount: expensesByCategory?.['Staff Salaries'] || 0,
      color: 'bg-rose-500',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      id: 'Other',
      label: 'Supplies & Other',
      icon: MoreHorizontal,
      amount: (expensesByCategory?.Other || 0) + (expensesByCategory?.Supplies || 0) + (expensesByCategory?.Maintenance || 0) + (expensesByCategory?.Marketing || 0),
      color: 'bg-slate-500',
      badgeColor: 'text-slate-700 bg-slate-50 border-slate-200'
    }
  ];

  const getPercentage = (amt) => {
    if (!totalExpenses || totalExpenses === 0) return 0;
    return Math.round((amt / totalExpenses) * 100);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Expenses by Category</h3>
          <p className="text-xs text-slate-500">Tracking stock, rent, electricity & payroll outlays</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Money Out Categories
        </span>
      </div>

      <div className="mt-5 space-y-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = getPercentage(cat.amount);
          return (
            <div key={cat.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-md text-white ${cat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-slate-700">{cat.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(cat.amount)}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5 font-mono">({pct}%)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
