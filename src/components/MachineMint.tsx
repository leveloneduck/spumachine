import { useCallback, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Copy, Loader2, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/use-toast';
import { MINT_CONFIG, getRpcEndpoint } from '@/config/mintConfig';



// Artwork: replace this file with your uploaded machine image to update the UI
const MACHINE_PUBLIC = '/machine.png?v=1';
// Locked hotspot defaults (percent relative to image)
const LOCKED_HOTSPOT = { left: 47.212929223602664, top: 53.54015074572062, width: 6, height: 5 } as const;

// Default video window (percent relative to image)
const DEFAULT_VIDEO_WINDOW = { left: 37, top: 35, width: 25, height: 18 } as const;

// Platform split (percent from top of machine area)
const LOCKED_PLATFORM_Y = 62 as const;

// Video sources (local, small clips)
const VIDEO_SOURCES = ['/videos/spu-vid.MP4', '/videos/spu-vid1.MP4'] as const;

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
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
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

  const [videoDev, setVideoDev] = useState(false);
  const [videoWindow, setVideoWindow] = useState(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('hotspotVideo')) {
        const stored = localStorage.getItem('machineVideoWindow');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object' && 'left' in parsed && 'top' in parsed) {
              return parsed as { left: number; top: number; width: number; height: number };
            }
          } catch {}
        }
      }
    }
    return { ...DEFAULT_VIDEO_WINDOW } as { left: number; top: number; width: number; height: number };
  });
  const [videoPosX, setVideoPosX] = useState(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('hotspotVideo')) {
        try {
          const stored = localStorage.getItem('machineVideoStyle');
          if (stored) { const s = JSON.parse(stored); if (typeof s?.posX === 'number') return s.posX; }
        } catch {}
      }
    }
    return 50;
  });
  const [videoPosY, setVideoPosY] = useState(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('hotspotVideo')) {
        try {
          const stored = localStorage.getItem('machineVideoStyle');
          if (stored) { const s = JSON.parse(stored); if (typeof s?.posY === 'number') return s.posY; }
        } catch {}
      }
    }
    return 50;
  });
  const [videoZoom, setVideoZoom] = useState(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('hotspotVideo')) {
        try {
          const stored = localStorage.getItem('machineVideoStyle');
          if (stored) { const s = JSON.parse(stored); if (typeof s?.zoom === 'number') return s.zoom; }
        } catch {}
      }
    }
    return 1.04;
  });

  const [muted, setMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Platform calibration state
  const [platformDev, setPlatformDev] = useState(false);
  const [platformY, setPlatformY] = useState<number>(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('platform')) {
        const stored = localStorage.getItem('machinePlatformY');
        if (stored) {
          const n = Number(stored);
          if (!Number.isNaN(n)) return Math.max(0, Math.min(100, n));
        }
      }
    }
    return LOCKED_PLATFORM_Y as number;
  });
const [platformOffsetPx] = useState<number>(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const pox = params.get('pox'); // dev override: pixels
    if (pox !== null) {
      const n = Number(pox);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0; // default 0px offset; use percent by default
});
const [platformOffsetPct] = useState<number>(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const po = params.get('po'); // dev override: percent
    if (po !== null) {
      const n = Number(po);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 15; // default 15% upward offset
});
const platformRef = useRef<HTMLDivElement>(null);

// Sync platform split with Hero background
const syncPlatform = useCallback(() => {
  const el = platformRef.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const basePixelY = rect.top + (rect.height * platformY) / 100;
  const offset = platformOffsetPx + (rect.height * platformOffsetPct) / 100;
  const pixelY = basePixelY - offset; // move split slightly above the base
  window.dispatchEvent(
    new CustomEvent('machine-platform', {
      detail: {
        pixelY,
        colors: { top: 'hsl(var(--background))', bottom: 'hsl(var(--muted))' },
      },
    })
  );
}, [platformY, platformOffsetPx, platformOffsetPct]);

  useEffect(() => {
    if (typeof window === 'undefined' || !import.meta.env.DEV) return;
    const params = new URLSearchParams(window.location.search);
    setDevMode(params.has('hotspot'));
    setVideoDev(params.has('hotspotVideo'));
    setPlatformDev(params.has('platform'));
  }, []);

  useEffect(() => {
    syncPlatform();
  }, [syncPlatform, displayRatio]);

  useEffect(() => {
    const onResize = () => syncPlatform();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [syncPlatform]);
  useEffect(() => {
    // Pick a random video on mount
    const index = Math.floor(Math.random() * VIDEO_SOURCES.length);
    setVideoSrc(VIDEO_SOURCES[index]);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !devMode) return;
    try { localStorage.setItem('machineHotspot', JSON.stringify(hotspot)); } catch {}
  }, [hotspot, devMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !platformDev) return;
    try { localStorage.setItem('machinePlatformY', String(platformY)); } catch {}
  }, [platformY, platformDev]);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoDev) return;
    try { localStorage.setItem('machineVideoWindow', JSON.stringify(videoWindow)); } catch {}
  }, [videoWindow, videoDev]);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoDev) return;
    try {
      localStorage.setItem('machineVideoStyle', JSON.stringify({ posX: videoPosX, posY: videoPosY, zoom: videoZoom }));
    } catch {}
  }, [videoDev, videoPosX, videoPosY, videoZoom]);

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
    <div className="mx-auto w-full max-w-[780px] -mb-8">
      {/* Machine + hotspot */}
      <div className="relative select-none origin-top transition-transform duration-300 md:scale-[0.69] md:-translate-y-[8%] lg:-translate-y-[10%] 2xl:-translate-y-[12%] overflow-hidden">
        <AspectRatio ratio={displayRatio}>
          {/* Invisible anchor for platform position (no visual underlay) */}
          <div ref={platformRef} className="absolute inset-0 z-0 pointer-events-none">
            {platformDev && (
              <div className="absolute left-0 right-0" style={{ top: `${platformY}%` }}>
                <div className="h-px bg-primary/60" />
              </div>
            )}
          </div>

          {/* Random video layer behind the machine artwork */}
          {videoSrc && (
            <div
              className={`absolute z-10 overflow-hidden pointer-events-none ${videoDev ? 'ring-2 ring-primary/60' : ''}`}
              style={{
                left: `${videoWindow.left}%`,
                top: `${videoWindow.top}%`,
                width: `${videoWindow.width}%`,
                height: `${videoWindow.height}%`,
              }}
            >
              <motion.video
                ref={videoRef}
                key={videoSrc}
                className="h-full w-full object-cover"
                style={{ objectPosition: `${videoPosX}% ${videoPosY}%`, transform: `scale(${videoZoom})`, transformOrigin: 'center' }}
                src={videoSrc}
                autoPlay
                muted={muted}
                loop
                playsInline
                preload="metadata"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}

          {/* Mute/unmute toggle */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setMuted((m) => !m)}
            className="absolute right-2 top-2 z-40"
            aria-label={muted ? 'Unmute background video' : 'Mute background video'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>

          {/* Machine artwork overlay (PNG with transparent window) */}
          <img
            src={imgSrc}
            alt="Minting machine UI — user-provided artwork"
            className="absolute inset-0 z-20 h-full w-full object-contain pointer-events-none"
            loading="eager"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.naturalWidth && img.naturalHeight) {
                setDisplayRatio(img.naturalWidth / img.naturalHeight);
              } else {
                console.warn('Machine image loaded with zero natural size:', imgSrc);
              }
            }}
            onError={() => console.warn('Machine image failed to load:', imgSrc)}
          />

          {/* Platform calibration click layer */}
          <div
            className={`absolute inset-0 ${platformDev ? 'z-30 cursor-row-resize' : 'pointer-events-none'}`}
            onClick={platformDev ? (e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const top = ((e.clientY - rect.top) / rect.height) * 100;
              setPlatformY(Math.max(0, Math.min(100, top)));
            } : undefined}
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
            className={`absolute z-50 -translate-x-1/2 -translate-y-1/2 outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary/70 ${devMode ? 'ring-2 ring-primary/60' : 'ring-0'} transition-all duration-200 rounded-full overflow-hidden will-change-transform`}
            style={{
              left: `${hotspot.left}%`,
              top: `${hotspot.top}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              minWidth: '0px',
              minHeight: '0px',
            }}
            animate={stage === 'idle' ? { 
              scale: [1, 1.04, 1], 
              transition: { 
                duration: 1.8, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              } 
            } : undefined}
            whileHover={{ 
              scale: 1.08,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{
              scale: [0.88, 1.02, 1.0],
              transition: {
                duration: 0.3,
                times: [0, 0.4, 1],
                ease: "easeOut"
              }
            }}
          >
            <motion.div 
              className="relative h-full w-full rounded-full overflow-hidden"
              style={{
                boxShadow: `
                  0 0 24px hsl(var(--primary) / 0.35),
                  0 0 8px hsl(var(--primary) / 0.25),
                  inset 0 1px 2px hsl(var(--foreground) / 0.1)
                `,
              }}
              whileHover={{
                boxShadow: `
                  0 0 36px hsl(var(--primary) / 0.5),
                  0 0 16px hsl(var(--primary) / 0.4),
                  inset 0 1px 2px hsl(var(--foreground) / 0.15)
                `,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                boxShadow: `
                  0 0 48px hsl(var(--primary) / 0.7),
                  0 0 24px hsl(var(--primary) / 0.6),
                  inset 0 2px 4px hsl(var(--foreground) / 0.2)
                `,
                transition: { duration: 0.1 }
              }}
            >
              {/* Ring Animation Layer */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 0.3), 
                    hsl(var(--primary) / 0.1), 
                    hsl(var(--primary) / 0.3))`,
                  padding: '2px',
                }}
                whileHover={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 0.5), 
                    hsl(var(--primary) / 0.2), 
                    hsl(var(--primary) / 0.5))`,
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 0.8), 
                    hsl(var(--primary) / 0.4), 
                    hsl(var(--primary) / 0.8))`,
                  transition: { duration: 0.1 }
                }}
              >
                <div className="w-full h-full rounded-full bg-background/20" />
              </motion.div>

              {/* Main Button Content */}
              <motion.div className="relative z-10 h-full w-full rounded-full overflow-hidden">
                <motion.img
                  src="/PRESS HERE.png"
                  alt={connected ? 'Press to mint' : 'Connect wallet to mint'}
                  className="h-full w-full object-fill select-none pointer-events-none"
                  draggable={false}
                  loading="lazy"
                  whileTap={{
                    filter: "brightness(1.2) contrast(1.1)",
                    transition: { duration: 0.1 }
                  }}
                />
                
                {/* Press Ripple Effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{
                    scale: [0, 1.2],
                    opacity: [0, 0.8, 0],
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                />

                {/* Loading State Enhancement */}
                {minting && (
                  <motion.div 
                    className="absolute inset-0 grid place-items-center bg-background/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 8px hsl(var(--primary) / 0.3)",
                          "0 0 16px hsl(var(--primary) / 0.6)",
                          "0 0 8px hsl(var(--primary) / 0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="rounded-full p-1"
                    >
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Success/Error Flash */}
                {(stage === 'success' || stage === 'error') && (
                  <motion.div
                    className={`absolute inset-0 ${stage === 'success' ? 'bg-green-500/30' : 'bg-red-500/30'} rounded-full`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0, 0.8, 0], 
                      scale: [0.8, 1, 1] 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut" 
                    }}
                  />
                )}
              </motion.div>
              
              <span className="sr-only">{connected ? 'Press to mint' : 'Connect wallet to mint'}</span>
            </motion.div>
          </motion.button>
        </AspectRatio>
      </div>

      {/* Status row */}
      <div className="mt-0 flex flex-col items-center gap-2 text-center">
        <h2 className="sr-only">Mint Spare Parts Machine NFT</h2>
        <p className="text-sm text-muted-foreground">
          {connected
            ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
            : 'Connect your wallet to mint'}
        </p>

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

        {platformDev && (
          <div className="mt-4 w-full max-w-md rounded-lg border bg-card/60 p-3 text-left">
            <p className="text-sm font-medium mb-2">Platform split calibration</p>
            <label className="text-xs block">
              Y position
              <input
                type="range"
                min={0}
                max={100}
                value={platformY}
                onChange={(e) => setPlatformY(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[10px] text-muted-foreground">{platformY}%</span>
            </label>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Tip: append <code>?platform</code> to the URL. Auto-saves.</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => {
                  try { navigator.clipboard.writeText(String(platformY)); toast({ title: 'Platform Y copied' }); } catch {}
                }}>Copy Y</Button>
                <Button size="sm" variant="secondary" onClick={() => setPlatformY(LOCKED_PLATFORM_Y as number)}>Reset</Button>
              </div>
            </div>
          </div>
        )}

        {videoDev && (
          <div className="mt-4 w-full max-w-md rounded-lg border bg-card/60 p-3 text-left">
            <p className="text-sm font-medium mb-2">Video window calibration</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                Left
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={videoWindow.left}
                  onChange={(e) => setVideoWindow((v) => ({ ...v, left: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoWindow.left}%</span>
              </label>
              <label className="text-xs">
                Top
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={videoWindow.top}
                  onChange={(e) => setVideoWindow((v) => ({ ...v, top: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoWindow.top}%</span>
              </label>
              <label className="text-xs">
                Width
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={videoWindow.width}
                  onChange={(e) => setVideoWindow((v) => ({ ...v, width: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoWindow.width}%</span>
              </label>
              <label className="text-xs">
                Height
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={videoWindow.height}
                  onChange={(e) => setVideoWindow((v) => ({ ...v, height: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoWindow.height}%</span>
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <p className="col-span-2 text-xs font-medium">Video fit</p>
              <label className="text-xs">
                X
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={videoPosX}
                  onChange={(e) => setVideoPosX(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoPosX}%</span>
              </label>
              <label className="text-xs">
                Y
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={videoPosY}
                  onChange={(e) => setVideoPosY(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoPosY}%</span>
              </label>
              <label className="text-xs col-span-2">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={1.2}
                  step={0.005}
                  value={videoZoom}
                  onChange={(e) => setVideoZoom(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-[10px] text-muted-foreground">{videoZoom.toFixed(3)}x</span>
              </label>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">Tip: append <code>?hotspotVideo</code> to the URL. Settings auto-save.</p>
              <Button size="sm" variant="secondary" onClick={() => {
                try { navigator.clipboard.writeText(JSON.stringify(videoWindow)); toast({ title: 'Video window JSON copied' }); } catch {}
              }}>Copy JSON</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineMint;
