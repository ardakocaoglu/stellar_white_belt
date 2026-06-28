import React, { useState } from 'react';
import { Droplet, Loader2 } from 'lucide-react';
import { fundWithFriendbot } from '../utils/stellar';

export default function FaucetTrigger({ address, onFunded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFund = async () => {
    setLoading(true);
    setError('');
    try {
      await fundWithFriendbot(address);
      onFunded();
    } catch (err) {
      setError('Friendbot üzerinden fon yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border-cyan-500/20 max-w-md w-full flex items-center justify-between gap-4 mt-6">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Testnet Bakiye Yükleyici</span>
        <span className="text-xs text-slate-400 mt-1">Hesabınızda XLM bulunmuyor. Testnet musluğundan 10,000 XLM talep edebilirsiniz.</span>
        {error && <span className="text-xs text-rose-400 mt-1 font-medium">{error}</span>}
      </div>
      <button
        onClick={handleFund}
        disabled={loading}
        className="flex items-center gap-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 font-semibold px-4 py-2.5 rounded-xl border border-cyan-500/30 transition-all disabled:opacity-50 shrink-0 text-xs"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Droplet className="w-4 h-4" />
        )}
        {loading ? 'Yükleniyor' : 'XLM İste'}
      </button>
    </div>
  );
}
