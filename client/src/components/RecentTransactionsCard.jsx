import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Eye, Receipt } from 'lucide-react';

export default function RecentTransactionsCard({ transactions = [], onViewAll, onViewReceipt, onOpenSaleModal }) {
  const recent = transactions.slice(0, 5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Recent Activity</h3>
            <p className="text-xs text-slate-500">Latest 5 sales and expenses</p>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium">No transactions recorded yet.</p>
            <button
              onClick={onOpenSaleModal}
              className="mt-3 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
            >
              + Record First Sale
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {recent.map((tx) => {
              const isSale = tx.type === 'SALE';
              return (
                <div key={tx._id} className="py-2.5 flex items-center justify-between group hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSale ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isSale ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black ${isSale ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isSale ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => onViewReceipt(tx)}
                      title="View Slip"
                      className="p-1 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Click receipt icon to view printable vouchers</span>
        <span className="font-semibold text-slate-500">{transactions.length} total entries</span>
      </div>
    </div>
  );
}
