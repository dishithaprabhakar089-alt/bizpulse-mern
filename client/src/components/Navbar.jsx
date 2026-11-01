import React from 'react';
import { 
  Store, 
  PlusCircle, 
  MinusCircle, 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onOpenSaleModal, 
  onOpenExpenseModal 
}) {
  const navTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions Ledger', icon: Receipt },
    { id: 'analytics', label: 'Insights & Charts', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Strip: Brand & Action Buttons */}
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  BizPulse
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                Small Business Management
              </p>
            </div>
          </div>

          {/* Quick Transaction Action Buttons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Record Expense Button */}
            <button
              onClick={onOpenExpenseModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-95 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              <MinusCircle className="w-4 h-4 text-rose-600" />
              <span>Record Expense</span>
            </button>

            {/* Record Sale Button */}
            <button
              onClick={onOpenSaleModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-emerald-600/25 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Sale (Money In)</span>
            </button>

            {/* User Profile & Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="hidden sm:inline text-xs font-bold text-slate-700">
                  Store Owner
                </span>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Strip: Clean Organized Navigation Tabs */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
