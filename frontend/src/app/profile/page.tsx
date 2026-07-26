'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUser, getUserTokens } from '@/lib/contractFunctions';
import { ROLE_NAMES, STATUS_NAMES, UserRole, UserStatus } from '@/lib/contracts';
import Link from 'next/link';

interface TokenData {
  tokenId: number;
  metadata: string;
  isRawMaterial: boolean;
  parentTokenId: number;
  balance: number;
}

export default function ProfilePage() {
  const { account, disconnect } = useWeb3();
  const [userData, setUserData] = useState<any>(null);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!account) return;
    try {
      const user = await getUser(account);
      setUserData(user);
      setLoadingTokens(true);
      try {
        const userTokens = await getUserTokens(account);
        setTokens(userTokens);
      } catch (tokenErr) {
        console.error('Error loading tokens:', tokenErr);
      } finally {
        setLoadingTokens(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      loadUserData();
    } else {
      setLoading(false);
      setUserData(null);
      setTokens([]);
    }
  }, [account, loadUserData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Supply Chain Tracker
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

        {userData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Información del Usuario</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{userData.userAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900">{userData.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rol</dt>
                <dd className="mt-1 text-sm text-gray-900">{ROLE_NAMES[userData.role as UserRole]}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="mt-1 text-sm text-gray-900">{STATUS_NAMES[userData.status as UserStatus]}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de Registro</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(userData.registrationTime * 1000).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Mi Portafolio ({tokens.length})
          </h2>

          {loadingTokens ? (
            <p className="text-gray-600">Cargando tokens...</p>
          ) : tokens.length === 0 ? (
            <p className="text-gray-600">Aún no tienes tokens con balance disponible.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokens.map((token) => (
                <div key={token.tokenId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">Token #{token.tokenId}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        token.isRawMaterial
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {token.isRawMaterial ? 'Materia Prima' : 'Producto'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 break-words mb-2">{token.metadata}</p>
                  <p className="text-sm text-gray-800 font-medium">Balance: {token.balance}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={disconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Desconectar
          </button>
        </div>
      </main>
    </div>
  );
}

