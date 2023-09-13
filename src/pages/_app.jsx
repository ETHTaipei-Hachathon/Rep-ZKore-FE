import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { ThemeProvider } from '@mui/material/styles';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, mainnet, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import theme from '../theme';

const { chains, provider } = configureChains(
  [mainnet, goerli, polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  // PolyDraw appName & projectId
  appName: 'PolyDraw',
  projectId: '797094a993c03074bb359fac45f6d6df',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
