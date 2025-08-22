import React from 'react';
import { Button } from '@/components/ui/button';

interface MetallicKeypadProps {
  onNumberClick: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

const MetallicKeypad: React.FC<MetallicKeypadProps> = ({
  onNumberClick,
  onBackspace,
  onClear,
  disabled = false
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
      {/* Number buttons - Heavy Industrial Steel */}
      {numbers.slice(0, 9).map((num) => (
        <Button
          key={num}
          variant="mechanical"
          size="lg"
          onClick={() => onNumberClick(num)}
          disabled={disabled}
          className="h-18 w-18 text-2xl font-mono font-bold
                     bg-gradient-to-b from-[hsl(var(--steel-light))] via-[hsl(var(--steel-base))] to-[hsl(var(--steel-light))]
                     border-2 border-[hsl(var(--metal-light))] text-[hsl(var(--amber-display))]
                     shadow-[0_3px_0_hsl(var(--metal-dark)),0_6px_12px_rgba(0,0,0,0.5),inset_0_1px_0_hsl(var(--steel-light)/0.3)]
                     hover:shadow-[0_1px_0_hsl(var(--metal-dark)),0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_hsl(var(--steel-light)/0.3),0_0_12px_hsl(var(--amber-glow)/0.2)]
                     hover:translate-y-[2px] hover:border-[hsl(var(--amber-glow)/0.4)]
                     active:translate-y-[3px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]
                     transition-all duration-100
                     relative overflow-hidden
                     before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.08)] before:via-transparent before:to-[hsl(var(--rust-dark)/0.15)]
                     after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--steel-light)/0.4)]
                     [&::before]:bg-[radial-gradient(circle_at_20%_30%,hsl(var(--rust-base)/0.1),transparent_40%),linear-gradient(135deg,transparent_20%,hsl(var(--rust-dark)/0.05)_40%,transparent_80%)]
                     disabled:opacity-60 disabled:translate-y-0"
        >
          {num}
        </Button>
      ))}
      
      {/* Bottom row with special buttons */}
      {/* CLR Button - Brass Warning */}
      <Button
        variant="mechanical"
        size="lg"
        onClick={onClear}
        disabled={disabled}
        className="h-18 w-18 text-sm font-mono font-bold uppercase
                   bg-gradient-to-b from-[hsl(var(--brass-base))] via-[hsl(var(--copper-base))] to-[hsl(var(--brass-base))]
                   border-2 border-[hsl(var(--rust-base))] text-[hsl(var(--metal-dark))]
                   shadow-[0_3px_0_hsl(var(--metal-dark)),0_6px_12px_rgba(0,0,0,0.5),inset_0_1px_0_hsl(var(--brass-base)/0.6)]
                   hover:shadow-[0_1px_0_hsl(var(--metal-dark)),0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_hsl(var(--brass-base)/0.6),0_0_12px_hsl(var(--rust-glow)/0.3)]
                   hover:translate-y-[2px] hover:border-[hsl(var(--rust-glow))]
                   active:translate-y-[3px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]
                   transition-all duration-100
                   relative overflow-hidden
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-light)/0.15)] before:to-transparent
                   [&::before]:bg-[radial-gradient(circle_at_70%_20%,hsl(var(--rust-base)/0.2),transparent_50%),linear-gradient(45deg,transparent_30%,hsl(var(--rust-dark)/0.1)_60%,transparent_90%)]
                   disabled:opacity-60 disabled:translate-y-0"
      >
        CLR
      </Button>
      
      {/* 0 Button - Steel */}
      <Button
        variant="mechanical"
        size="lg"
        onClick={() => onNumberClick('0')}
        disabled={disabled}
        className="h-18 w-18 text-2xl font-mono font-bold
                   bg-gradient-to-b from-[hsl(var(--steel-light))] via-[hsl(var(--steel-base))] to-[hsl(var(--steel-light))]
                   border-2 border-[hsl(var(--metal-light))] text-[hsl(var(--amber-display))]
                   shadow-[0_3px_0_hsl(var(--metal-dark)),0_6px_12px_rgba(0,0,0,0.5),inset_0_1px_0_hsl(var(--steel-light)/0.3)]
                   hover:shadow-[0_1px_0_hsl(var(--metal-dark)),0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_hsl(var(--steel-light)/0.3),0_0_12px_hsl(var(--amber-glow)/0.2)]
                   hover:translate-y-[2px] hover:border-[hsl(var(--amber-glow)/0.4)]
                   active:translate-y-[3px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]
                   transition-all duration-100
                   relative overflow-hidden
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-base)/0.08)] before:via-transparent before:to-[hsl(var(--rust-dark)/0.15)]
                   after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-[hsl(var(--steel-light)/0.4)]
                   [&::before]:bg-[radial-gradient(circle_at_80%_70%,hsl(var(--rust-base)/0.1),transparent_40%),linear-gradient(225deg,transparent_10%,hsl(var(--rust-dark)/0.05)_30%,transparent_70%)]
                   disabled:opacity-60 disabled:translate-y-0"
      >
        0
      </Button>
      
      {/* Backspace Button - Copper */}
      <Button
        variant="mechanical"
        size="lg"
        onClick={onBackspace}
        disabled={disabled}
        className="h-18 w-18 text-xl font-mono font-bold
                   bg-gradient-to-b from-[hsl(var(--copper-base))] via-[hsl(var(--rust-base))] to-[hsl(var(--copper-base))]
                   border-2 border-[hsl(var(--rust-dark))] text-[hsl(var(--amber-display))]
                   shadow-[0_3px_0_hsl(var(--metal-dark)),0_6px_12px_rgba(0,0,0,0.5),inset_0_1px_0_hsl(var(--copper-base)/0.4)]
                   hover:shadow-[0_1px_0_hsl(var(--metal-dark)),0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_hsl(var(--copper-base)/0.4),0_0_12px_hsl(var(--rust-glow)/0.2)]
                   hover:translate-y-[2px] hover:border-[hsl(var(--rust-glow)/0.6)]
                   active:translate-y-[3px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]
                   transition-all duration-100
                   relative overflow-hidden
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-[hsl(var(--rust-light)/0.15)] before:to-transparent
                   [&::before]:bg-[radial-gradient(circle_at_40%_80%,hsl(var(--rust-base)/0.2),transparent_60%),linear-gradient(315deg,transparent_20%,hsl(var(--rust-dark)/0.1)_50%,transparent_80%)]
                   disabled:opacity-60 disabled:translate-y-0"
      >
        ⌫
      </Button>
    </div>
  );
};

export default MetallicKeypad;