'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUser, approveUser, rejectUser } from '@/lib/contractFunctions';
import { UserRole, UserStatus, STATUS_NAMES } from '@/lib/contracts';
import Link from 'next/link';

export default function AdminPage() {
  const { account } = useWeb3();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (account) {
      checkAdminAccess();
    }
  }, [account]);

  const checkAdminAccess = async () => {
    if (!account) return;
    try {
      const user = await getUser(account);
      setUserRole(user.role as UserRole);
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userAddress: string) => {
    setLoading(true);
    setError('');
    try {
      await approveUser(userAddress);
      setSuccess('Usuario aprobado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al aprobar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userAddress: string) => {
    setLoading(true);
    setError('');
    try {
      await rejectUser(userAddress);
      setSuccess('Usuario rechazado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al rechazar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (loading && userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (userRole !== UserRole.Admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Solo los administradores pueden acceder a esta página.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
          >
            Volver al Dashboard
          </Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Gestión de Usuarios</h2>
          <p className="text-gray-600">
            Lista de usuarios pendientes de aprobación próximamente...
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Nota: Esta funcionalidad requiere implementar una función para listar todos los usuarios.
          </p>
        </div>
      </main>
    </div>
  );
}

