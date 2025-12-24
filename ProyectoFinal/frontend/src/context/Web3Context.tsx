'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
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

  useEffect(() => {
    // Cargar estado desde localStorage
    const savedAccount = localStorage.getItem('web3_account');
    if (savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
      checkConnection();
    }

    // Detectar cambios de cuenta
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
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
      } catch (error) {
        console.error('Error connecting:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask no está instalado');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    localStorage.removeItem('web3_account');
  };

  return (
    <Web3Context.Provider value={{ isConnected, account, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

