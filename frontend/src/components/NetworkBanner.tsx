'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { parseContractError } from '@/lib/errors';

export default function NetworkBanner() {
  const {
    isConnected,
    chainId,
    isCorrectNetwork,
    switchNetwork,
    expectedChainId,
    expectedNetworkName,
  } = useWeb3();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState('');

  if (!isConnected || chainId === null || isCorrectNetwork) {
    return null;
  }

  const handleSwitch = async () => {
    setSwitching(true);
    setError('');
    try {
      await switchNetwork();
    } catch (err: any) {
      setError(parseContractError(err, 'No se pudo cambiar de red'));
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-sm">
          Estás en una red incorrecta (Chain ID {chainId}). Esta DApp espera{' '}
          <strong>
            {expectedNetworkName} (Chain ID {expectedChainId})
          </strong>
          .
        </p>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-100">{error}</span>}
          <button
            onClick={handleSwitch}
            disabled={switching}
            className="bg-white text-red-700 font-semibold py-1.5 px-3 rounded-lg text-sm disabled:opacity-70"
          >
            {switching ? 'Cambiando...' : 'Cambiar de red'}
          </button>
        </div>
      </div>
    </div>
  );
}
