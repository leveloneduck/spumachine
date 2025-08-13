import { Progress } from '@/components/ui/progress';
import { useCandyMachine } from '@/hooks/useCandyMachine';
import { motion } from 'framer-motion';

const Stats = () => {
  const { stats, loading, error } = useCandyMachine();
  const percent = Math.min(100, Math.max(0, (stats.minted / stats.total) * 100));

  return (
    <section className="container mx-auto pb-0 -mt-8 md:-mt-12">
      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-card/60 glow-border p-6">
          <p className="text-sm text-muted-foreground">Minted</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : stats.minted}</p>
        </div>
        <div className="rounded-xl bg-card/60 glow-border p-6">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="mt-2 text-3xl font-bold">{loading ? '...' : stats.remaining}</p>
        </div>
        <div className="rounded-xl bg-card/60 glow-border p-6">
          <p className="text-sm text-muted-foreground">Progress</p>
          <div className="mt-4">
            <Progress value={percent} />
            <p className="mt-2 text-sm text-muted-foreground">{loading ? 'Loading...' : `${percent.toFixed(1)}%`}</p>
          </div>
        </div>
      </motion.div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </section>
  );
};

export default Stats;
