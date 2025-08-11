import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

export type MintStage = 'idle' | 'prepping' | 'minting' | 'success' | 'error';

interface LeverMachineProps {
  stage: MintStage;
  onPullEnd: () => void;
}

const LeverMachine = ({ stage, onPullEnd }: LeverMachineProps) => {
  const controls = useAnimation();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (stage === 'prepping' && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      (async () => {
        // Pull down
        await controls.start({ rotate: -35, transition: { type: 'spring', stiffness: 220, damping: 16 } });
        // Signal mint start
        onPullEnd();
        // Return lever to neutral
        await controls.start({ rotate: 0, transition: { type: 'spring', stiffness: 170, damping: 14, delay: 0.2 } });
      })();
    }
    if (stage === 'idle') {
      hasTriggeredRef.current = false;
    }
  }, [stage, controls, onPullEnd]);

  const knobFill =
    stage === 'success'
      ? 'hsl(var(--primary))'
      : stage === 'error'
      ? 'hsl(var(--destructive))'
      : 'hsl(var(--primary) / 0.85)';

  const glowClass =
    stage === 'success'
      ? 'shadow-[0_0_24px_hsl(var(--primary)/0.55)]'
      : stage === 'error'
      ? 'shadow-[0_0_18px_hsl(var(--destructive)/0.55)]'
      : 'shadow-none';

  return (
    <div className={`mx-auto w-full max-w-md rounded-xl border bg-background/40 p-4 ${glowClass}`}>
      <div className="flex items-center justify-center">
        <svg width="220" height="120" viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lever-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </linearGradient>
          </defs>

          {/* Base panel */}
          <rect x="10" y="60" width="200" height="40" rx="8" fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* Lights */}
          <rect x="25" y="70" width="60" height="20" rx="4" fill="hsl(var(--primary) / 0.12)" />
          <rect x="95" y="70" width="60" height="20" rx="4" fill="hsl(var(--primary) / 0.12)" />
          <rect x="165" y="70" width="30" height="20" rx="4" fill="hsl(var(--primary) / 0.12)" />

          {/* Lever group */}
          <motion.g style={{ originX: 180, originY: 40 }} animate={controls}>
            <line x1="180" y1="40" x2="180" y2="75" stroke="url(#lever-grad)" strokeWidth="8" strokeLinecap="round" />
            <circle cx="180" cy="30" r="12" fill={knobFill} />
          </motion.g>

          {/* Pivot */}
          <circle cx="180" cy="40" r="4" fill="hsl(var(--border))" />
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {stage === 'idle' && 'Ready to mint — pull the lever!'}
        {stage === 'prepping' && 'Lever engaged...'}
        {stage === 'minting' && 'Processing mint...'}
        {stage === 'success' && 'Success!'}
        {stage === 'error' && 'Something went wrong.'}
      </p>
    </div>
  );
};

export default LeverMachine;
