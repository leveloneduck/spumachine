import { useState, useEffect } from 'react';
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
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Select Payment Method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* SOL Payment Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span>SOL Payment</span>
                  <Badge variant="secondary" className="ml-auto">Default</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-semibold">{solPrice} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className={`font-semibold ${balances.sol >= solPrice ? 'text-green-400' : 'text-red-400'}`}>
                    {balances.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${balances.sol.toFixed(4)} SOL`}
                  </span>
                </div>
                <Button 
                  onClick={() => handleSelectPayment('sol')}
                  className="w-full"
                  disabled={balances.loading || balances.sol < solPrice}
                >
                  Pay with SOL
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Payment Option */}
          {MINT_CONFIG.tokenPayment && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                      <Coins className="w-5 h-5 text-green-400" />
                    </div>
                    <span>{tokenSymbol} Payment</span>
                    <Badge variant="outline" className="ml-auto">Alternative</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-semibold">{tokenPrice} {tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Your Balance:</span>
                    <span className={`font-semibold ${balances.token >= tokenPrice ? 'text-green-400' : 'text-red-400'}`}>
                      {balances.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${balances.token.toLocaleString()} ${tokenSymbol}`}
                    </span>
                  </div>
                  
                  {/* Token Address Display */}
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Token Address:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(MINT_CONFIG.tokenPayment?.mintAddress || '', 'Token')}
                        className="h-6 px-2"
                      >
                        {copiedAddress === 'Token' ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <code className="text-xs font-mono block text-muted-foreground break-all">
                      {MINT_CONFIG.tokenPayment?.mintAddress}
                    </code>
                  </div>

                  <Button 
                    onClick={() => handleSelectPayment('token')}
                    className="w-full"
                    disabled={balances.loading || balances.token < tokenPrice}
                  >
                    Pay with {tokenSymbol}
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