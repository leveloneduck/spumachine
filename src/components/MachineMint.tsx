import { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/use-toast';
import { MINT_CONFIG } from '@/config/mintConfig';

import machineImg from '@/assets/spare-parts-machine.png';
import pressImg from '@/assets/press-here.png';

type Stage = 'idle' | 'minting' | 'success' | 'error';

const MachineMint = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [stage, setStage] = useState<Stage>('idle');
  const [minting, setMinting] = useState(false);

  const startMint = useCallback(async () => {
    if (!connected) {
      toast({ title: 'Connect your wallet first' });
      setStage('error');
      return;
    }
    if (!MINT_CONFIG.candyMachineId) {
      toast({ title: 'Candy Machine ID missing', description: 'Set it in src/config/mintConfig.ts' });
      setStage('error');
      return;
    }

    try {
      setMinting(true);
      setStage('minting');
      // Simulated mint — replace with real Candy Machine mint flow
      await new Promise((res) => setTimeout(res, 1500));
      toast({ title: 'Mint simulated', description: 'Replace with real mint logic.' });
      setStage('success');
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Mint failed', description: e?.message ?? 'Please try again.' });
      setStage('error');
    } finally {
      setMinting(false);
      setTimeout(() => setStage('idle'), 1500);
    }
  }, [connected]);

  const onCopy = useCallback(async () => {
    if (!MINT_CONFIG.candyMachineId) {
      toast({ title: 'Candy Machine ID not set' });
      return;
    }
    try {
      await navigator.clipboard.writeText(MINT_CONFIG.candyMachineId);
      toast({ title: 'Candy Machine ID copied' });
    } catch {
      toast({ title: 'Failed to copy' });
    }
  }, []);

  const onPress = () => {
    if (!connected) setVisible(true);
    else startMint();
  };


  return (
    <div className="mx-auto w-full max-w-[780px]">
      {/* Machine + hotspot */}
      <div className="relative select-none">
        <AspectRatio ratio={3 / 4}>
          <img
            src={machineImg}
            alt="Spare Parts mint machine"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            loading="eager"
          />

          {/* Hotspot overlay */}
          <motion.button
            type="button"
            aria-label={connected ? 'Press to mint' : 'Connect wallet to mint'}
            onClick={onPress}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPress();
              }
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            style={{
              left: '50%',
              top: '46%',
              width: 'clamp(56px, 18%, 128px)',
              height: 'clamp(56px, 18%, 128px)',
            }}
animate={stage === 'idle' ? { scale: [1, 1.06, 1], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } } : undefined}
            whileTap={{ scale: 0.96 }}
          >
            <div className="relative h-full w-full rounded-full">
              <img src={pressImg} alt="" className="h-full w-full object-contain" draggable={false} />
              {minting && (
                <div className="absolute inset-0 grid place-items-center rounded-full bg-background/70">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          </motion.button>
        </AspectRatio>
      </div>

      {/* Status row */}
      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <h2 className="sr-only">Mint Spare Parts Machine NFT</h2>
        <p className="text-sm text-muted-foreground">
          {connected
            ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
            : 'Connect your wallet to mint'}
        </p>

        <div className="mt-2 flex w-full max-w-sm items-center justify-between rounded-lg border bg-card/60 p-3">
          <div className="min-w-0 text-left">
            <p className="text-xs text-muted-foreground">Candy Machine</p>
            <p className="font-mono text-xs truncate">{MINT_CONFIG.candyMachineId || 'Not set'}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={onCopy} className="hover-scale">
            <Copy size={14} className="mr-1.5" /> Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MachineMint;
