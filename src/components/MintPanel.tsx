import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import toast from 'react-hot-toast';
import { Copy, Loader2 } from 'lucide-react';
import { MINT_CONFIG } from '@/config/mintConfig';
import { motion } from 'framer-motion';

const MintPanel = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [minting, setMinting] = useState(false);
  const [stage, setStage] = useState<'idle' | 'prepping' | 'minting' | 'success' | 'error'>('idle');
  const onCopy = useCallback(async () => {
    if (!MINT_CONFIG.candyMachineId) {
      toast.error('Set your Candy Machine ID in src/config/mintConfig.ts');
      return;
    }
    try {
      await navigator.clipboard.writeText(MINT_CONFIG.candyMachineId);
      toast.success('Candy Machine ID copied');
    } catch {
      toast.error('Failed to copy');
    }
  }, []);

  const startMint = useCallback(async () => {
    if (!connected) {
      toast.error('Connect your wallet first', { id: 'mint' });
      setStage('error');
      return;
    }
    if (!MINT_CONFIG.candyMachineId) {
      toast.error('Add your Candy Machine ID in src/config/mintConfig.ts', { id: 'mint' });
      setStage('error');
      return;
    }

    try {
      setMinting(true);
      setStage('minting');
      toast.loading('Processing mint...', { id: 'mint' });
      // TODO: Implement Candy Machine V3 mint using Umi + mpl-candy-machine
      // This placeholder simulates a successful mint after a delay.
      await new Promise((res) => setTimeout(res, 1500));
      toast.success('Mint simulated! Replace with real mint logic.', { id: 'mint' });
      setStage('success');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Mint failed', { id: 'mint' });
      setStage('error');
    } finally {
      setMinting(false);
      setTimeout(() => setStage('idle'), 1500);
    }
  }, [connected]);

  const onActionClick = useCallback(() => {
    if (!connected) {
      setVisible(true);
    } else {
      startMint();
    }
  }, [connected, setVisible, startMint]);

  return (
    <section id="mint" className="container mx-auto py-16">
      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mx-auto max-w-xl rounded-2xl bg-card/60 glow-border p-8">
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={onActionClick}
            disabled={minting || stage === 'minting'}
            size="lg"
            variant="mechanical"
            className="hover-scale px-8 md:px-10 py-6 text-base md:text-lg"
          >
            {stage === 'minting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!connected && 'Select Wallet'}
            {connected && stage === 'idle' && 'Mint'}
            {connected && stage === 'minting' && 'Minting...'}
            {connected && stage === 'success' && 'Minted!'}
            {connected && stage === 'error' && 'Retry Mint'}
          </Button>
          <p className="text-sm text-muted-foreground">
            {connected ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}` : 'Connect your wallet to mint'}
          </p>
        </div>

        <div className="mt-8 w-full text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Mint your NFT</h2>
          <p className="mt-2 text-muted-foreground">Supply: {MINT_CONFIG.totalItems} • Network: {MINT_CONFIG.network}</p>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border bg-background/40 p-4 w-full">
          <div>
            <p className="text-sm text-muted-foreground">Candy Machine</p>
            <p className="font-mono text-sm truncate max-w-[220px]">
              {MINT_CONFIG.candyMachineId ? MINT_CONFIG.candyMachineId : 'Not set'}
            </p>
          </div>
          <Button variant="secondary" onClick={onCopy} className="hover-scale" size="sm">
            <Copy size={16} className="mr-2" /> Copy
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default MintPanel;
