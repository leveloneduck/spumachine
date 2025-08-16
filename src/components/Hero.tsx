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
    const splitPx = splitParam && /^\d+$/.test(splitParam) ? `${splitParam}px` : '520px';
    el.style.setProperty('--hero-split', splitPx);
    el.style.setProperty('--hero-top', 'hsl(var(--background))'); // light/white
    el.style.setProperty('--hero-bottom', 'hsl(var(--muted))'); // dark
    document.documentElement.style.setProperty('--page-after-bg', 'hsl(var(--muted))');
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
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

      <div className="container mx-auto pt-2 md:pt-4 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="flex justify-center"
        >
          <h1 className="sr-only">Mint Spare Parts Machine NFT</h1>
          <MachineMint />
        </motion.div>
        
        {/* Stats positioned below machine */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="-mt-16 md:-mt-20"
        >
          <Stats />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
