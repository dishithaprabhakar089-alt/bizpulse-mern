import React, { useState } from 'react';
import { X, Package, Building2, Zap, Users, MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, onExpenseCreated }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Stock');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'Stock', label: 'Stock / Inventory', icon: Package, defaultTitle: 'Stock Wholesale Purchase' },
    { id: 'Shop Rent', label: 'Shop Rent', icon: Building2, defaultTitle: 'Monthly Shop Rent' },
    { id: 'Electricity Bills', label: 'Electricity Bills', icon: Zap, defaultTitle: 'Commercial Electricity Bill' },
    { id: 'Staff Salaries', label: 'Staff Salaries', icon: Users, defaultTitle: 'Staff Salary Payment' },
    { id: 'Supplies', label: 'Supplies & Packaging', icon: MoreHorizontal, defaultTitle: 'Shop Supplies & Packing' },
    { id: 'Maintenance', label: 'Maintenance & Repairs', icon: MoreHorizontal, defaultTitle: 'Store Maintenance' },
    { id: 'Other', label: 'Other Outlay', icon: MoreHorizontal, defaultTitle: 'Miscellaneous Expense' }
  ];

  const handleSelectCategory = (cat) => {
    setCategory(cat.id);
    if (!title || categories.some(c => c.defaultTitle === title)) {
      setTitle(cat.defaultTitle);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid expense amount greater than ₹0');
      return;
    }

    if (!title.trim()) {
      setError('Please provide an expense title or description');
      return;
    }

    setIsSubmitting(true);
    try {
      await onExpenseCreated({
        amount: numericAmount,
        category,
        title: title.trim(),
        recipient: recipient.trim(),
        paymentMethod,
        notes: notes.trim()
      });
      // Reset form
      setAmount('');
      setTitle('');
      setRecipient('');
      setNotes('');
      setCategory('Stock');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 to-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Record Expense (Money Out)</h3>
              <p className="text-xs text-rose-100">Deducts immediately from Net Profit / Loss</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Expense Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-rose-500 focus:outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Quick Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Expense Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.slice(0, 4).map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/70 text-rose-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`} />
                    <span className="text-xs text-center">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Other categories dropdown/chips */}
            <div className="flex gap-2 mt-2">
              {categories.slice(4).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Expense Description / Purpose *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. October Rent / Wholesale Cotton Stock / EB Bill"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Paid To & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Paid To (Recipient / Vendor)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Landlord, Wholesaler, TNEB"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none cursor-pointer"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (IMPS / RTGS)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Notes / Receipt Reference (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bill #890, paid on behalf of shop"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-[0.99] rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Expense...' : `Record Expense (₹${amount || '0'})`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
