'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUser } from '@/lib/contractFunctions';
import { UserStatus } from '@/lib/contracts';
import Link from 'next/link';

export default function Home() {
  const { isConnected, account, connect } = useWeb3();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      loadUserStatus();
    }
  }, [isConnected, account]);

  const loadUserStatus = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const user = await getUser(account);
      setUserStatus(user.status as UserStatus);
    } catch (error) {
      console.error('Error loading user:', error);
      setUserStatus(UserStatus.NotRegistered);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      alert('Error al conectar MetaMask. Asegúrate de tenerlo instalado.');
    }
  };

  // Estado 1: No conectado
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Supply Chain Tracker
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Sistema de trazabilidad de cadena de suministro basado en blockchain
          </p>
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Conectar MetaMask
          </button>
        </div>
      </div>
    );
  }

  // Estado 2: Conectado pero no registrado
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

  if (userStatus === UserStatus.NotRegistered || userStatus === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Registro de Usuario
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Conectado: {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
          <Link
            href="/register"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Registrarse
          </Link>
        </div>
      </div>
    );
  }

  // Estado 3: Pendiente de aprobación
  if (userStatus === UserStatus.Pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Pendiente de Aprobación
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Tu solicitud de registro está siendo revisada por el administrador.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              Por favor, espera a que tu cuenta sea aprobada para acceder al sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado 4: Aprobado - Mostrar Dashboard
  if (userStatus === UserStatus.Approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Supply Chain Tracker</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <Link
                  href="/profile"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Perfil
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Dashboard</h2>
              <p className="text-gray-600">Resumen de operaciones y estadísticas</p>
            </Link>

            <Link href="/tokens" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Tokens</h2>
              <p className="text-gray-600">Gestionar tokens y productos</p>
            </Link>

            <Link href="/transfers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Transferencias</h2>
              <p className="text-gray-600">Ver y gestionar transferencias</p>
            </Link>

            <Link href="/admin" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Panel Admin</h2>
              <p className="text-gray-600">Gestionar usuarios (solo admin)</p>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Estado rechazado o cancelado
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Cuenta {userStatus === UserStatus.Rejected ? 'Rechazada' : 'Cancelada'}
        </h1>
        <p className="text-gray-600 text-center">
          Tu cuenta no puede acceder al sistema. Contacta al administrador.
        </p>
      </div>
    </div>
  );
}

