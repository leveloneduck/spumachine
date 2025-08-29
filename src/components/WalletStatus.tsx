import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const WalletStatus = () => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div className="flex flex-col items-center gap-2 text-center mb-8 md:mb-7">
      <Badge variant="outline" className="text-sm bg-muted/50">
        {connected
          ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
          : 'Connect your wallet to mint'}
      </Badge>

      {/* Wallet Connect Button */}
      <Button
        type="button"
        variant="mechanical"
        onClick={() => connected ? {} : setVisible(true)}
        className="h-10 md:h-12 w-auto px-4 md:px-6 shadow-[0_0_12px_hsl(var(--primary)/0.3)] border-primary/30 bg-background/80 backdrop-blur-sm hover:shadow-[0_0_16px_hsl(var(--primary)/0.4)] hover:border-primary/50 transition-all duration-200"
        aria-label={connected ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...` : 'Connect wallet'}
      >
        <span className="text-sm md:text-base text-primary">Select Wallet</span>
      </Button>
    </div>
  );
};