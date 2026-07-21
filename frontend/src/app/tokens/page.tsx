'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { createToken, getUserTokens, updateTokenMetadata } from '@/lib/contractFunctions';
import Link from 'next/link';

interface TokenData {
  tokenId: number;
  owner: string;
  metadata: string;
  parentTokenId: number;
  isRawMaterial: boolean;
  creationTime: number;
  creator: string;
  balance: number;
}

export default function TokensPage() {
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [metadata, setMetadata] = useState('');
  const [parentTokenId, setParentTokenId] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [editingTokenId, setEditingTokenId] = useState<number | null>(null);
  const [editMetadata, setEditMetadata] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadTokens = useCallback(async () => {
    if (!account) return;
    setLoadingList(true);
    try {
      const userTokens = await getUserTokens(account);
      setTokens(userTokens);
    } catch (err) {
      console.error('Error loading tokens:', err);
      setError('No se pudieron cargar los tokens');
    } finally {
      setLoadingList(false);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      loadTokens();
    }
  }, [account, loadTokens]);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const parentId = parentTokenId ? parseInt(parentTokenId) : 0;
      const supply = parseInt(initialSupply);

      if (supply <= 0) {
        throw new Error('La cantidad inicial debe ser mayor a 0');
      }

      await createToken(metadata, parentId, supply);
      setSuccess('Token creado exitosamente');
      setShowCreateForm(false);
      setMetadata('');
      setParentTokenId('');
      setInitialSupply('');
      await loadTokens();
    } catch (err: any) {
      setError(err.message || 'Error al crear token');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (tokenId: number, currentMetadata: string) => {
    setEditingTokenId(tokenId);
    setEditMetadata(currentMetadata);
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingTokenId(null);
    setEditMetadata('');
  };

  const handleUpdateMetadata = async (tokenId: number) => {
    setSavingEdit(true);
    setError('');
    setSuccess('');
    try {
      await updateTokenMetadata(tokenId, editMetadata);
      setSuccess('Metadata actualizada exitosamente');
      setEditingTokenId(null);
      setEditMetadata('');
      await loadTokens();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar metadata');
    } finally {
      setSavingEdit(false);
    }
  };

  const isOwner = (owner: string) => account?.toLowerCase() === owner.toLowerCase();

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
          <h1 className="text-3xl font-bold text-gray-800">Tokens</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadTokens}
              disabled={loadingList}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              {loadingList ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {showCreateForm ? 'Cancelar' : 'Crear Token'}
            </button>
          </div>
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Nuevo Token</h2>
            <form onSubmit={handleCreateToken} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata (JSON)
                </label>
                <textarea
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder='{"nombre": "Producto", "descripcion": "..."}'
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Padre ID (dejar vacío para materia prima)
                </label>
                <input
                  type="number"
                  value={parentTokenId}
                  onChange={(e) => setParentTokenId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Inicial
                </label>
                <input
                  type="number"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Creando...' : 'Crear Token'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Mis Tokens ({tokens.length})
          </h2>

          {loadingList ? (
            <p className="text-gray-600">Cargando tokens...</p>
          ) : tokens.length === 0 ? (
            <p className="text-gray-600">Aún no tienes tokens con balance disponible.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                  {editingTokenId === token.tokenId ? (
                    <div className="space-y-2 mb-2">
                      <textarea
                        value={editMetadata}
                        onChange={(e) => setEditMetadata(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={3}
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateMetadata(token.tokenId)}
                          disabled={savingEdit}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-1.5 px-3 rounded-lg text-xs"
                        >
                          {savingEdit ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={savingEdit}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 px-3 rounded-lg text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 break-words mb-2">{token.metadata}</p>
                  )}

                  <p className="text-sm text-gray-800 font-medium">Balance: {token.balance}</p>
                  {token.parentTokenId > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Deriva del token #{token.parentTokenId}</p>
                  )}

                  {isOwner(token.owner) && editingTokenId !== token.tokenId && (
                    <button
                      onClick={() => startEdit(token.tokenId, token.metadata)}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Editar metadata
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
