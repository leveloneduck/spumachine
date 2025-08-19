import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MachineMint from '@/components/MachineMint';
import Stats from '@/components/Stats';

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Fixed two-color split for platform look with optional URL override (?split=NUMBER)
    const params = new URLSearchParams(window.location.search);
    const splitParam = params.get('split');
    const splitPx = splitParam && /^\d+$/.test(splitParam) ? `${splitParam}px` : '645px';
    el.style.setProperty('--hero-split', splitPx);
    el.style.setProperty('--hero-top', 'hsl(var(--background))'); // light/white
    el.style.setProperty('--hero-bottom', 'hsl(var(--muted))'); // dark
    document.documentElement.style.setProperty('--page-after-bg', 'hsl(var(--muted))');
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pb-8">
      {/* Split background that can sync with machine platform */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, var(--hero-top, hsl(var(--background))) 0px, var(--hero-top, hsl(var(--background))) var(--hero-split, 100000px), var(--hero-bottom, hsl(var(--muted))) var(--hero-split, 100000px), var(--hero-bottom, hsl(var(--muted))) 100%)',
        }}
      />
      {/* Glow */}
      <div className="absolute -z-10 left-1/2 top-1/3 h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto pt-40 md:pt-12 pb-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Header Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="space-y-6 text-center md:text-left order-2 md:order-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold gradient-text leading-tight"
            >
              SPARE PARTS UNIVERSE
              <br />
              LIMBOTS
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0"
            >
              Mint your exclusive limbot from the Spare Parts Universe. Each NFT is a unique mechanical being with its own identity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start"
            >
              <div className="text-primary font-semibold">
                404 Total Supply
              </div>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <div className="text-accent font-semibold">
                Solana Blockchain
              </div>
            </motion.div>
          </motion.div>

          {/* Machine Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center order-1 md:order-2"
          >
            <h2 className="sr-only">Interactive Minting Machine</h2>
            <MachineMint />
          </motion.div>
        </div>
      </div>
      
      {/* Stats integrated within Hero section with mobile spacing */}
      <div className="relative mt-32 md:mt-8 pt-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10"
        >
          <Stats />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
