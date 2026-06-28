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
