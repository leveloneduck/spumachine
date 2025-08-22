import Hero from '@/components/Hero';
import NeonFooter from '@/components/NeonFooter';


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main>
        <Hero />
      </main>
      <section id="about" className="container mx-auto pt-8 pb-8 px-4 max-w-3xl relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--amber-display))]">About the Collection</h2>
        <p className="mt-4 text-[hsl(var(--metal-light))]">
          404 one-of-a-kind Limbots artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
        </p>
      </section>
      <NeonFooter />
    </div>
  );
};

export default Index;
