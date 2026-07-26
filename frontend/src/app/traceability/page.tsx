'use client';

import { FormEvent, Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useWeb3 } from '@/context/Web3Context';
import {
  getToken,
  getTokenChildren,
  getTokenLineage,
  getTokenTransfers,
  getTokenCounter,
} from '@/lib/contractFunctions';
import { TRANSFER_STATUS_NAMES, TransferStatus } from '@/lib/contracts';
import { parseContractError } from '@/lib/errors';
import { DEFAULT_PAGE_SIZE, paginate } from '@/lib/pagination';
import PaginationControls from '@/components/PaginationControls';

interface TokenInfo {
  tokenId: number;
  owner: string;
  metadata: string;
  parentTokenId: number;
  isRawMaterial: boolean;
  creationTime: number;
  creator: string;
}

interface TransferInfo {
  transferId: number;
  tokenId: number;
  from: string;
  to: string;
  amount: number;
  status: number;
  timestamp: number;
  metadata: string;
}

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(ts: number) {
  if (!ts) return '-';
  return new Date(ts * 1000).toLocaleString();
}

function parseMetadataLabel(metadata: string) {
  try {
    const parsed = JSON.parse(metadata);
    if (parsed?.nombre) return String(parsed.nombre);
  } catch {
    // metadata no JSON
  }
  return metadata.length > 48 ? `${metadata.slice(0, 48)}...` : metadata;
}

function TraceabilityContent() {
  const { account } = useWeb3();
  const searchParams = useSearchParams();
  const [tokenInput, setTokenInput] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lineage, setLineage] = useState<TokenInfo[]>([]);
  const [children, setChildren] = useState<TokenInfo[]>([]);
  const [transfers, setTransfers] = useState<TransferInfo[]>([]);
  const [tokenTotal, setTokenTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transfersPage, setTransfersPage] = useState(1);

  const loadTrace = useCallback(async (tokenId: number) => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken(tokenId);
      if (!token.tokenId) {
        throw new Error(`El token #${tokenId} no existe`);
      }

      const [lineageData, childrenData, transfersData, total] = await Promise.all([
        getTokenLineage(tokenId),
        getTokenChildren(tokenId),
        getTokenTransfers(tokenId),
        getTokenCounter(),
      ]);

      setSelectedId(tokenId);
      setLineage(lineageData);
      setChildren(childrenData);
      setTransfers(transfersData);
      setTransfersPage(1);
      setTokenTotal(total);
    } catch (err: any) {
      console.error(err);
      setSelectedId(null);
      setLineage([]);
      setChildren([]);
      setTransfers([]);
      setError(parseContractError(err, 'No se pudo cargar la trazabilidad'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fromQuery = searchParams.get('tokenId');
    if (fromQuery) {
      const id = parseInt(fromQuery, 10);
      if (!Number.isNaN(id) && id > 0) {
        setTokenInput(String(id));
        loadTrace(id);
      }
    }
  }, [searchParams, loadTrace]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const id = parseInt(tokenInput, 10);
    if (Number.isNaN(id) || id <= 0) {
      setError('Ingresa un ID de token válido (mayor a 0)');
      return;
    }
    await loadTrace(id);
  };

  const transfersPageData = paginate(transfers, transfersPage, DEFAULT_PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Supply Chain Tracker
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-medium">Trazabilidad</span>
            </div>
            <div className="flex items-center space-x-4">
              {account && (
                <span className="text-sm text-gray-600">{shortAddress(account)}</span>
              )}
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Trazabilidad de Tokens</h1>
          <p className="text-gray-600">
            Consulta el linaje (origen → derivados) y el historial de transferencias de un token.
            {tokenTotal !== null && (
              <span className="ml-1 text-sm text-gray-500">Tokens on-chain: {tokenTotal}</span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-2">
            ID del token
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="tokenId"
              type="number"
              min={1}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Ej: 1"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {loading ? 'Buscando...' : 'Rastrear'}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>

        {selectedId !== null && !error && (
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Linaje del token #{selectedId}
              </h2>
              {lineage.length === 0 ? (
                <p className="text-gray-600">Sin datos de linaje.</p>
              ) : (
                <ol className="space-y-3">
                  {lineage.map((token, index) => {
                    const isCurrent = token.tokenId === selectedId;
                    return (
                      <li key={token.tokenId} className="flex items-stretch gap-3">
                        <div className="flex flex-col items-center w-8">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index < lineage.length - 1 && (
                            <div className="flex-1 w-0.5 bg-blue-200 my-1" />
                          )}
                        </div>
                        <div
                          className={`flex-1 rounded-lg border p-4 ${
                            isCurrent ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-800">
                              Token #{token.tokenId}
                              {token.isRawMaterial ? ' · Materia prima' : ' · Derivado'}
                              {isCurrent && (
                                <span className="ml-2 text-xs font-medium text-blue-700">
                                  (consultado)
                                </span>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setTokenInput(String(token.tokenId));
                                loadTrace(token.tokenId);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Ver este token
                            </button>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            {parseMetadataLabel(token.metadata)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Creador: {shortAddress(token.creator)} ·{' '}
                            {formatDate(token.creationTime)}
                            {token.parentTokenId > 0 && ` · Padre #${token.parentTokenId}`}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Derivados directos ({children.length})
              </h2>
              {children.length === 0 ? (
                <p className="text-gray-600">Este token no tiene derivados registrados.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <li key={child.tokenId} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-1">Token #{child.tokenId}</p>
                      <p className="text-sm text-gray-700 mb-2">
                        {parseMetadataLabel(child.metadata)}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setTokenInput(String(child.tokenId));
                          loadTrace(child.tokenId);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Rastrear derivado →
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Historial de transferencias ({transfers.length})
              </h2>
              {transfers.length === 0 ? (
                <p className="text-gray-600">No hay transferencias para este token.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600 border-b">
                          <th className="py-2 pr-4">ID</th>
                          <th className="py-2 pr-4">De</th>
                          <th className="py-2 pr-4">A</th>
                          <th className="py-2 pr-4">Cant.</th>
                          <th className="py-2 pr-4">Estado</th>
                          <th className="py-2">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transfersPageData.items.map((t) => (
                          <tr key={t.transferId} className="border-b border-gray-100">
                            <td className="py-2 pr-4 font-medium">#{t.transferId}</td>
                            <td className="py-2 pr-4 font-mono text-xs">{shortAddress(t.from)}</td>
                            <td className="py-2 pr-4 font-mono text-xs">{shortAddress(t.to)}</td>
                            <td className="py-2 pr-4">{t.amount}</td>
                            <td className="py-2 pr-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                  t.status === TransferStatus.Accepted
                                    ? 'bg-green-100 text-green-800'
                                    : t.status === TransferStatus.Pending
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {TRANSFER_STATUS_NAMES[t.status as TransferStatus] || t.status}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600">{formatDate(t.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    page={transfersPageData.page}
                    totalPages={transfersPageData.totalPages}
                    total={transfersPageData.total}
                    pageSize={transfersPageData.pageSize}
                    onPageChange={setTransfersPage}
                    disabled={loading}
                    label="transferencias"
                  />
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TraceabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando trazabilidad...</p>
          </div>
        </div>
      }
    >
      <TraceabilityContent />
    </Suspense>
  );
}
