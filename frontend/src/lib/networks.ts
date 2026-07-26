/**
 * Configuración de redes admitidas por la DApp.
 * La red activa se elige con NEXT_PUBLIC_CHAIN_ID (default: Anvil 31337).
 */

export type NetworkConfig = {
  chainId: number;
  chainIdHex: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls?: string[];
};

export const NETWORKS: Record<number, NetworkConfig> = {
  31337: {
    chainId: 31337,
    chainIdHex: '0x7a69',
    chainName: 'Localhost 8545',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  11155111: {
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: [
      process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia.org',
      'https://ethereum-sepolia-rpc.publicnode.com',
    ],
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};

const parsedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337);

export const EXPECTED_CHAIN_ID =
  Number.isFinite(parsedChainId) && NETWORKS[parsedChainId]
    ? parsedChainId
    : 31337;

export const EXPECTED_NETWORK: NetworkConfig = NETWORKS[EXPECTED_CHAIN_ID];
