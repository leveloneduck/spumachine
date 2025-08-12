import { useEffect } from 'react';
import NeonHeader from '@/components/NeonHeader';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import BadgesStrip from '@/components/BadgesStrip';
import FeaturesGrid from '@/components/FeaturesGrid';
import FAQ from '@/components/FAQ';
import NeonFooter from '@/components/NeonFooter';

const Index = () => {
  useEffect(() => {
    document.title = 'Mint 404 Cyberpunk Artifacts | Solana Candy Machine';
    const desc = 'Mint 404 one-of-a-kind cyberpunk artifacts on Solana. Candy Machine v3. Fast, secure, on-chain.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  return (
    <>
      <NeonHeader />
      <main>
        <Hero />
        <Stats />
        <BadgesStrip />
        <FeaturesGrid />
        <section id="about" className="container mx-auto py-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold">About the Collection</h2>
          <p className="mt-4 text-muted-foreground">
            404 one-of-a-kind cyberpunk artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
          </p>
        </section>
        <FAQ />
      </main>
      <NeonFooter />
    </>
  );
};

export default Index;
