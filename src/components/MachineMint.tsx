import { useCallback, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Copy, Loader2, Volume2, VolumeX, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { MachineSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { MINT_CONFIG, getRpcEndpoint } from '@/config/mintConfig';
import { PaymentMethodSelector, type PaymentMethod } from '@/components/PaymentMethodSelector';

// Artwork: replace this file with your uploaded machine image to update the UI
const MACHINE_PUBLIC = '/machine.png?v=1';
// Locked hotspot defaults (percent relative to image)
const LOCKED_HOTSPOT = { left: 47.212929223602664, top: 53.54015074572062, width: 6, height: 5 } as const;

// Default video window (percent relative to image)
const DEFAULT_VIDEO_WINDOW = { left: 37, top: 35, width: 25, height: 18 } as const;

// Platform split (percent from top of machine area)
const LOCKED_PLATFORM_Y = 62 as const;

// Video sources (local, small clips)
const VIDEO_SOURCES = ['/spu-vid.mp4'] as const;

type Stage = 'idle' | 'pressed' | 'processing' | 'minting' | 'success' | 'error';
type LoadingState = 'loading' | 'loaded' | 'error';

const MachineMint = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [stage, setStage] = useState<Stage>('idle');
  const [minting, setMinting] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('sol');
  
  const [imageLoading, setImageLoading] = useState<LoadingState>('loading');
  const [videoLoading, setVideoLoading] = useState<LoadingState>('loading');
  const [assetsReady, setAssetsReady] = useState(false);
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
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
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

  // Check if assets are ready and trigger fade-in animation
  useEffect(() => {
    if (imageLoading === 'loaded' && (videoLoading === 'loaded' || videoLoading === 'error')) {
      setAssetsReady(true);
    }
  }, [imageLoading, videoLoading]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!assetsReady) {
        console.warn('Loading timeout - forcing assets ready');
        setAssetsReady(true);
      }
    }, 5000); // 5 second timeout
    return () => clearTimeout(timeout);
  }, [assetsReady]);

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

  // Control video playback based on mint stage
  useEffect(() => {
    setShouldPlayVideo(stage === 'minting');
  }, [stage]);

  // Handle programmatic video control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlayVideo) {
      video.play().catch(console.warn);
    } else {
      video.pause();
      video.currentTime = 0; // Reset to beginning when not playing
    }
  }, [shouldPlayVideo]);

  const startMint = useCallback(async (paymentMethod: PaymentMethod = selectedPaymentMethod) => {
    if (!connected) {
      toast({ title: 'Connect your wallet first' });
      setStage('error');
      return;
    }
    if (!MINT_CONFIG.candyMachineId || MINT_CONFIG.candyMachineId === 'REPLACE_WITH_YOUR_CANDY_MACHINE_ID') {
      toast({ title: 'Candy Machine ID missing', description: 'Set it in src/config/mintConfig.ts' });
      setStage('error');
      return;
    }
    if (!(wallet as any)?.adapter) {
      toast({ title: 'Wallet not ready', description: 'Open your wallet or reconnect.' });
      setStage('error');
      return;
    }

    // Validate token payment configuration if using token payment
    if (paymentMethod === 'token') {
      if (!MINT_CONFIG.tokenPayment?.mintAddress || MINT_CONFIG.tokenPayment.mintAddress === 'REPLACE_WITH_TOKEN_MINT_ADDRESS') {
        toast({ title: 'Token mint address missing', description: 'Configure $SPU token mint in src/config/mintConfig.ts' });
        setStage('error');
        return;
      }
    }

    try {
      // Multi-stage loading: immediate processing feedback
      setStage('processing');
      
      // Brief processing delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMinting(true);
      setStage('minting');

      const [
        { createUmi },
        { publicKey, generateSigner, some, sol, lamports },
        { fetchCandyMachine, mint },
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

      // Prepare mint arguments based on payment method
      let mintArgs: any = {};

      if (paymentMethod === 'sol') {
        // SOL Payment guard
        mintArgs.solPayment = some({ lamports: lamports(MINT_CONFIG.solPrice * 1_000_000_000) });
      } else if (paymentMethod === 'token' && MINT_CONFIG.tokenPayment) {
        // Token Payment guard  
        mintArgs.tokenPayment = some({
          mint: publicKey(MINT_CONFIG.tokenPayment.mintAddress),
          amount: MINT_CONFIG.tokenPayment.amount,
          ...(MINT_CONFIG.tokenPayment.destinationAta ? {
            destinationAta: publicKey(MINT_CONFIG.tokenPayment.destinationAta)
          } : {})
        });
      }

      // Use mint function with proper guard handling for V3
      const group = MINT_CONFIG.guardGroupLabel;
      const sig = await mint(umi, {
        candyMachine: cm.publicKey,
        nftMint: nftMint.publicKey,
        collectionMint: (cm as any).collectionMint,
        collectionUpdateAuthority: (cm as any).authority,
        ...(group ? { group } : {}),
        mintArgs
      }).sendAndConfirm(umi);

      const paymentLabel = paymentMethod === 'sol' ? '$SOL' : MINT_CONFIG.tokenPayment?.symbol || '$SPU';
      toast({ 
        title: 'Mint successful', 
        description: `NFT minted with ${paymentLabel}!\nNFT: ${nftMint.publicKey.toString().slice(0, 8)}…\nTx: ${String(sig).slice(0, 8)}…` 
      });
      setStage('success');
    } catch (e: any) {
      console.error('Mint error:', e);
      
      // Handle specific guard errors
      let errorMessage = e?.message ?? 'Please try again.';
      if (errorMessage.includes('insufficient')) {
        const paymentLabel = paymentMethod === 'sol' ? '$SOL' : '$SPU';
        errorMessage = `Insufficient ${paymentLabel} balance for minting.`;
      } else if (errorMessage.includes('TokenPayment')) {
        errorMessage = 'Token payment failed. Check your $SPU balance.';
      } else if (errorMessage.includes('SolPayment')) {
        errorMessage = 'SOL payment failed. Check your SOL balance.';
      }
      
      toast({ title: 'Mint failed', description: errorMessage });
      setStage('error');
    } finally {
      setMinting(false);
      setTimeout(() => setStage('idle'), 1500);
    }
  }, [connected, wallet, selectedPaymentMethod]);

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

  const onPress = useCallback(() => {
    if (!connected) {
      setVisible(true);
    } else {
      // Immediate button press feedback
      setStage('pressed');
      
      // Brief delay for tactile feedback before showing selector
      setTimeout(() => {
        setStage('idle');
        setShowPaymentSelector(true);
      }, 150);
    }
  }, [connected, setVisible]);

  const handlePaymentSelection = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    startMint(method);
  }, [startMint]);

  return (
    <div className="mx-auto w-[min(403px,104vw)] max-w-[95vw] md:w-[min(600px,80vw)] -mt-6 md:-mt-12 relative z-20 px-1 md:px-4">
      {/* Loading skeleton */}
      {!assetsReady && (
        <div className="relative select-none origin-top">
          <AspectRatio ratio={displayRatio}>
            <MachineSkeleton className="absolute inset-0" />
          </AspectRatio>
        </div>
      )}
      
      {/* Payment Method Selector */}
      <PaymentMethodSelector
        open={showPaymentSelector}
        onOpenChange={setShowPaymentSelector}
        onSelectPayment={handlePaymentSelection}
      />
      
      {/* Machine + hotspot */}
      <motion.div 
        className="relative select-none origin-top transition-transform duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: assetsReady ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
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
              {/* Dark overlay when video is not playing */}
              <motion.div
                className="absolute inset-0 z-10 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: shouldPlayVideo ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.video
                ref={videoRef}
                key={videoSrc}
                className="h-full w-full object-cover"
                style={{ objectPosition: `${videoPosX}% ${videoPosY}%`, transform: `scale(${videoZoom})`, transformOrigin: 'center' }}
                src={videoSrc}
                muted={muted}
                loop
                playsInline
                preload="auto"
                onCanPlay={() => setVideoLoading('loaded')}
                onLoadedData={() => setVideoLoading('loaded')}
                onError={() => {
                  console.warn('Video failed to load:', videoSrc);
                  setVideoLoading('error');
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: assetsReady ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}

          {/* Control buttons: Volume */}
          <div className="absolute right-4 top-4 z-50 flex gap-2">
            {/* Mute/unmute toggle */}
            <Button
              type="button"
              variant="mechanical"
              size="icon"
              onClick={() => setMuted((m) => !m)}
              className="h-8 w-8 md:h-10 md:w-10 shadow-[0_0_12px_hsl(var(--primary)/0.3)] border-primary/30 bg-background/80 backdrop-blur-sm hover:shadow-[0_0_16px_hsl(var(--primary)/0.4)] hover:border-primary/50 transition-all duration-200"
              aria-label={muted ? 'Unmute background video' : 'Mute background video'}
            >
              {muted ? <VolumeX size={16} className="text-primary" /> : <Volume2 size={16} className="text-primary" />}
            </Button>
          </div>

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
              setImageLoading('loaded');
            }}
            onError={() => {
              console.warn('Machine image failed to load:', imgSrc);
              setImageLoading('error');
            }}
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

          {/* Main interactive button (hotspot) */}
          <motion.button
            className="absolute z-20 cursor-pointer disabled:cursor-not-allowed overflow-hidden"
            disabled={minting || stage === 'processing' || stage === 'pressed'}
            onClick={onPress}
            aria-label={connected ? 'Press to mint NFT' : 'Connect wallet to mint NFT'}
            style={{
              left: `${hotspot.left}%`,
              top: `${hotspot.top}%`,
              width: `${hotspot.width}%`,
              height: `${hotspot.height}%`,
              aspectRatio: '1 / 1',
              contain: 'layout style',
              willChange: 'transform',
              userSelect: 'none',
              fontSize: 0,
              textIndent: '-9999px',
              color: 'transparent'
            }}
          >
            {/* Press Here Button Design with contained animations */}
            <motion.div
              className="relative h-full w-full rounded-full select-none"
              style={{
                transformOrigin: 'center',
                borderRadius: '50%',
                willChange: 'auto'
              }}
              animate={connected && stage === 'idle' ? {
                boxShadow: [
                  "0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2), 0 0 60px hsl(var(--primary) / 0.1)",
                  "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3), 0 0 90px hsl(var(--primary) / 0.15)",
                  "0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2), 0 0 60px hsl(var(--primary) / 0.1)"
                ]
              } : {}}
              transition={connected && stage === 'idle' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 120px hsl(var(--primary) / 1.0), 0 0 80px hsl(var(--primary) / 0.9), 0 0 40px hsl(var(--primary) / 0.8), 0 0 160px hsl(var(--primary) / 0.7), 0 0 200px hsl(var(--primary) / 0.5)",
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: "0 0 50px hsl(var(--primary) / 0.9), 0 0 25px hsl(var(--primary) / 0.7), 0 0 80px hsl(var(--primary) / 0.5)",
                transition: { duration: 0.1 }
              }}
            >
              {/* Ring Animation Layer with containment */}
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 0.3), 
                    hsl(var(--primary) / 0.1), 
                    hsl(var(--primary) / 0.3))`,
                  padding: '2px',
                }}
                whileHover={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 0.8), 
                    hsl(var(--primary) / 0.5), 
                    hsl(var(--primary) / 0.8))`,
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  background: `conic-gradient(from 0deg, 
                    hsl(var(--primary) / 1.0), 
                    hsl(var(--primary) / 0.7), 
                    hsl(var(--primary) / 1.0))`,
                  transition: { duration: 0.1 }
                }}
              >
                <div className="w-full h-full rounded-full bg-background/20" />
              </motion.div>

              {/* Main Button Content with proper containment */}
              <motion.div className="relative z-10 h-full w-full rounded-full overflow-hidden">
                <motion.img
                  src="/PRESS HERE.png"
                  alt=""
                  className="h-full w-full object-fill select-none pointer-events-none"
                  draggable={false}
                  loading="lazy"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    fontSize: 0,
                    textIndent: '-9999px'
                  }}
                  whileHover={{
                    filter: "brightness(1.3) contrast(1.15) saturate(1.2)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{
                    filter: "brightness(1.5) contrast(1.25) saturate(1.4)",
                    transition: { duration: 0.1 }
                  }}
                />
                
                {/* Contained Press Ripple Effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  style={{ 
                    clipPath: 'circle(50% at center)',
                    transformOrigin: 'center'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{
                    scale: [0, 1.0],
                    opacity: [0, 0.8, 0],
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                />

                {/* Button Press State with containment */}
                {stage === 'pressed' && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/30 rounded-full"
                    style={{ clipPath: 'circle(50% at center)' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                {/* Processing State */}
                {stage === 'processing' && (
                  <motion.div 
                    className="absolute inset-0 grid place-items-center bg-background/50 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}

                {/* Loading State Enhancement */}
                {minting && (
                  <motion.div 
                    className="absolute inset-0 grid place-items-center bg-background/70 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 4px hsl(var(--primary) / 0.3)",
                          "0 0 8px hsl(var(--primary) / 0.4)",
                          "0 0 4px hsl(var(--primary) / 0.3)"
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

                {/* Success/Error Flash with containment */}
                {(stage === 'success' || stage === 'error') && (
                  <motion.div
                    className={`absolute inset-0 ${stage === 'success' ? 'bg-green-500/30' : 'bg-red-500/30'} rounded-full`}
                    style={{ clipPath: 'circle(50% at center)' }}
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
            </motion.div>
          </motion.button>
        </AspectRatio>
      </motion.div>

      {/* Status row */}
      <div className="mt-0 flex flex-col items-center gap-2 text-center">
        <h2 className="sr-only">Mint Spare Parts Machine NFT</h2>
        <Badge variant="outline" className="text-sm bg-muted/50">
          {connected
            ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
            : 'Connect your wallet to mint'}
        </Badge>

        {/* Wallet Connect Button */}
        <Button
          type="button"
          variant="mechanical"
          onClick={() => connected ? {} : setVisible(true)}
          className="h-10 md:h-12 w-auto px-4 md:px-6 shadow-[0_0_12px_hsl(var(--primary)/0.3)] border-primary/30 bg-background/80 backdrop-blur-sm hover:shadow-[0_0_16px_hsl(var(--primary)/0.4)] hover:border-primary/50 transition-all duration-200"
          aria-label={connected ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...` : 'Connect wallet'}
        >
          <span className="text-sm md:text-base text-primary">Select Wallet</span>
        </Button>

        {devMode && (
          <div className="mt-4 w-full max-w-md rounded-lg metal-card metal-holes p-3 text-left">
            <div className="corner-hole-bl"></div>
            <div className="corner-hole-br"></div>
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
          <div className="mt-4 w-full max-w-md rounded-lg metal-card metal-holes p-3 text-left">
            <div className="corner-hole-bl"></div>
            <div className="corner-hole-br"></div>
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
          <div className="mt-4 w-full max-w-md rounded-lg metal-card metal-holes p-3 text-left">
            <div className="corner-hole-bl"></div>
            <div className="corner-hole-br"></div>
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