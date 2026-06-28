import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

export default function TipCard({ recipientAddress, isAddressLocked, onSubmitTip, isConnected }) {
  const [amount, setAmount] = useState('');
  const [customAddress, setCustomAddress] = useState(recipientAddress || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (recipientAddress) {
      setCustomAddress(recipientAddress);
    }
  }, [recipientAddress]);

  const presetAmounts = [5, 10, 20];

  const handleCopy = () => {
    if (!customAddress) return;
    navigator.clipboard.writeText(customAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customAddress || !amount || parseFloat(amount) <= 0) return;
    onSubmitTip(amount, customAddress);
  };

  return (
    <div className="glass-card rounded-3xl p-8 max-w-md w-full relative overflow-hidden neon-glow-cyan">
      <div className="absolute top-0 right-0 bg-cyan-500/10 w-24 h-24 rounded-bl-full flex items-center justify-center text-cyan-400">
        <ArrowUpRight className="w-8 h-8 -mr-4 -mt-4" />
      </div>

      <div className="flex flex-col items-center mb-6">
        <img
          src={`https://robohash.org/${customAddress || 'default'}.png?size=100x100`}
          alt="Alıcı Avatarı"
          className="w-24 h-24 bg-slate-800 rounded-full border-2 border-cyan-400/30 p-1 mb-4 shadow-inner"
        />
        <h2 className="text-2xl font-bold text-slate-100">
          {isAddressLocked ? 'Kişisel Bahşiş Kutusu' : 'Bahşiş Gönder'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Stellar Testnet</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Alıcı Cüzdan Adresi
          </label>
          <div className="relative">
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              disabled={isAddressLocked}
              placeholder="G... ile başlayan Stellar Adresi"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-75 disabled:cursor-not-allowed pr-10"
              required
            />
            {customAddress && (
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-3 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Bahşiş Miktarı (XLM)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="any"
            min="0.0000001"
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-400 transition-colors text-cyan-300"
            required
          />
        </div>

        <div className="flex gap-3">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt.toString())}
              className="flex-1 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              {amt} XLM
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isConnected}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-cyan-500/10 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isConnected ? 'Bahşişi Gönder' : 'Cüzdan Bağlantısı Gerekli'}
        </button>
      </form>

      {customAddress && (
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">QR Kodu ile Tara</span>
          <div className="bg-white p-2.5 rounded-2xl shadow-md">
            <QRCodeSVG value={customAddress} size={110} />
          </div>
        </div>
      )}
    </div>
  );
}
