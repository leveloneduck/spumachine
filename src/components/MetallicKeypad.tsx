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
      {/* Number buttons */}
      {numbers.slice(0, 9).map((num) => (
        <Button
          key={num}
          variant="mechanical"
          size="lg"
          onClick={() => onNumberClick(num)}
          disabled={disabled}
          className="h-16 w-16 text-xl font-mono bg-gradient-to-b from-muted/20 to-muted/40 
                     border border-border/50 shadow-lg hover:shadow-glow-neo/20 
                     transition-all duration-200 hover:scale-105 active:scale-95
                     hover:border-primary/50 hover:bg-gradient-to-b hover:from-primary/10 hover:to-primary/20"
        >
          {num}
        </Button>
      ))}
      
      {/* Bottom row with special buttons */}
      <Button
        variant="mechanical"
        size="lg"
        onClick={onClear}
        disabled={disabled}
        className="h-16 w-16 text-sm font-mono bg-gradient-to-b from-destructive/20 to-destructive/40 
                   border border-border/50 shadow-lg hover:shadow-destructive/20 
                   transition-all duration-200 hover:scale-105 active:scale-95
                   hover:border-destructive/50"
      >
        CLR
      </Button>
      
      <Button
        variant="mechanical"
        size="lg"
        onClick={() => onNumberClick('0')}
        disabled={disabled}
        className="h-16 w-16 text-xl font-mono bg-gradient-to-b from-muted/20 to-muted/40 
                   border border-border/50 shadow-lg hover:shadow-glow-neo/20 
                   transition-all duration-200 hover:scale-105 active:scale-95
                   hover:border-primary/50 hover:bg-gradient-to-b hover:from-primary/10 hover:to-primary/20"
      >
        0
      </Button>
      
      <Button
        variant="mechanical"
        size="lg"
        onClick={onBackspace}
        disabled={disabled}
        className="h-16 w-16 text-sm font-mono bg-gradient-to-b from-muted/20 to-muted/40 
                   border border-border/50 shadow-lg hover:shadow-glow-neo/20 
                   transition-all duration-200 hover:scale-105 active:scale-95
                   hover:border-primary/50"
      >
        ←
      </Button>
    </div>
  );
};

export default MetallicKeypad;