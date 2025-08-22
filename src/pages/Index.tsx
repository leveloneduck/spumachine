import Hero from '@/components/Hero';
import NeonFooter from '@/components/NeonFooter';


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main>
        <Hero />
      </main>
      <div className="relative min-h-[50vh]">
        {/* Base metallic industrial background matching hero */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[hsl(var(--metal-dark))] via-[hsl(var(--metal-base))] to-[hsl(var(--metal-dark))]" />
        
        {/* Industrial rust overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[hsl(var(--rust-dark)/0.4)] via-transparent to-[hsl(var(--rust-base)/0.3)]" />
        
        {/* Subtle radial accents */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--amber-glow)/0.1),transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--copper-base)/0.1),transparent_50%)]" />
        
        <section id="about" className="container mx-auto pt-8 pb-16 px-4 max-w-3xl relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--amber-display))]">About the Collection</h2>
          <p className="mt-4 text-[hsl(var(--metal-light))]">
            404 one-of-a-kind Limbots artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
          </p>
        </section>
        <NeonFooter />
      </div>
    </div>
  );
};

export default Index;
