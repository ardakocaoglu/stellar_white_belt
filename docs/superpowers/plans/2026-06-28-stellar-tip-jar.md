# Stellar Tip Jar (Bahşiş Kutusu) Geliştirme Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Freighter Cüzdanı ile entegre, Stellar Testnet üzerinde çalışan, alıcı adresi için dinamik QR kod üreten, bakiye sorgulayan ve testnet musluğu ile bakiye yüklenebilen premium görünümlü bir Stellar Bahşiş Kutusu dApp uygulaması geliştirmek.

**Architecture:** Modüler bileşen yapısına sahip React + Vite uygulaması. Stellar ve Freighter entegrasyonu için izole edilmiş yardımcı fonksiyonlar modülü (`stellar.js`) ve modern Tailwind CSS v4 arayüzü.

**Tech Stack:** React 18, Vite, Tailwind CSS v4, `@stellar/stellar-sdk`, `@stellar/freighter-api`, `lucide-react`, `canvas-confetti`, `qrcode.react`, `vitest`.

## Global Constraints
- Target network: Stellar Testnet (`https://horizon-testnet.stellar.org`)
- Wallet integration: Freighter Wallet Chrome Extension
- CSS framework: Tailwind CSS v4 (using CSS imports style configuration)
- Unit Testing: Vitest

---

### Task 1: Proje Kurulumu ve Bağımlılıkların Yüklenmesi

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

**Interfaces:**
- Produces: Tailwind v4 yüklü, Vite üzerinde çalışan boş bir React uygulaması.

- [ ] **Step 1: package.json Dosyasını Oluştur**
```json
{
  "name": "stellar-tip-jar",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@stellar/freighter-api": "^6.0.1",
    "@stellar/stellar-sdk": "^13.0.0",
    "canvas-confetti": "^1.9.3",
    "lucide-react": "^0.435.0",
    "qrcode.react": "^3.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0-alpha.30",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^4.0.0-alpha.30",
    "vite": "^5.4.2",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: vite.config.js Dosyasını Oluştur**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  }
});
```

- [ ] **Step 3: index.html Dosyasını Oluştur**
```html
<!doctype html>
<html lang="tr" class="h-full bg-slate-950 text-slate-100">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stellar Tip Jar - Premium Bahşiş Kutusu</title>
  </head>
  <body class="h-full">
    <div id="root" class="h-full"></div>
  </body>
</html>
```

- [ ] **Step 4: src/index.css Dosyasını Oluştur**
```css
@import "tailwindcss";

@layer utilities {
  .glass-card {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .neon-glow-cyan {
    box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
  }
  .neon-glow-purple {
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.15);
  }
}
```

- [ ] **Step 5: src/main.jsx ve src/App.jsx Dosyalarını Oluştur**
```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```javascript
// src/App.jsx
import React from 'react';

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <h1 className="text-4xl font-extrabold text-cyan-400">Stellar Tip Jar</h1>
    </div>
  );
}
```

- [ ] **Step 6: Bağımlılıkları Yükle ve Sunucuyu Çalıştır**
Run: `npm install`
Run: `npm run dev -- --port 5173` (Çalıştığını doğrulayıp durdurun)
Expected: Hata almadan kurulup yerel sunucunun ayağa kalkması.

- [ ] **Step 7: Commit**
```bash
git add package.json vite.config.js index.html src/index.css src/main.jsx src/App.jsx
git commit -m "chore: scaffold react project with tailwind v4"
```

---

### Task 2: Stellar & Freighter Yardımcı Fonksiyonları ve Testleri

**Files:**
- Modify: `src/utils/stellar.js`
- Modify: `src/utils/stellar.test.js`

*(Not: Bu dosyalar bir önceki adımda geçici oluşturulmuştu. Şimdi eksik kalan Horizon metodolojilerini ve Friendbot çağırma yapısını ekleyip güncelliyoruz.)*

- [ ] **Step 1: Test Dosyasını Güncelle veya Oluştur**
```javascript
// src/utils/stellar.test.js
import { describe, it, expect, vi } from 'vitest';
import { isConnected, getWalletAddress, fetchXlmBalance } from './stellar';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(() => true),
  getPublicKey: vi.fn(() => Promise.resolve('GBTESTADRESS12345')),
}));

global.fetch = vi.fn();

describe('Stellar Utilities', () => {
  it('should detect wallet connection state', async () => {
    const connected = await isConnected();
    expect(connected).toBe(true);
  });

  it('should fetch public wallet address', async () => {
    const address = await getWalletAddress();
    expect(address).toBe('GBTESTADRESS12345');
  });

  it('should parse XLM balance from Horizon response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        balances: [
          { asset_type: 'native', balance: '124.5000000' }
        ]
      })
    });
    
    const balance = await fetchXlmBalance('GBTESTADRESS12345');
    expect(balance).toBe('124.5');
  });
});
```

- [ ] **Step 2: utils/stellar.js Kodunu Tamamla**
```javascript
// src/utils/stellar.js
import { isConnected as freighterConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function isConnected() {
  return await freighterConnected();
}

export async function getWalletAddress() {
  try {
    const connected = await isConnected();
    if (!connected) return null;
    return await getPublicKey();
  } catch (error) {
    console.error('Wallet public key fetch failed:', error);
    return null;
  }
}

export async function fetchXlmBalance(address) {
  try {
    const response = await fetch(`${HORIZON_URL}/accounts/${address}`);
    if (!response.ok) return '0';
    const data = await response.json();
    const nativeBalance = data.balances.find((b) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance).toString() : '0';
  } catch (error) {
    console.error('Balance fetch error:', error);
    return '0';
  }
}

export async function fundWithFriendbot(address) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${address}`);
    if (!response.ok) throw new Error('Friendbot funding failed');
    return await response.json();
  } catch (error) {
    console.error('Friendbot error:', error);
    throw error;
  }
}

export async function sendTipTransaction(senderAddress, recipientAddress, amount) {
  try {
    const account = await server.loadAccount(senderAddress);
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipientAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(180)
      .build();

    const xdr = transaction.toXDR();
    const signedXdr = await signTransaction(xdr, {
      network: 'TESTNET',
    });

    const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      StellarSdk.Networks.TESTNET
    );
    const result = await server.submitTransaction(txToSubmit);
    return result.hash;
  } catch (error) {
    console.error('Transaction flow failed:', error);
    throw error;
  }
}
```

- [ ] **Step 3: Testleri Çalıştır ve Doğrula**
Run: `npm run test`
Expected: Tüm testlerin başarıyla geçmesi.

- [ ] **Step 4: Commit**
```bash
git add src/utils/stellar.js src/utils/stellar.test.js
git commit -m "feat: implement and verify stellar helper utilities"
```

---

### Task 3: Navbar Bileşeni (`src/components/Navbar.jsx`)

**Files:**
- Create: `src/components/Navbar.jsx`

**Interfaces:**
- Consumes: Cüzdan bağlantı fonksiyonları, `address`, `balance`, `onConnect()`, `onDisconnect()` stateleri.
- Produces: Sayfa üst bilgi çubuğu, cüzdan durumuna göre "Bağlan" veya "Bağlantıyı Kes" butonu.

- [ ] **Step 1: Navbar Bileşen Kodunu Yaz**
```javascript
import React from 'react';
import { Wallet, LogOut, Coins } from 'lucide-react';

export default function Navbar({ address, balance, onConnect, onDisconnect, isConnecting }) {
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
          Stellar Tip Jar
        </span>
      </div>

      <div className="flex items-center gap-4">
        {address ? (
          <>
            <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">Bakiye:</span>
              <span className="font-semibold text-cyan-400">{balance} XLM</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5">
              <span className="text-sm font-medium text-slate-200">{formatAddress(address)}</span>
              <button 
                onClick={onDisconnect}
                className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                title="Cüzdanı Ayır"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Bağlanıyor...' : 'Cüzdanı Bağla'}
          </button>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/Navbar.jsx
git commit -m "feat: add interactive navbar component with wallet status"
```

---

### Task 4: Bahşiş Kartı Bileşeni (`src/components/TipCard.jsx`)

**Files:**
- Create: `src/components/TipCard.jsx`

**Interfaces:**
- Consumes: `recipientAddress`, `isAddressLocked` (URL'den gelip gelmediği), `onSubmitTip(amount, customAddress)`
- Produces: Bahşiş gönderme formu, Robohash avatar görseli, QR kod alanı ve hızlı miktar butonları.

- [ ] **Step 1: TipCard Bileşen Kodunu Yaz**
```javascript
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
```

- [ ] **Step 2: Commit**
```bash
git add src/components/TipCard.jsx
git commit -m "feat: create TipCard component with dynamic avatar and QR"
```

---

### Task 5: Durum Bildirim Penceresi (`src/components/StatusModal.jsx`)

**Files:**
- Create: `src/components/StatusModal.jsx`

**Interfaces:**
- Consumes: `status` ('idle', 'loading', 'success', 'error'), `errorMsg`, `txHash`, `onClose()`
- Produces: Yüklenme göstergesi, başarılı işlem kutlaması, hata bildirim modalı.

- [ ] **Step 1: StatusModal Bileşen Kodunu Yaz**
```javascript
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
```

- [ ] **Step 2: Commit**
```bash
git add src/components/StatusModal.jsx
git commit -m "feat: add StatusModal component with confetti effects"
```

---

### Task 6: Ana Sayfa Entegrasyonu ve Testnet Faucet Mekanizması

**Files:**
- Create: `src/components/FaucetTrigger.jsx`
- Modify: `src/App.jsx`
- Create: `README.md` (Update)

**Interfaces:**
- Consumes: Bütün alt bileşenleri birleştirip Freighter Wallet durumunu yönetir.
- Produces: Tam fonksiyonel Stellar dApp.

- [ ] **Step 1: FaucetTrigger Bileşen Kodunu Yaz**
```javascript
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
```

- [ ] **Step 2: App.jsx Kodunu Birleştir**
```javascript
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TipCard from './components/TipCard';
import StatusModal from './components/StatusModal';
import FaucetTrigger from './components/FaucetTrigger';
import { getWalletAddress, fetchXlmBalance, sendTipTransaction } from './utils/stellar';

export default function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isAddressLocked, setIsAddressLocked] = useState(false);
  
  // Status states
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [txHash, setTxHash] = useState('');

  // 1. Read URL params for address
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addr = params.get('addr');
    if (addr && addr.startsWith('G') && addr.length === 56) {
      setRecipientAddress(addr);
      setIsAddressLocked(true);
    }
  }, []);

  // 2. Fetch balance automatically when address changes
  useEffect(() => {
    if (address) {
      updateBalance();
    }
  }, [address]);

  const updateBalance = async () => {
    if (!address) return;
    const bal = await fetchXlmBalance(address);
    setBalance(bal);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const addr = await getWalletAddress();
      if (addr) {
        setAddress(addr);
      } else {
        alert('Freighter cüzdanı bulunamadı veya bağlantı reddedildi.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance('0');
  };

  const handleSubmitTip = async (amount, customAddress) => {
    if (!address) return;
    
    setStatus('loading');
    setErrorMsg('');
    setTxHash('');

    try {
      const hash = await sendTipTransaction(address, customAddress, amount);
      setTxHash(hash);
      setStatus('success');
      updateBalance(); // Refresh balance after success
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'İşlem sırasında beklenmeyen bir hata oluştu.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <Navbar
        address={address}
        balance={balance}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <TipCard
          recipientAddress={recipientAddress}
          isAddressLocked={isAddressLocked}
          onSubmitTip={handleSubmitTip}
          isConnected={!!address}
        />

        {address && parseFloat(balance) === 0 && (
          <FaucetTrigger address={address} onFunded={updateBalance} />
        )}
      </main>

      <StatusModal
        status={status}
        errorMsg={errorMsg}
        txHash={txHash}
        onClose={() => setStatus('idle')}
      />
    </div>
  );
}
```

- [ ] **Step 3: README.md Dosyasını Güncelle**
```markdown
# Stellar Tip Jar & QR Generator

Bu proje, Stellar White Belt (Level 1) gereksinimlerini karşılayan, Freighter cüzdanı entegrasyonuna sahip premium tasarımlı bir bahşiş (tip) dApp uygulamasıdır.

## Özellikler
- **Cüzdan Bağlantısı:** Freighter cüzdanı ile hızlı bağlantı kurma ve ayrılma.
- **Bakiye Sorgulama:** Horizon API ile güncel XLM bakiyesi.
- **Bahşiş Sistemi:** Testnet üzerinde anlık XLM transferi.
- **URL Parametre Desteği:** `?addr=<stellar_adresi>` biçimiyle alıcı adresini kilitleyip kişiselleştirilmiş bahşiş sayfası paylaşabilme.
- **Dinamik Avatar:** Robohash ile cüzdan adresine özel sevimli robot profil resimleri.
- **QR Kod Oluşturucu:** Alıcı cüzdan adresini mobil tarayıcılar için QR formatında sunma.
- **Friendbot:** Bakiyesi 0 olan hesaplar için tek tıkla testnet XLM talep edebilme.

## Yerel Kurulum & Çalıştırma
Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları uygulayın:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Yerel geliştirici sunucusunu başlatın:
   ```bash
   npm run dev
   ```
3. Tarayıcınızdan `http://localhost:5173` adresine gidin.
```

- [ ] **Step 4: Commit**
```bash
git add src/components/FaucetTrigger.jsx src/App.jsx README.md
git commit -m "feat: complete app integration with Friendbot faucet and readme"
```
