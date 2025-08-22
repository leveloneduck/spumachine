# SPU: Limbots Collection

## About the Project

SPU: Limbots is an exclusive NFT collection from the Spare Parts Universe. This immersive minting experience combines industrial aesthetics with cutting-edge Solana blockchain technology.

**Collection Details:**
- **Total Supply:** 404 unique Limbots
- **Blockchain:** Solana
- **Technology:** Candy Machine V3
- **Payment Options:** SOL or $SPU tokens

## Features

- **Interactive Machine Interface:** Industrial-themed minting experience
- **Dual Payment System:** Support for both SOL and $SPU token payments
- **Real-time Statistics:** Live minting progress and collection stats
- **Mobile Optimized:** Fully responsive design for all devices
- **Immersive Experience:** Video integration and smooth animations

## Technology Stack

This project is built with modern web technologies:

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Build Tool:** Vite for fast development and optimized builds
- **UI Components:** shadcn/ui component library
- **Blockchain:** Solana Web3.js and Metaplex Candy Machine V3
- **Wallet Integration:** Solana Wallet Adapter

## Development Setup

### Prerequisites

- Node.js 18+ and npm installed
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd spu-limbots

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Configuration

Before deploying, update the configuration in `src/config/mintConfig.ts`:

```typescript
export const MINT_CONFIG = {
  // Replace with your actual Candy Machine ID
  candyMachineId: 'YOUR_CANDY_MACHINE_ID',
  
  // Configure $SPU token payment
  tokenPayment: {
    mintAddress: 'YOUR_SPU_TOKEN_MINT_ADDRESS',
    amount: 100, // Amount of $SPU tokens required
    symbol: '$SPU',
  },
  
  // Other configuration options...
};
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy

The built files in the `dist` folder can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── MachineMint.tsx # Main minting interface
│   └── ...
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── solana/             # Solana/wallet integration
└── styles/             # Global styles and design tokens
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the Spare Parts Universe ecosystem.

## Support

For questions and support, please contact the SPU team or visit our community channels.

---

*Built with passion for the Spare Parts Universe community*
