import heroImage from '@/assets/hero-neon.jpg';
import { motion } from 'framer-motion';
import MintPanel from '@/components/MintPanel';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="Cyberpunk neon cityscape hero for 404 NFT mint" loading="eager" className="h-[60vh] w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="container mx-auto py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <h1 className="sr-only">Mint the 404 Cyberpunk Collection</h1>
          <MintPanel />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
