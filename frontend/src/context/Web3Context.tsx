'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EXPECTED_CHAIN_ID, EXPECTED_NETWORK } from '@/lib/networks';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  expectedChainId: number;
  expectedNetworkName: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const loadChainId = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const hexChainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(hexChainId, 16));
      } catch (error) {
        console.error('Error reading chainId:', error);
      }
    }
  };

  useEffect(() => {
    const savedAccount = localStorage.getItem('web3_account');
    if (savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
      checkConnection();
    }

    loadChainId();

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', (hexChainId: string) => {
        setChainId(parseInt(hexChainId, 16));
      });
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('web3_account', accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount(null);
      localStorage.removeItem('web3_account');
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      localStorage.setItem('web3_account', accounts[0]);
    }
  };

  const connect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('web3_account', accounts[0]);
        }
        await loadChainId();
      } catch (error) {
        console.error('Error connecting:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask no está instalado');
    }
  };

  const switchNetwork = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask no está instalado');
    }
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: EXPECTED_NETWORK.chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: EXPECTED_NETWORK.chainIdHex,
              chainName: EXPECTED_NETWORK.chainName,
              nativeCurrency: EXPECTED_NETWORK.nativeCurrency,
              rpcUrls: EXPECTED_NETWORK.rpcUrls,
              blockExplorerUrls: EXPECTED_NETWORK.blockExplorerUrls || [],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    localStorage.removeItem('web3_account');
  };

  const isCorrectNetwork = chainId === EXPECTED_CHAIN_ID;

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        account,
        chainId,
        isCorrectNetwork,
        expectedChainId: EXPECTED_CHAIN_ID,
        expectedNetworkName: EXPECTED_NETWORK.chainName,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
