import { ShieldCheck, Zap, Lock, Rocket } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Candy Machine v3" },
  { icon: Zap, label: "Instant mint" },
  { icon: Lock, label: "On-chain metadata" },
  { icon: Rocket, label: "Low fees (Solana)" },
];

export default function BadgesStrip() {
  return (
    <section aria-label="Trust and technology badges" className="container mx-auto py-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 rounded-full bg-card/60 border px-3 py-1 text-xs text-muted-foreground hover-scale"
          >
            <Icon size={14} className="text-primary" aria-hidden />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
