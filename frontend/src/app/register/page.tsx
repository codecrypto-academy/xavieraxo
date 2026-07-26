'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/context/Web3Context';
import { registerUser } from '@/lib/contractFunctions';
import { UserRole, ROLE_NAMES } from '@/lib/contracts';
import { parseContractError } from '@/lib/errors';

export default function RegisterPage() {
  const router = useRouter();
  const { account } = useWeb3();
  const [role, setRole] = useState<UserRole>(UserRole.Producer);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerUser(role, name);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al registrar usuario'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Registro de Usuario
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(Number(e.target.value) as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={UserRole.Producer}>{ROLE_NAMES[UserRole.Producer]}</option>
              <option value={UserRole.Factory}>{ROLE_NAMES[UserRole.Factory]}</option>
              <option value={UserRole.Retailer}>{ROLE_NAMES[UserRole.Retailer]}</option>
              <option value={UserRole.Consumer}>{ROLE_NAMES[UserRole.Consumer]}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Después del registro, deberás esperar la aprobación del administrador.
        </p>
      </div>
    </div>
  );
}

