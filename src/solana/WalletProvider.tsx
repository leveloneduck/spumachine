import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { MINT_CONFIG, getRpcEndpoint } from '@/config/mintConfig';

import '@solana/wallet-adapter-react-ui/styles.css';

interface ProviderProps { children: ReactNode }

export const SolanaWalletProvider: FC<ProviderProps> = ({ children }) => {
  const network = (MINT_CONFIG.network as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
  const endpoint = getRpcEndpoint();

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      new SolflareWalletAdapter({ network })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
