import { useCallback, useEffect, useMemo, useState } from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { fetchCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import type { PublicKey as Web3PublicKey } from '@solana/web3.js';
import { MINT_CONFIG, getRpcEndpoint } from '@/config/mintConfig';

export interface CandyStats {
  minted: number;
  total: number;
  remaining: number;
}

export function useCandyMachine() {
  const [stats, setStats] = useState<CandyStats>({ minted: 0, total: MINT_CONFIG.totalItems, remaining: MINT_CONFIG.totalItems });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const umi = useMemo(() => createUmi(getRpcEndpoint()), []);

  const cmId = MINT_CONFIG.candyMachineId;

  const fetchStats = useCallback(async () => {
    if (!cmId) {
      setError('Candy Machine ID not configured.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const cmPk = publicKey(cmId as string);
      const cm: any = await fetchCandyMachine(umi, cmPk);
      // v3 fields can differ; try common ones safely
      const minted = Number(cm?.itemsRedeemed ?? cm?.itemsMinted ?? 0);
      const total = Number(cm?.data?.itemsAvailable ?? cm?.itemsAvailable ?? MINT_CONFIG.totalItems);
      const remaining = Math.max(total - minted, 0);
      setStats({ minted, total, remaining });
    } catch (e: any) {
      console.error('Failed fetching CM state', e);
      setError(e?.message ?? 'Failed to fetch candy machine');
    } finally {
      setLoading(false);
    }
  }, [cmId, umi]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}
