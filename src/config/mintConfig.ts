export type NetworkType = 'devnet' | 'mainnet-beta';

export const MINT_CONFIG = {
  collectionName: '404 Cyberpunk Collection',
  totalItems: 404,
  // Add your Candy Machine ID here (base58)
  candyMachineId: '',
  // Optional: if you use a specific guard group, set it here
  guardGroupLabel: undefined as string | undefined,
  // Choose your network
  network: 'devnet' as NetworkType,
  // Optional custom RPC, otherwise we use public devnet/mainnet endpoints
  rpcEndpoint: ''
};

export const getRpcEndpoint = () => {
  if (MINT_CONFIG.rpcEndpoint) return MINT_CONFIG.rpcEndpoint;
  return MINT_CONFIG.network === 'devnet'
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
};
