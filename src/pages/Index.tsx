import Hero from '@/components/Hero';
import NeonFooter from '@/components/NeonFooter';


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main>
        <Hero />
      </main>
      <div className="gradient-cyberpunk-bg min-h-[50vh] relative">
        {/* Gradient overlay effects */}
        <div className="absolute inset-0 bg-gradient-radial-primary opacity-20" />
        <div className="absolute inset-0 bg-gradient-radial-accent opacity-15" />
        
        <section id="about" className="container mx-auto pt-8 pb-16 px-4 max-w-3xl relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text-subtle">About the Collection</h2>
          <p className="mt-4 text-muted-foreground">
            404 exclusive limbots from the Spare Parts Universe. Each NFT is a unique mechanical being with distinct characteristics. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
          </p>
        </section>
        <NeonFooter />
      </div>
    </div>
  );
};

export default Index;
