import { useCallback, useEffect, useState } from 'react';
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

  const fetchStats = useCallback(async () => {
    if (!MINT_CONFIG.candyMachineId) {
      setError('Candy Machine ID not configured.');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Dynamic imports prevent early evaluation of Node-like deps
      const [{ createUmi }, { publicKey }, { fetchCandyMachine }] = await Promise.all([
        import('@metaplex-foundation/umi-bundle-defaults'),
        import('@metaplex-foundation/umi'),
        import('@metaplex-foundation/mpl-candy-machine')
      ]);

      const endpoint = getRpcEndpoint();
      const umi = createUmi(endpoint);

      const cmPk = publicKey(MINT_CONFIG.candyMachineId as string);
      const cm: any = await fetchCandyMachine(umi, cmPk);

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
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}
