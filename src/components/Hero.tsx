import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MachineMint from '@/components/MachineMint';
import Stats from '@/components/Stats';
import ElectricText from '@/components/ElectricText';
import { WalletStatus } from '@/components/WalletStatus';
import { SocialMediaButtons } from '@/components/SocialMediaButtons';
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
  return <section ref={sectionRef} className="relative overflow-hidden pb-8 min-h-screen">
      {/* Base metallic industrial background - extends to full page */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]" style={{
      minHeight: '100vh'
    }} />
      
      {/* Industrial rust overlay - extends to full page */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[hsl(var(--rust-dark)/0.4)] via-transparent to-[hsl(var(--rust-base)/0.3)]" style={{
      minHeight: '100vh'
    }} />
      
      {/* Radial accent overlays */}
      <div className="absolute inset-0 -z-10" style={{
      background: 'radial-gradient(circle at 30% 20%, hsl(var(--rust-base)/0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--rust-dark)/0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, hsl(var(--metal-light)/0.1) 0%, transparent 50%)',
      minHeight: '100vh'
    }} />
      {/* Glow */}
      <div className="absolute -z-10 left-1/2 top-1/3 h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="container mx-auto pt-8 md:pt-12 pb-16 px-4 md:px-8">
        {/* Industrial Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }} className="text-center mb-8 md:mb-11">
          <ElectricText text="SPARE PARTS UNIVERSE" className="text-2xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--amber-display))] 
                       tracking-wider bg-gradient-to-r from-[hsl(var(--amber-display))] 
                       via-[hsl(var(--amber-glow))] to-[hsl(var(--amber-display))] 
                       bg-clip-text text-transparent" />
          <p className="text-sm md:text-base text-[hsl(var(--metal-light))] mt-2 tracking-[0.2em] font-semibold">
            EXCLUSIVE ACCESS ONLY
          </p>
        </motion.div>

        {/* Wallet Status - positioned above machine */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.15
      }} className="flex justify-center mb-3 md:mb-2">
          <WalletStatus />
        </motion.div>

        {/* Social Media Buttons */}
        <SocialMediaButtons links={{
        instagram: "https://instagram.com/SparePartsUniverse",
        youtube: "https://youtube.com/@sparepartsuniverse",
        twitter: "https://X.com/SparePartsUniverse"
      }} />

        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2
      }} className="flex justify-center scale-125 md:scale-100">
          <h2 className="sr-only">Mint Spare Parts Machine NFT</h2>
          <MachineMint />
        </motion.div>
      </div>
      
      {/* Stats integrated within Hero section with no gap */}
      <div className="relative mt-0 pt-0">
        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }} className="relative z-10">
          <Stats />
        </motion.div>
      </div>

      {/* About section integrated with same industrial background */}
      <div className="relative mt-16 md:mt-12 pb-8">
        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="relative p-6 md:p-8 rounded-lg bg-gradient-to-br from-[hsl(var(--metal-dark)/0.8)] to-[hsl(var(--metal-base)/0.6)] 
                          border border-[hsl(var(--rust-base)/0.4)] backdrop-blur-sm
                          shadow-[0_8px_32px_hsl(var(--metal-dark)/0.4)]">
            {/* Rust accent overlay */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[hsl(var(--rust-dark)/0.1)] via-transparent to-[hsl(var(--rust-base)/0.1)] hidden" />
            
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--amber-display))] mb-4 tracking-wide">Rewards</h3>
              <p className="text-sm md:text-base text-[hsl(var(--metal-light))] leading-relaxed">Share a clip of your mint experience on X for a chance to win a FREE Limbot.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default Hero;