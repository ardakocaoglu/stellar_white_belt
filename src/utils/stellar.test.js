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
