import React from 'react';
import { Banknote, Smartphone, CreditCard, ChevronRight, Zap } from 'lucide-react';

export default function PaymentMethodsCard({ salesByMethod, totalSales = 0 }) {
  const cashAmount = salesByMethod?.Cash?.amount || 0;
  const cashCount = salesByMethod?.Cash?.count || 0;

  const upiAmount = salesByMethod?.UPI?.amount || 0;
  const upiCount = salesByMethod?.UPI?.count || 0;
  const gpay = salesByMethod?.UPI?.gpay || 0;
  const phonepe = salesByMethod?.UPI?.phonepe || 0;
  const paytm = salesByMethod?.UPI?.paytm || 0;

  const cardAmount = salesByMethod?.Card?.amount || 0;
  const cardCount = salesByMethod?.Card?.count || 0;

  const getPercentage = (amt) => {
    if (!totalSales || totalSales === 0) return 0;
    return Math.round((amt / totalSales) * 100);
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
          <h3 className="font-bold text-slate-800 text-base">Sales by Payment Mode</h3>
          <p className="text-xs text-slate-500">Every sale automatically groups by payment channel</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Money In Channels
        </span>
      </div>

      <div className="mt-5 space-y-4">
        
        {/* UPI Row (GPay / PhonePe / Paytm) */}
        <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm">UPI Payments</span>
                <span className="text-[11px] text-slate-500 block">
                  {upiCount} {upiCount === 1 ? 'sale' : 'sales'} • {getPercentage(upiAmount)}% of total
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-slate-900 text-base">{formatCurrency(upiAmount)}</span>
            </div>
          </div>

          {/* Sub-app breakdown badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              GPay: {formatCurrency(gpay)}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              PhonePe: {formatCurrency(phonepe)}
            </span>
            {paytm > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                Paytm: {formatCurrency(paytm)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(upiAmount)}%` }}
            />
          </div>
        </div>

        {/* Cash Row */}
        <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm">Cash at Counter</span>
                <span className="text-[11px] text-slate-500 block">
                  {cashCount} {cashCount === 1 ? 'sale' : 'sales'} • {getPercentage(cashAmount)}% of total
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-slate-900 text-base">{formatCurrency(cashAmount)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(cashAmount)}%` }}
            />
          </div>
        </div>

        {/* Card Row */}
        <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm">Credit / Debit Card</span>
                <span className="text-[11px] text-slate-500 block">
                  {cardCount} {cardCount === 1 ? 'sale' : 'sales'} • {getPercentage(cardAmount)}% of total
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-slate-900 text-base">{formatCurrency(cardAmount)}</span>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(cardAmount)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
