'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUser, approveUser, rejectUser, getAllUsers } from '@/lib/contractFunctions';
import { UserRole, UserStatus, STATUS_NAMES, ROLE_NAMES } from '@/lib/contracts';
import Link from 'next/link';

interface UserData {
  userAddress: string;
  role: number;
  status: number;
  name: string;
  registrationTime: number;
}

export default function AdminPage() {
  const { account } = useWeb3();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionAddress, setActionAddress] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    if (!account) return;
    try {
      const user = await getUser(account);
      setUserRole(user.role as UserRole);
      if (user.role === UserRole.Admin) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  }, [account, loadUsers]);

  useEffect(() => {
    if (account) {
      checkAdminAccess();
    }
  }, [account, checkAdminAccess]);

  const handleApprove = async (userAddress: string) => {
    setActionAddress(userAddress);
    setError('');
    setSuccess('');
    try {
      await approveUser(userAddress);
      setSuccess('Usuario aprobado exitosamente');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al aprobar usuario');
    } finally {
      setActionAddress(null);
    }
  };

  const handleReject = async (userAddress: string) => {
    setActionAddress(userAddress);
    setError('');
    setSuccess('');
    try {
      await rejectUser(userAddress);
      setSuccess('Usuario rechazado exitosamente');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al rechazar usuario');
    } finally {
      setActionAddress(null);
    }
  };

  const statusBadge = (status: number) => {
    const styles: Record<number, string> = {
      [UserStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [UserStatus.Approved]: 'bg-green-100 text-green-800',
      [UserStatus.Rejected]: 'bg-red-100 text-red-800',
      [UserStatus.Cancelled]: 'bg-gray-100 text-gray-800',
      [UserStatus.NotRegistered]: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {STATUS_NAMES[status as UserStatus]}
      </span>
    );
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

  const pendingUsers = users.filter((u) => u.status === UserStatus.Pending);
  const otherUsers = users.filter((u) => u.status !== UserStatus.Pending);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <button
            onClick={loadUsers}
            disabled={loadingUsers}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {loadingUsers ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Usuarios Pendientes de Aprobación ({pendingUsers.length})
          </h2>

          {loadingUsers ? (
            <p className="text-gray-600">Cargando usuarios...</p>
          ) : pendingUsers.length === 0 ? (
            <p className="text-gray-600">No hay usuarios pendientes de aprobación.</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.userAddress}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg p-4 gap-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{user.userAddress}</p>
                    <p className="text-sm text-gray-600">Rol: {ROLE_NAMES[user.role as UserRole]}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(user.userAddress)}
                      disabled={actionAddress === user.userAddress}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      {actionAddress === user.userAddress ? 'Procesando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(user.userAddress)}
                      disabled={actionAddress === user.userAddress}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Todos los Usuarios ({users.length})
          </h2>

          {loadingUsers ? (
            <p className="text-gray-600">Cargando usuarios...</p>
          ) : otherUsers.length === 0 && pendingUsers.length === 0 ? (
            <p className="text-gray-600">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Rol</th>
                    <th className="px-4 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.userAddress}>
                      <td className="px-4 py-3 text-sm text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{user.userAddress}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ROLE_NAMES[user.role as UserRole]}</td>
                      <td className="px-4 py-3 text-sm">{statusBadge(user.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
