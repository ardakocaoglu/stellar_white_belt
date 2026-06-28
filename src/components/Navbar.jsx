import React from 'react';
import { Wallet, LogOut, Coins, Languages } from 'lucide-react';

export default function Navbar({ address, balance, onConnect, onDisconnect, isConnecting, lang, setLang, t }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400">
          <Coins className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {t.navbar.title}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
          className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 border border-white/10 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          title={lang === 'en' ? 'Türkçe\'ye geç' : 'Switch to English'}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'TR' : 'EN'}</span>
        </button>

        {address ? (
          <>
            <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">{t.navbar.balance}:</span>
              <span className="font-semibold text-cyan-400">{balance} XLM</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-sm font-medium text-slate-200">{formatAddress(address)}</span>
              <button 
                onClick={onDisconnect}
                className="text-slate-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                title={t.navbar.disconnect}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? t.navbar.connecting : t.navbar.connect}
          </button>
        )}
      </div>
    </nav>
  );
}

