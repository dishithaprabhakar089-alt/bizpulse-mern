import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function CompassGuideCard() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const connectionUri = 'mongodb://localhost:27017/small_business_db';

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">MongoDB Compass Integration</h4>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Database: <span className="font-mono text-emerald-400 font-semibold">small_business_db</span> • Collections: <span className="font-mono text-slate-300">sales</span>, <span className="font-mono text-slate-300">expenses</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy URI Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied URI!' : 'Copy Compass URI'}</span>
          </button>

          {/* How to link toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
          >
            <span>Compass Guide</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Step-by-Step Guide */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3 animate-in fade-in">
          <p className="text-slate-300 font-medium">
            Follow these 4 simple steps to visualize live sales and expenses inside <strong>MongoDB Compass</strong>:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
              <span className="font-black text-emerald-400 text-xs">STEP 1</span>
              <p className="mt-1 text-slate-300 text-[11px]">
                Launch <strong>MongoDB Compass</strong> application on your PC.
              </p>
            </div>
            
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
              <span className="font-black text-emerald-400 text-xs">STEP 2</span>
              <p className="mt-1 text-slate-300 text-[11px]">
                In the <strong>New Connection</strong> box, paste:
              </p>
              <code className="text-[10px] text-emerald-300 block font-mono bg-slate-900 p-1 rounded mt-1 overflow-x-auto">
                mongodb://localhost:27017
              </code>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
              <span className="font-black text-emerald-400 text-xs">STEP 3</span>
              <p className="mt-1 text-slate-300 text-[11px]">
                Click the green <strong>"Connect"</strong> button.
              </p>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/60">
              <span className="font-black text-emerald-400 text-xs">STEP 4</span>
              <p className="mt-1 text-slate-300 text-[11px]">
                Click <code className="text-emerald-300 font-bold">small_business_db</code> to view <code className="text-white font-semibold">sales</code> and <code className="text-white font-semibold">expenses</code>!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
