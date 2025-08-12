import { Cpu, Layers, Sparkles } from "lucide-react";

const features = [
  { icon: Cpu, title: "Provably Fair", desc: "Transparent minting powered by Candy Machine v3." },
  { icon: Layers, title: "Unique Artifacts", desc: "Each piece is one-of-a-kind, 404 total." },
  { icon: Sparkles, title: "Gas‑efficient", desc: "Fast, inexpensive mints on Solana." },
];

export default function FeaturesGrid() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-muted/30">
      <div className="container mx-auto py-16">
        <h2 id="features-title" className="sr-only">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f) => (
            <article key={f.title} className="rounded-xl bg-card/60 glow-border p-6">
              <f.icon className="text-primary" size={20} aria-hidden />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
