import heroImage from '@/assets/hero-neon.jpg';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Mint the 404 Cyberpunk Collection
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            404 unique NFTs forged in neon. Connect your wallet and claim yours before they disappear.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild size="lg" className="hover-scale">
              <a href="#mint">Mint Now</a>
            </Button>
            <a href="#about" className="story-link text-sm">Learn more</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
