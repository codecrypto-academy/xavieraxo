'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { createTransfer, acceptTransfer, rejectTransfer } from '@/lib/contractFunctions';
import Link from 'next/link';

export default function TransfersPage() {
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [metadata, setMetadata] = useState('');

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tokenIdNum = parseInt(tokenId);
      const amountNum = parseInt(amount);
      
      if (amountNum <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      await createTransfer(tokenIdNum, to, amountNum, metadata);
      setSuccess('Transferencia creada exitosamente');
      setShowCreateForm(false);
      setTokenId('');
      setTo('');
      setAmount('');
      setMetadata('');
    } catch (err: any) {
      setError(err.message || 'Error al crear transferencia');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTransfer = async (transferId: number) => {
    setLoading(true);
    setError('');
    try {
      await acceptTransfer(transferId);
      setSuccess('Transferencia aceptada');
    } catch (err: any) {
      setError(err.message || 'Error al aceptar transferencia');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTransfer = async (transferId: number) => {
    setLoading(true);
    setError('');
    try {
      await rejectTransfer(transferId);
      setSuccess('Transferencia rechazada');
    } catch (err: any) {
      setError(err.message || 'Error al rechazar transferencia');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Transferencias</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {showCreateForm ? 'Cancelar' : 'Nueva Transferencia'}
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

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Transferencia</h2>
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token ID
                </label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección del Receptor
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata (opcional)
                </label>
                <textarea
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Creando...' : 'Crear Transferencia'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Transferencias Pendientes</h2>
          <p className="text-gray-600">Lista de transferencias próximamente...</p>
        </div>
      </main>
    </div>
  );
}

