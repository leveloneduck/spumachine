import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NeonHeader = () => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 story-link">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/20 glow-border">
            <Sparkles className="text-primary" size={18} />
          </span>
          <span className="font-semibold tracking-wide">SPU: Limbots</span>
        </Link>
        <div className="flex items-center gap-3">
          <a href="#mint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mint</a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          <WalletMultiButton className="wallet-adapter-button !bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-md !border !border-primary/40 !shadow-[0_0_30px_hsl(var(--primary-glow)/0.2)]" />
        </div>
      </nav>
    </header>
  );
};

export default NeonHeader;
