import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, Layers, FileText, CheckCircle2 } from 'lucide-react';

export default function CompassTab() {
  const [copied, setCopied] = useState(false);
  const connectionUri = 'mongodb://localhost:27017';
  const dbName = 'small_business_db';

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const collections = [
    {
      name: 'sales',
      description: 'Records every Money In transaction with payment channels',
      fields: ['invoiceNumber', 'amount', 'paymentMethod (Cash / UPI / Card)', 'upiApp (GPay / PhonePe)', 'items', 'customerName', 'date']
    },
    {
      name: 'expenses',
      description: 'Records every Money Out operational outlay',
      fields: ['title', 'category (Stock, Rent, EB, Salaries)', 'amount', 'paymentMethod', 'recipient', 'receiptNumber', 'date']
    },
    {
      name: 'users',
      description: 'Stores business owner profiles and bcrypt password hashes',
      fields: ['name', 'email', 'password (bcrypt salt hash)', 'shopName', 'phone', 'createdAt']
    }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            MongoDB Compass Direct Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Inspect Database Collections
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Every transaction added in BizPulse synchronizes immediately to your local MongoDB server under database <span className="font-mono text-emerald-400 font-bold">{dbName}</span>.
          </p>

          {/* Connection URI Box */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                MongoDB Compass Connection String:
              </span>
              <code className="text-sm font-mono text-emerald-400 font-bold">
                {connectionUri}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/30 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Compass URI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Guide for Teacher/Evaluator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-1">
          4 Simple Steps to View Data in MongoDB Compass
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Follow these instructions to verify real-time database persistence
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-black text-indigo-600 uppercase">Step 1</span>
            <h4 className="font-bold text-slate-800 text-sm mt-1">Open MongoDB Compass</h4>
            <p className="text-xs text-slate-500 mt-1">Launch the MongoDB Compass desktop application on your PC.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-black text-indigo-600 uppercase">Step 2</span>
            <h4 className="font-bold text-slate-800 text-sm mt-1">Paste URI & Connect</h4>
            <p className="text-xs text-slate-500 mt-1">Paste <code className="text-[11px] font-mono bg-white px-1 py-0.5 rounded border border-slate-200">mongodb://localhost:27017</code> and click Connect.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-black text-indigo-600 uppercase">Step 3</span>
            <h4 className="font-bold text-slate-800 text-sm mt-1">Open small_business_db</h4>
            <p className="text-xs text-slate-500 mt-1">Click on the <strong className="text-slate-800">small_business_db</strong> database in the sidebar.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-black text-indigo-600 uppercase">Step 4</span>
            <h4 className="font-bold text-slate-800 text-sm mt-1">Inspect Collections</h4>
            <p className="text-xs text-slate-500 mt-1">Browse documents in <code className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">sales</code> and <code className="text-[11px] font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded">expenses</code>!</p>
          </div>
        </div>
      </div>

      {/* Database Schema Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-1">
          Database Collections & Mongoose Schemas
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Active collections stored inside MongoDB
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div key={col.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="font-mono font-bold text-slate-900 text-sm">{col.name}</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{col.description}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Schema Fields:
                </span>
                <ul className="space-y-1">
                  {col.fields.map((f, i) => (
                    <li key={i} className="text-[11px] font-mono text-slate-700 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
