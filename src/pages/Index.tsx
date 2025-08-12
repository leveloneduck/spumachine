import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

import NeonFooter from '@/components/NeonFooter';


const Index = () => {
  return (
    <div>
      <main>
        <Hero />
        <div style={{ background: 'var(--page-after-bg, hsl(var(--muted)))' }}>
          <Stats />
          <section id="about" className="container mx-auto py-16 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold">About the Collection</h2>
            <p className="mt-4 text-muted-foreground">
              404 one-of-a-kind cyberpunk artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
            </p>
          </section>
        </div>
      </main>
      <div style={{ background: 'var(--page-after-bg, hsl(var(--muted)))' }}>
        <NeonFooter />
      </div>
    </div>
  );
};

export default Index;
