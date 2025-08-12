import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MachineMint from '@/components/MachineMint';

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const el = sectionRef.current;
      if (!el) return;
      const detail = e?.detail || {};
      el.style.setProperty('--hero-split', `${detail.pixelY ?? 0}px`);
      el.style.setProperty('--hero-top', detail.colors?.top ?? 'hsl(var(--background))');
      el.style.setProperty('--hero-bottom', detail.colors?.bottom ?? 'hsl(var(--muted))');
    };
    window.addEventListener('machine-platform', handler as any);
    return () => window.removeEventListener('machine-platform', handler as any);
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

      <div className="container mx-auto pt-6 md:pt-8 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <h1 className="sr-only">Mint Spare Parts Machine NFT</h1>
          <MachineMint />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
