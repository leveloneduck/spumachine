export type NetworkType = 'devnet' | 'mainnet-beta';
export type VisualMode = 'svg' | '3d';

export interface TokenPaymentConfig {
  mintAddress: string;
  amount: number;
  symbol: string;
  destinationAta?: string; // Where tokens get sent
}

export const MINT_CONFIG = {
  collectionName: '404 Limbots Collection',
  totalItems: 404,
  // REPLACE WITH YOUR ACTUAL CORE CANDY MACHINE ID (32-44 character base58 string)
  candyMachineId: 'REPLACE_WITH_YOUR_CORE_CANDY_MACHINE_ID',
  // Collection address for Core assets (required for Core Candy Machine)
  collectionAddress: 'REPLACE_WITH_COLLECTION_ADDRESS',
  // SOL payment amount (for SOL payment guard)
  solPrice: 0.1,
  // Token payment configuration (for Token Payment guard)
  tokenPayment: {
    mintAddress: 'REPLACE_WITH_TOKEN_MINT_ADDRESS',
    amount: 100, // Number of tokens required
    symbol: '$SPU',
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
  // Core-specific metadata configuration
  coreAssetConfig: {
    name: 'Limbot #',
    symbol: 'LIMBOT',
    description: 'A unique Limbot from the 404 Collection',
    sellerFeeBasisPoints: 500, // 5%
    isCollection: false,
    isMutable: true,
  },
};

export const getRpcEndpoint = () => {
  if (MINT_CONFIG.rpcEndpoint) return MINT_CONFIG.rpcEndpoint;
  return MINT_CONFIG.network === 'devnet'
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
};
