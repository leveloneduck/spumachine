import heroImage from '@/assets/hero-neon.jpg';
import { motion } from 'framer-motion';
import MintPanel from '@/components/MintPanel';

const Hero = () => {
  return (
      <section
        className="relative isolate overflow-hidden min-h-[100svh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-background/70 pointer-events-none" />
        <div className="container mx-auto pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <h1 className="mt-0 text-center text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Spare Parts Universe : Introduces The First Exclusive Collection
          </h1>
          <MintPanel />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
