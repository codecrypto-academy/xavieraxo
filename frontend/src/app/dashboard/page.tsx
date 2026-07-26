'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUser, getUserTokens, getAllTransfers } from '@/lib/contractFunctions';
import { ROLE_NAMES, UserRole, TransferStatus } from '@/lib/contracts';
import Link from 'next/link';

export default function DashboardPage() {
  const { account } = useWeb3();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number | null>(null);

  const loadUserData = useCallback(async () => {
    if (!account) return;
    try {
      const user = await getUser(account);
      setUserRole(user.role as UserRole);
      setUserName(user.name);

      try {
        const [tokens, transfers] = await Promise.all([
          getUserTokens(account),
          getAllTransfers(),
        ]);
        const mine = account.toLowerCase();
        setTokenCount(tokens.length);
        setPendingCount(
          transfers.filter(
            (t) => t.to.toLowerCase() === mine && t.status === TransferStatus.Pending
          ).length
        );
        setCompletedCount(
          transfers.filter(
            (t) =>
              (t.from.toLowerCase() === mine || t.to.toLowerCase() === mine) &&
              t.status === TransferStatus.Accepted
          ).length
        );
      } catch (metricsErr) {
        console.error('Error loading metrics:', metricsErr);
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
              <span className="text-sm text-gray-600">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
              <Link href="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
                Perfil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido, {userName} ({userRole !== null ? ROLE_NAMES[userRole] : 'N/A'})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Mis Tokens</h3>
            <p className="text-3xl font-bold text-blue-600">{tokenCount ?? '-'}</p>
            <Link href="/tokens" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
              Ver detalles →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Transferencias Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount ?? '-'}</p>
            <Link href="/transfers" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
              Ver detalles →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Transferencias Realizadas</h3>
            <p className="text-3xl font-bold text-green-600">{completedCount ?? '-'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/tokens"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-gray-800">Crear Token</h3>
              <p className="text-sm text-gray-600">Crear un nuevo token o producto</p>
            </Link>
            <Link
              href="/transfers"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-gray-800">Transferir Token</h3>
              <p className="text-sm text-gray-600">Transferir tokens a otro usuario</p>
            </Link>
            <Link
              href="/traceability"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-gray-800">Trazabilidad</h3>
              <p className="text-sm text-gray-600">Ver linaje e historial de un token</p>
            </Link>
            {userRole === UserRole.Admin && (
              <Link
                href="/admin"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
              >
                <h3 className="font-semibold text-gray-800">Panel de Administración</h3>
                <p className="text-sm text-gray-600">Gestionar usuarios del sistema</p>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

