import { isConnected as freighterConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function isConnected() {
  const result = await freighterConnected();
  return !!result.isConnected;
}

export async function getWalletAddress() {
  try {
    const connected = await isConnected();
    if (!connected) return null;
    
    const result = await requestAccess();
    if (result.error) {
      console.error('Freighter access denied:', result.error);
      return null;
    }
    return result.address;
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
    const signResult = await signTransaction(xdr, {
      network: 'TESTNET',
    });

    if (signResult.error) {
      throw new Error(signResult.error.message || 'İmzalama işlemi reddedildi.');
    }

    const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(
      signResult.signedTxXdr,
      StellarSdk.Networks.TESTNET
    );
    const result = await server.submitTransaction(txToSubmit);
    return result.hash;
  } catch (error) {
    console.error('Transaction flow failed:', error);
    throw error;
  }
}
