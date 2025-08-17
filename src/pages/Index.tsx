import Hero from '@/components/Hero';
import NeonFooter from '@/components/NeonFooter';


const Index = () => {
  return (
    <div>
      <main>
        <Hero />
        <section id="about" className="container mx-auto pt-8 pb-4 px-4 max-w-3xl bg-background">
          <h2 className="text-2xl md:text-3xl font-bold">About the Collection</h2>
          <p className="mt-4 text-muted-foreground">
            404 one-of-a-kind cyberpunk artifacts. Each NFT is a portal into a neon-soaked future. Built on Solana using Candy Machine V3 for a smooth, secure minting flow.
          </p>
        </section>
      </main>
      <div className="bg-background">
        <NeonFooter />
      </div>
    </div>
  );
};

export default Index;
