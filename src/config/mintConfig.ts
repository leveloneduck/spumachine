export type NetworkType = 'devnet' | 'mainnet-beta';
export type VisualMode = 'svg' | '3d';

export interface TokenPaymentConfig {
  mintAddress: string;
  amount: number;
  symbol: string;
  destinationAta?: string; // Where tokens get sent
}

export const MINT_CONFIG = {
  collectionName: '404 Cyberpunk Collection',
  totalItems: 404,
  // REPLACE WITH YOUR ACTUAL CANDY MACHINE ID (32-44 character base58 string)
  candyMachineId: 'REPLACE_WITH_YOUR_CANDY_MACHINE_ID',
  // SOL payment amount (for SOL guard)
  solPrice: 0.1,
  // Token payment configuration (for Token Payment guard)
  tokenPayment: {
    mintAddress: 'REPLACE_WITH_TOKEN_MINT_ADDRESS',
    amount: 100, // Number of tokens required
    symbol: 'CYBER',
    destinationAta: undefined, // Optional: specific destination for tokens
  } as TokenPaymentConfig,
  // Optional: if you use a specific guard group, set it here
  guardGroupLabel: undefined as string | undefined,
  // Choose your network
  network: 'devnet' as NetworkType,
  // Optional custom RPC, otherwise we use public devnet/mainnet endpoints
  rpcEndpoint: '',
  // Visual mode for the lever UI: 'svg' (default) or '3d'
  visualMode: 'svg' as VisualMode,
};

export const getRpcEndpoint = () => {
  if (MINT_CONFIG.rpcEndpoint) return MINT_CONFIG.rpcEndpoint;
  return MINT_CONFIG.network === 'devnet'
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
};
