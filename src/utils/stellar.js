import { isConnected as freighterConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Networks, BASE_FEE, Operation, Asset } from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

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
    console.log('--- DEBUG STELLAR TRANSACTION ---');
    console.log('Networks object:', Networks);
    console.log('Networks.TESTNET value:', Networks ? Networks.TESTNET : 'undefined');
    console.log('BASE_FEE value:', BASE_FEE);
    console.log('Sender Address:', senderAddress);
    console.log('Recipient Address:', recipientAddress);
    console.log('Amount:', amount);

    const account = await server.loadAccount(senderAddress);
    
    // Explicitly use the raw Testnet passphrase string to prevent any bundling/undefined issues
    const testnetPassphrase = 'Test SDF Network ; September 2015';
    console.log('Using passphrase:', testnetPassphrase);

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE || '100',
      networkPassphrase: testnetPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(180)
      .build();

    const xdr = transaction.toXDR();
    console.log('Generated XDR:', xdr);

    const signResult = await signTransaction(xdr, {
      network: 'TESTNET',
      networkPassphrase: testnetPassphrase,
    });

    console.log('Freighter Sign Result:', signResult);

    if (signResult.error) {
      throw new Error(signResult.error.message || 'İmzalama işlemi reddedildi.');
    }

    const txToSubmit = TransactionBuilder.fromXDR(
      signResult.signedTxXdr,
      testnetPassphrase
    );
    const result = await server.submitTransaction(txToSubmit);
    return result.hash;
  } catch (error) {
    console.error('Transaction flow failed:', error);
    throw error;
  }
}
