import React, { useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, ExternalLink, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatusModal({ status, errorMsg, txHash, onClose }) {
  useEffect(() => {
    if (status === 'success') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [status]);

  if (status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card max-w-sm w-full rounded-3xl p-6 relative overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
        
        {status !== 'loading' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-100">İşlem Gönderiliyor</h3>
            <p className="text-xs text-slate-400 text-center mt-2 px-4">
              Freighter cüzdanınızdan gelen onay isteğini kabul edin. İşlem Stellar testnet ağına iletiliyor...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Bahşiş Gönderildi!</h3>
            <p className="text-sm text-slate-400 mt-1">İşleminiz başarıyla tamamlandı.</p>
            
            {txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/5 transition-colors text-cyan-400 hover:text-cyan-300"
              >
                StellarExpert'te Görüntüle
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="bg-rose-500/10 p-3 rounded-full text-rose-400 mb-4">
              <XCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">İşlem Başarısız</h3>
            <div className="bg-rose-950/20 text-rose-300/80 border border-rose-500/10 rounded-xl p-3 text-xs w-full text-left mt-3 overflow-y-auto max-h-24 font-mono break-all">
              {errorMsg || 'Bilinmeyen bir hata oluştu.'}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl border border-white/5 transition-colors mt-5 text-sm"
            >
              Kapat
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
