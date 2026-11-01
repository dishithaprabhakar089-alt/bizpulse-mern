import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Receipt, 
  Trash2, 
  Filter, 
  Eye, 
  Calendar,
  Smartphone,
  Banknote,
  CreditCard
} from 'lucide-react';

export default function TransactionsTable({ 
  transactions = [], 
  onDeleteTransaction, 
  onViewReceipt,
  onOpenSaleModal,
  onOpenExpenseModal
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'SALE' | 'EXPENSE'
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'ALL' && tx.type !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (tx.title || '').toLowerCase().includes(q);
      const matchSub = (tx.subtitle || '').toLowerCase().includes(q);
      const matchRef = (tx.reference || '').toLowerCase().includes(q);
      const matchMethod = (tx.paymentMethod || '').toLowerCase().includes(q);
      const matchDetail = (tx.detailBadge || '').toLowerCase().includes(q);
      return matchTitle || matchSub || matchRef || matchMethod || matchDetail;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Transaction Ledger</h3>
          <p className="text-xs text-slate-500">Live record of every single sale & expense entry</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, items..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('SALE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'SALE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Sales</span>
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterType === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Expenses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Body */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-700 text-sm">No transactions found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No transactions matched "${searchQuery}". Try clearing search filter.`
              : 'Record your first sale (Money In) or an expense (Money Out) to begin tracking your net profit.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={onOpenSaleModal}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              + Add First Sale
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              - Record Expense
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="py-3 px-4">Type & Details</th>
                <th className="py-3 px-4">Contact / Recipient</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map((tx) => {
                const isSale = tx.type === 'SALE';
                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Type & Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSale
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isSale ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {tx.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400">
                              {tx.reference}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                                isSale
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {tx.detailBadge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact / Recipient */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {tx.subtitle || '—'}
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        {tx.paymentMethod === 'Cash' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        {tx.paymentMethod === 'UPI' && <Smartphone className="w-3.5 h-3.5 text-indigo-600" />}
                        {tx.paymentMethod === 'Card' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{tx.paymentMethod}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {formatDate(tx.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-sm font-black ${
                          isSale ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isSale ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onViewReceipt(tx)}
                          title="View & Print Receipt"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx)}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
