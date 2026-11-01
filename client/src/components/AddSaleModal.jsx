import React, { useState } from 'react';
import { X, Plus, Trash2, Smartphone, Banknote, CreditCard, Check, ArrowDownLeft } from 'lucide-react';

export default function AddSaleModal({ isOpen, onClose, onSaleCreated }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiApp, setUpiApp] = useState('GPay');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || Number(itemPrice) <= 0) return;

    const newItem = {
      name: itemName.trim(),
      quantity: Number(itemQty) || 1,
      price: Number(itemPrice)
    };

    const newItems = [...items, newItem];
    setItems(newItems);

    // Auto update total amount if items are used
    const totalItemsAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setAmount(totalItemsAmount.toString());

    setItemName('');
    setItemPrice('');
    setItemQty(1);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (updated.length > 0) {
      const totalItemsAmount = updated.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setAmount(totalItemsAmount.toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid sale amount greater than ₹0');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaleCreated({
        amount: numericAmount,
        paymentMethod,
        upiApp: paymentMethod === 'UPI' ? upiApp : 'N/A',
        customerName: customerName.trim() || 'Walk-in Customer',
        customerPhone: customerPhone.trim(),
        notes: notes.trim(),
        items
      });
      // Reset form
      setAmount('');
      setCustomerName('');
      setCustomerPhone('');
      setNotes('');
      setItems([]);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Record Sale (Money In)</h3>
              <p className="text-xs text-emerald-100">Adds immediately to Total Sales & Net Profit</p>
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
              Sale Amount (₹) *
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
                className="w-full pl-10 pr-4 py-3 text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs">Cash</span>
              </button>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1 text-indigo-600" />
                <span className="text-xs">UPI</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-800 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-xs">Card</span>
              </button>
            </div>

            {/* UPI App Sub-selector */}
            {paymentMethod === 'UPI' && (
              <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-900">UPI App:</span>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Other'].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiApp(app)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      upiApp === app
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-white text-slate-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Itemized Billing */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Item Details (Optional)
            </span>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item / Product Name"
                className="flex-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                min="1"
                value={itemQty}
                onChange={(e) => setItemQty(e.target.value)}
                placeholder="Qty"
                className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-center"
              />
              <input
                type="number"
                step="any"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="₹ Price"
                className="w-20 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
              >
                Add
              </button>
            </div>

            {items.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-800">{it.name} (x{it.quantity})</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">₹{it.price * it.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Notes / Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Counter discount, regular client"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Sale...' : `Add Sale (₹${amount || '0'})`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
