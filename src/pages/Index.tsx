import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import MintPanel from '@/components/MintPanel';
import NeonFooter from '@/components/NeonFooter';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Index = () => {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <WalletMultiButton className="!rounded-full !px-5 !py-2.5 !bg-gradient-to-r !from-primary !to-primary/80 !text-primary-foreground hover:!from-primary/90 hover:!to-primary/70 !border !border-primary/40 !shadow-[0_0_30px_hsl(var(--primary-glow)/0.35)] hover:!shadow-[0_0_40px_hsl(var(--primary-glow)/0.5)] hover-scale" />
      </div>
      <main>
        <Hero />
        <Stats />
        <MintPanel />
        <section id="about" className="container mx-auto py-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold">About the Collection</h2>
          <p className="mt-4 text-muted-foreground">
            404 one-of-a-kind cyberpunk artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
          </p>
        </section>
      </main>
      <NeonFooter />
    </div>
  );
};

export default Index;
