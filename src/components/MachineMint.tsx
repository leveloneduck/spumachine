import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Copy, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/use-toast';
import { MINT_CONFIG, getRpcEndpoint } from '@/config/mintConfig';
import machineAsset from '@/assets/spare-parts-machine.png';
import pressHere from '@/assets/press-here.png';

// Artwork: replace this file with your uploaded machine image to update the UI
const MACHINE_PUBLIC = '/machine.png';
// Locked hotspot defaults (percent relative to image)
const LOCKED_HOTSPOT = { left: 47.212929223602664, top: 53.54015074572062, width: 6, height: 5 } as const;

type Stage = 'idle' | 'minting' | 'success' | 'error';

const MachineMint = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [stage, setStage] = useState<Stage>('idle');
  const [minting, setMinting] = useState(false);
  const [displayRatio, setDisplayRatio] = useState(3 / 4);
  const [devMode, setDevMode] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(MACHINE_PUBLIC);
  const [hotspot, setHotspot] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('hotspot')) {
        const stored = localStorage.getItem('machineHotspot');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
              if ('size' in parsed) {
                return { left: parsed.left, top: parsed.top, width: parsed.size, height: parsed.size };
              }
              if ('width' in parsed && 'height' in parsed) {
                return parsed;
              }
            }
          } catch {}
        }
      }
    }
    return { ...LOCKED_HOTSPOT } as { left: number; top: number; width: number; height: number };
  });




  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setDevMode(params.has('hotspot'));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !devMode) return;
    try { localStorage.setItem('machineHotspot', JSON.stringify(hotspot)); } catch {}
  }, [hotspot, devMode]);


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
    if (!(wallet as any)?.adapter) {
      toast({ title: 'Wallet not ready', description: 'Open your wallet or reconnect.' });
      setStage('error');
      return;
    }

    try {
      setMinting(true);
      setStage('minting');

      const [
        { createUmi },
        { publicKey, generateSigner },
        { fetchCandyMachine, mintV2 },
        { walletAdapterIdentity }
      ] = await Promise.all([
        import('@metaplex-foundation/umi-bundle-defaults'),
        import('@metaplex-foundation/umi'),
        import('@metaplex-foundation/mpl-candy-machine'),
        import('@metaplex-foundation/umi-signer-wallet-adapters')
      ]);

      const endpoint = getRpcEndpoint();
      const umi = createUmi(endpoint).use(walletAdapterIdentity((wallet as any).adapter));

      const cm = await fetchCandyMachine(umi, publicKey(MINT_CONFIG.candyMachineId as string));
      const nftMint = generateSigner(umi);

      const group = MINT_CONFIG.guardGroupLabel;
      const sig = await mintV2(umi, {
        candyMachine: cm.publicKey,
        nftMint,
        collectionMint: (cm as any).collectionMint,
        collectionUpdateAuthority: (cm as any).authority,
        ...(group ? { group } : {}),
        mintArgs: {}
      }).sendAndConfirm(umi);

      toast({ title: 'Mint successful', description: `NFT: ${nftMint.publicKey.toString()}\nTx: ${String(sig).slice(0, 8)}…` });
      setStage('success');
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Mint failed', description: e?.message ?? 'Please try again.' });
      setStage('error');
    } finally {
      setMinting(false);
      setTimeout(() => setStage('idle'), 1500);
    }
  }, [connected, wallet]);

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
      <div className="relative select-none origin-top transition-transform duration-300 md:scale-[0.69] md:-translate-y-[3%] lg:-translate-y-[4%] 2xl:-translate-y-[5%]">
        <AspectRatio ratio={displayRatio}>
          <img
            src={imgSrc}
            alt="Minting machine UI — user-provided artwork"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
            loading="eager"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.naturalWidth && img.naturalHeight) {
                setDisplayRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
            onError={() => setImgSrc(machineAsset)}
          />

          {/* Dev calibration click layer */}
          <div
            className={`absolute inset-0 ${devMode ? 'z-20 cursor-crosshair' : 'pointer-events-none'}`}
            onClick={devMode ? (e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const left = ((e.clientX - rect.left) / rect.width) * 100;
              const top = ((e.clientY - rect.top) / rect.height) * 100;
              setHotspot((h: any) => ({ ...h, left: Math.max(0, Math.min(100, left)), top: Math.max(0, Math.min(100, top)) }));
            } : undefined}
          />

          {/* Hotspot overlay (invisible in production, visible in ?hotspot mode) */}
          <motion.button
            type="button"
            aria-label={connected ? 'Press to mint' : 'Connect wallet to mint'}
            onClick={!devMode ? onPress : undefined}
            onKeyDown={(e) => {
              if (!devMode && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onPress();
              }
            }}
            className={`absolute z-50 -translate-x-1/2 -translate-y-1/2 outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary/70 ${devMode ? 'ring-2 ring-primary/60' : 'ring-0'} transition-transform`}
            style={{
              left: `${hotspot.left}%`,
              top: `${hotspot.top}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              minWidth: '0px',
              minHeight: '0px',
            }}
            animate={stage === 'idle' ? { scale: [1, 1.04, 1], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } } : undefined}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="relative h-full w-full">
              <img src={pressHere} alt={connected ? 'Press to mint' : 'Connect wallet to mint'} className="h-full w-full object-fill select-none pointer-events-none" draggable={false} />
              {minting && (
                <div className="absolute inset-0 grid place-items-center bg-background/70">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
              <span className="sr-only">{connected ? 'Press to mint' : 'Connect wallet to mint'}</span>
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

        {devMode && (
          <div className="mt-4 w-full max-w-md rounded-lg border bg-card/60 p-3 text-left">
            <p className="text-sm font-medium mb-2">Hotspot calibration</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Left
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hotspot.left}
                  onChange={(e) => setHotspot((h: any) => ({ ...h, left: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{hotspot.left}%</span>
              </label>
              <label className="text-xs">
                Top
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hotspot.top}
                  onChange={(e) => setHotspot((h: any) => ({ ...h, top: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{hotspot.top}%</span>
              </label>
              <label className="text-xs">
                Width
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={(hotspot as any).width}
                  onChange={(e) => setHotspot((h: any) => ({ ...h, width: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{(hotspot as any).width}%</span>
              </label>
              <label className="text-xs">
                Height
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={(hotspot as any).height}
                  onChange={(e) => setHotspot((h: any) => ({ ...h, height: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{(hotspot as any).height}%</span>
              </label>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Tip: append <code>?hotspot</code> to the URL. Settings auto-save.</p>
              <Button size="sm" variant="secondary" onClick={() => {
                try { navigator.clipboard.writeText(JSON.stringify(hotspot)); toast({ title: 'Hotspot JSON copied' }); } catch {}
              }}>Copy JSON</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineMint;
