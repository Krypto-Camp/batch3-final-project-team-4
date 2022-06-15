import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Moralis imports
 */
 import { MoralisProvider } from "react-moralis";


/**
 * Wagmi imports
 */
import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { infuraProvider } from 'wagmi/providers/infura';

const infuraId = process.env.REACT_APP_INFURA_ID


const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  [
    infuraProvider({ infuraId }),
    publicProvider()
  ],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider,
  webSocketProvider,
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <WagmiConfig client={client}>
        <MoralisProvider serverUrl="https://cdcg8synsq8t.usemoralis.com:2053/server" appId="s4jwyL58zTLhjq1IAtXtyFTZTyI31WrjbesWVCef">
          <App />
        </MoralisProvider>
      </WagmiConfig>
  </React.StrictMode>
);

