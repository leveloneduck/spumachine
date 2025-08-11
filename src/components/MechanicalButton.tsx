import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MechanicalButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <Button
      variant="mechanical"
      className={cn('relative', className)}
      {...props}
    >
      {/* Rivets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-3 md:size-3.5 rounded-full bg-border/80 ring-1 ring-inset ring-background/40 shadow-[inset_0_1px_1px_hsl(var(--background)/0.5),0_1px_0_hsl(var(--foreground)/0.2)] top-1/2 -translate-y-1/2 left-2"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-3 md:size-3.5 rounded-full bg-border/80 ring-1 ring-inset ring-background/40 shadow-[inset_0_1px_1px_hsl(var(--background)/0.5),0_1px_0_hsl(var(--foreground)/0.2)] top-1/2 -translate-y-1/2 right-2"
      />
      {children}
    </Button>
  );
};

export default MechanicalButton;
