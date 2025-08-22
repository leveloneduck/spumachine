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
      {/* Base metallic industrial background */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]" />
      
      {/* Top half background - Red mouths */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `url('/lovable-uploads/b24f0e31-c458-47e7-b851-9f97a35de64b.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: `polygon(0 0, 100% 0, 100% var(--hero-split, 645px), 0 var(--hero-split, 645px))`,
        }}
      />
      {/* Bottom half background - Limbots collage */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `url('/lovable-uploads/d681815c-9777-4577-9093-7aa659f572e4.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: `polygon(0 var(--hero-split, 645px), 100% var(--hero-split, 645px), 100% 100%, 0 100%)`,
        }}
      />
      {/* Industrial rust overlay matching PIN page */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[hsl(var(--rust-dark)/0.4)] via-transparent to-[hsl(var(--rust-base)/0.3)]" />
      
      {/* Radial accent overlays */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 30% 20%, hsl(var(--rust-base)/0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--rust-dark)/0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, hsl(var(--metal-light)/0.1) 0%, transparent 50%)'
        }}
      />
      {/* Glow */}
      <div className="absolute -z-10 left-1/2 top-1/3 h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="container mx-auto pt-72 md:pt-12 pb-16 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="flex justify-center scale-[1.8] md:scale-100"
        >
          <h1 className="sr-only">Mint Spare Parts Machine NFT</h1>
          <MachineMint />
        </motion.div>
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
