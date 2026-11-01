import React from 'react';
import { X, Printer, Store, CheckCircle, ArrowDownLeft, ArrowUpRight, Share2 } from 'lucide-react';

export default function ReceiptModal({ transaction, onClose }) {
  if (!transaction) return null;

  const isSale = transaction.type === 'SALE';
  const raw = transaction.raw || {};

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Modal Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            {isSale ? 'Customer Sales Slip' : 'Expense Payment Voucher'}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 bg-white space-y-4">
          
          {/* Shop Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">BIZPULSE STORE</h2>
            <p className="text-xs text-slate-500">Retail & Commercial Store Billing</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Ref: {transaction.reference || (isSale ? raw.invoiceNumber : raw.receiptNumber)}
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="text-xs space-y-1.5 py-1 text-slate-600">
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-semibold text-slate-900">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className={`font-bold ${isSale ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isSale ? 'MONEY IN (SALE)' : 'MONEY OUT (EXPENSE)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold text-slate-900">
                {transaction.paymentMethod} {raw.upiApp && raw.upiApp !== 'N/A' ? `(${raw.upiApp})` : ''}
              </span>
            </div>
            {isSale && raw.customerName && (
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{raw.customerName}</span>
              </div>
            )}
            {!isSale && raw.recipient && (
              <div className="flex justify-between">
                <span>Paid To:</span>
                <span className="font-semibold text-slate-900">{raw.recipient}</span>
              </div>
            )}
          </div>

          {/* Items if available */}
          {isSale && raw.items && raw.items.length > 0 && (
            <div className="pt-2 border-t border-dashed border-slate-300">
              <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">
                Items Purchased
              </span>
              <div className="space-y-1">
                {raw.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-700">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expense Category if expense */}
          {!isSale && (
            <div className="pt-2 border-t border-dashed border-slate-300">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Expense Category:</span>
                <span className="font-bold text-slate-800">{raw.category}</span>
              </div>
            </div>
          )}

          {/* Total Box */}
          <div className="pt-3 border-t-2 border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-extrabold uppercase text-slate-900">Total Amount:</span>
            <span className={`text-2xl font-black ${isSale ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          {/* Notes */}
          {raw.notes && (
            <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
              Note: {raw.notes}
            </div>
          )}

          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              *** Thank You for Shopping with Us ***
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
