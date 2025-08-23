import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, Zap, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { MINT_CONFIG } from '@/config/mintConfig';

export type PaymentMethod = 'sol' | 'token';

interface PaymentMethodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPayment: (method: PaymentMethod) => void;
}

interface TokenBalance {
  sol: number;
  token: number;
  loading: boolean;
}

export function PaymentMethodSelector({ open, onOpenChange, onSelectPayment }: PaymentMethodSelectorProps) {
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();
  const [balances, setBalances] = useState<TokenBalance>({ sol: 0, token: 0, loading: true });
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) return;
    
    fetchBalances();
  }, [connected, publicKey]);

  const fetchBalances = async () => {
    if (!connected || !publicKey) return;
    
    setBalances(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch SOL balance and token balance
      const [{ createUmi }, { publicKey: umiPublicKey }, { fetchDigitalAsset }] = await Promise.all([
        import('@metaplex-foundation/umi-bundle-defaults'),
        import('@metaplex-foundation/umi'),
        import('@metaplex-foundation/mpl-token-metadata')
      ]);

      const umi = createUmi(MINT_CONFIG.rpcEndpoint || 'https://api.devnet.solana.com');
      
      // Get SOL balance
      const connection = umi.rpc;
      const solBalance = await connection.getBalance(umiPublicKey(publicKey.toString()));
      const solAmount = Number(solBalance) / 1e9; // Convert lamports to SOL

      // Get token balance (placeholder - replace with actual token mint)
      let tokenAmount = 0;
      if (MINT_CONFIG.tokenPayment?.mintAddress) {
        try {
          // This would fetch the actual token balance
          // For now, using placeholder
          tokenAmount = 1000; // Placeholder token balance
        } catch (e) {
          console.warn('Token balance fetch failed:', e);
        }
      }

      setBalances({ sol: solAmount, token: tokenAmount, loading: false });
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      setBalances({ sol: 0, token: 0, loading: false });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      toast({ title: 'Copied to clipboard', description: `${label} address copied` });
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleHoverStart = useCallback((cardId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredCard(cardId);
    }, 150); // 150ms delay to prevent oversensitive triggering
    setHoverTimeout(timeout);
  }, [hoverTimeout]);

  const handleHoverEnd = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredCard(null);
    }, 100); // Short delay on hover end
    setHoverTimeout(timeout);
  }, [hoverTimeout]);

  const handleSelectPayment = (method: PaymentMethod) => {
    const requiredAmount = method === 'sol' ? MINT_CONFIG.solPrice : MINT_CONFIG.tokenPayment?.amount || 0;
    const userBalance = method === 'sol' ? balances.sol : balances.token;

    if (userBalance < requiredAmount) {
      toast({ 
        title: 'Insufficient balance', 
        description: `You need ${requiredAmount} ${method === 'sol' ? 'SOL' : MINT_CONFIG.tokenPayment?.symbol || 'tokens'} to mint` 
      });
      return;
    }

    onSelectPayment(method);
    onOpenChange(false);
  };

  const solPrice = MINT_CONFIG.solPrice || 0.1;
  const tokenPrice = MINT_CONFIG.tokenPayment?.amount || 100;
  const tokenSymbol = MINT_CONFIG.tokenPayment?.symbol || 'TOKEN';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[hsl(var(--metal-dark)/0.95)] to-[hsl(var(--metal-base)/0.9)] backdrop-blur-sm border-2 border-[hsl(var(--rust-base)/0.6)] shadow-[0_0_40px_hsl(var(--amber-glow)/0.3)]">
        {/* Rust overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[hsl(var(--rust-dark)/0.1)] via-transparent to-[hsl(var(--rust-base)/0.1)]" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center text-xl font-bold text-[hsl(var(--amber-display))] drop-shadow-[0_0_20px_hsl(var(--amber-glow)/0.4)] tracking-wide">
            SELECT PAYMENT METHOD
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 relative z-10">
          {/* SOL Payment Option */}
          <motion.div
            animate={{ 
              scale: hoveredCard === 'sol' ? 1.01 : 1,
              y: hoveredCard === 'sol' ? -2 : 0
            }}
            whileTap={{ scale: 0.99 }}
            onHoverStart={() => handleHoverStart('sol')}
            onHoverEnd={handleHoverEnd}
            transition={{ 
              duration: 0.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{ 
              willChange: 'transform',
              transform: 'translateZ(0)' // GPU acceleration
            }}
            className="p-1 rounded-lg" // Extra padding for stable hover zone
          >
             <Card className="cursor-pointer border-2 border-[hsl(var(--rust-base)/0.4)] hover:border-[hsl(var(--amber-glow)/0.6)] transition-all duration-200 bg-gradient-to-br from-[hsl(var(--metal-base)/0.6)] to-[hsl(var(--metal-dark)/0.8)] shadow-[0_4px_20px_hsl(var(--metal-dark)/0.5)] payment-card">
              {/* Inner rust accent */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[hsl(var(--rust-dark)/0.05)] via-transparent to-[hsl(var(--rust-base)/0.05)]" />
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="flex items-center gap-3 text-[hsl(var(--metal-light))]">
                  <div className="p-2 bg-gradient-to-br from-[hsl(var(--amber-glow)/0.3)] to-[hsl(var(--amber-display)/0.2)] rounded-lg border border-[hsl(var(--rust-base)/0.3)]">
                    <Zap className="w-5 h-5 text-[hsl(var(--amber-display))]" />
                  </div>
                  <span className="font-bold tracking-wide">$SOL PAYMENT</span>
                  <Badge variant="secondary" className="ml-auto bg-[hsl(var(--rust-base)/0.3)] text-[hsl(var(--amber-display))] border-[hsl(var(--rust-base)/0.5)]">DEFAULT</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--metal-light)/0.8)]">Cost:</span>
                  <span className="font-bold text-[hsl(var(--amber-display))]">{solPrice} $SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--metal-light)/0.8)]">Your Balance:</span>
                  <span className={`font-bold ${balances.sol >= solPrice ? 'text-[hsl(var(--amber-glow))]' : 'text-[hsl(var(--rust-base))]'}`}>
                    {balances.loading ? <Loader2 className="w-4 h-4 animate-spin text-[hsl(var(--amber-glow))]" /> : `${balances.sol.toFixed(4)} $SOL`}
                  </span>
                </div>
                <Button 
                  variant="mechanical"
                  onClick={() => handleSelectPayment('sol')}
                  className="w-full font-bold tracking-wide"
                  disabled={balances.loading || balances.sol < solPrice}
                >
                  PAY WITH $SOL
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Payment Option */}
          {MINT_CONFIG.tokenPayment && (
            <motion.div
              animate={{ 
                scale: hoveredCard === 'token' ? 1.01 : 1,
                y: hoveredCard === 'token' ? -2 : 0
              }}
              whileTap={{ scale: 0.99 }}
              onHoverStart={() => handleHoverStart('token')}
              onHoverEnd={handleHoverEnd}
              transition={{ 
                duration: 0.2, 
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              style={{ 
                willChange: 'transform',
                transform: 'translateZ(0)' // GPU acceleration
              }}
              className="p-1 rounded-lg" // Extra padding for stable hover zone
            >
              <Card className="cursor-pointer border-2 border-[hsl(var(--rust-base)/0.4)] hover:border-[hsl(var(--amber-glow)/0.6)] transition-all duration-200 bg-gradient-to-br from-[hsl(var(--metal-base)/0.6)] to-[hsl(var(--metal-dark)/0.8)] shadow-[0_4px_20px_hsl(var(--metal-dark)/0.5)] payment-card">
                {/* Inner rust accent */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[hsl(var(--rust-dark)/0.05)] via-transparent to-[hsl(var(--rust-base)/0.05)]" />
                
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="flex items-center gap-3 text-[hsl(var(--metal-light))]">
                    <div className="p-2 bg-gradient-to-br from-[hsl(var(--rust-base)/0.4)] to-[hsl(var(--rust-dark)/0.3)] rounded-lg border border-[hsl(var(--rust-base)/0.5)]">
                      <Coins className="w-5 h-5 text-[hsl(var(--amber-display))]" />
                    </div>
                    <span className="font-bold tracking-wide">{tokenSymbol} PAYMENT</span>
                    <Badge variant="outline" className="ml-auto border-[hsl(var(--rust-base)/0.5)] text-[hsl(var(--amber-display))] bg-transparent">ALTERNATIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[hsl(var(--metal-light)/0.8)]">Cost:</span>
                    <span className="font-bold text-[hsl(var(--amber-display))]">{tokenPrice} {tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[hsl(var(--metal-light)/0.8)]">Your Balance:</span>
                    <span className={`font-bold ${balances.token >= tokenPrice ? 'text-[hsl(var(--amber-glow))]' : 'text-[hsl(var(--rust-base))]'}`}>
                      {balances.loading ? <Loader2 className="w-4 h-4 animate-spin text-[hsl(var(--amber-glow))]" /> : `${balances.token.toLocaleString()} ${tokenSymbol}`}
                    </span>
                  </div>
                  
                  {/* Token Address Display */}
                  <div className="p-3 bg-gradient-to-br from-[hsl(var(--metal-dark)/0.6)] to-[hsl(var(--metal-base)/0.4)] rounded-lg border border-[hsl(var(--rust-base)/0.3)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[hsl(var(--metal-light)/0.7)] font-medium">TOKEN ADDRESS:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(MINT_CONFIG.tokenPayment?.mintAddress || '', 'Token')}
                        className="h-6 px-2 hover:bg-[hsl(var(--rust-base)/0.2)] text-[hsl(var(--amber-display))]"
                      >
                        {copiedAddress === 'Token' ? (
                          <Check className="w-3 h-3 text-[hsl(var(--amber-glow))]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <code className="text-xs font-mono block text-[hsl(var(--metal-light)/0.6)] break-all bg-[hsl(var(--metal-dark)/0.4)] p-2 rounded border border-[hsl(var(--rust-base)/0.2)]">
                      {MINT_CONFIG.tokenPayment?.mintAddress}
                    </code>
                  </div>

                  <Button 
                    variant="mechanical"
                    onClick={() => handleSelectPayment('token')}
                    className="w-full font-bold tracking-wide"
                    disabled={balances.loading || balances.token < tokenPrice}
                  >
                    PAY WITH {tokenSymbol}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}