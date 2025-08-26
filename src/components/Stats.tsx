import { Progress } from '@/components/ui/progress';
import { useCandyMachine } from '@/hooks/useCandyMachine';
import { motion } from 'framer-motion';

const Stats = () => {
  const { stats, loading, error } = useCandyMachine();
  const percent = Math.min(100, Math.max(0, (stats.minted / stats.total) * 100));

  return (
    <section className="container mx-auto pb-0 relative z-10 px-6 sm:px-4 -mt-8 md:-mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.5 }} 
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 max-w-[240px] sm:max-w-3xl mx-auto"
      >
        <div className="metal-holes relative rounded-xl p-3 sm:p-6 overflow-hidden
                        bg-gradient-to-b from-[hsl(var(--metal-base))] via-[hsl(var(--metal-dark))] to-[hsl(var(--metal-base))]
                        border-2 border-[hsl(var(--metal-light)/0.3)]
                        shadow-[0_4px_0_hsl(var(--metal-dark)),0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_hsl(var(--metal-light)/0.2)]
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.1)] before:via-transparent before:to-[hsl(var(--rust-dark)/0.15)]
                        after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--metal-light)/0.3)]">
          <div className="corner-hole-tl"></div>
          <div className="corner-hole-tr"></div>
          <div className="corner-hole-bl"></div>
          <div className="corner-hole-br"></div>
          <p className="text-sm text-[hsl(var(--metal-light))] relative z-10">Minted</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-[hsl(var(--amber-display))] relative z-10">{loading ? '...' : stats.minted}</p>
        </div>
        <div className="metal-holes relative rounded-xl p-3 sm:p-6 overflow-hidden
                        bg-gradient-to-b from-[hsl(var(--metal-base))] via-[hsl(var(--metal-dark))] to-[hsl(var(--metal-base))]
                        border-2 border-[hsl(var(--metal-light)/0.3)]
                        shadow-[0_4px_0_hsl(var(--metal-dark)),0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_hsl(var(--metal-light)/0.2)]
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.15)] before:to-transparent
                        after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--metal-light)/0.3)]">
          <div className="corner-hole-tl"></div>
          <div className="corner-hole-tr"></div>
          <div className="corner-hole-bl"></div>
          <div className="corner-hole-br"></div>
          <p className="text-sm text-[hsl(var(--metal-light))] relative z-10">Remaining</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-[hsl(var(--amber-display))] relative z-10">{loading ? '...' : stats.remaining}</p>
        </div>
        <div className="metal-holes relative rounded-xl p-3 sm:p-6 overflow-hidden
                        bg-gradient-to-b from-[hsl(var(--metal-base))] via-[hsl(var(--metal-dark))] to-[hsl(var(--metal-base))]
                        border-2 border-[hsl(var(--metal-light)/0.3)]
                        shadow-[0_4px_0_hsl(var(--metal-dark)),0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_hsl(var(--metal-light)/0.2)]
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.1)] before:to-transparent
                        after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--metal-light)/0.3)]">
          <div className="corner-hole-tl"></div>
          <div className="corner-hole-tr"></div>
          <div className="corner-hole-bl"></div>
          <div className="corner-hole-br"></div>
          <p className="text-sm text-[hsl(var(--metal-light))] relative z-10">Progress</p>
          <div className="mt-4 relative z-10">
            <Progress value={percent} className="[&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--amber-glow))] [&>div]:to-[hsl(var(--rust-glow))] bg-[hsl(var(--metal-dark)/0.3)]" />
            <p className="mt-2 text-sm text-[hsl(var(--metal-light))]">{loading ? 'Loading...' : `${percent.toFixed(1)}%`}</p>
          </div>
        </div>
      </motion.div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </section>
  );
};

export default Stats;
