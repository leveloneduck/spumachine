import { motion } from 'framer-motion';
import MachineMint from '@/components/MachineMint';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Soft gradient background and glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background" />
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
