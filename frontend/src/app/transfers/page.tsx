'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import {
  createTransfer,
  acceptTransfer,
  rejectTransfer,
  cancelTransfer,
  expireTransfer,
  getAllTransfers,
  getTransferTimeout,
} from '@/lib/contractFunctions';
import { parseContractError } from '@/lib/errors';
import { TransferStatus, TRANSFER_STATUS_NAMES } from '@/lib/contracts';
import { DEFAULT_PAGE_SIZE, paginate } from '@/lib/pagination';
import PaginationControls from '@/components/PaginationControls';
import Link from 'next/link';

interface TransferData {
  transferId: number;
  tokenId: number;
  from: string;
  to: string;
  amount: number;
  status: number;
  timestamp: number;
  metadata: string;
}

export default function TransfersPage() {
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [metadata, setMetadata] = useState('');
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [timeoutSec, setTimeoutSec] = useState<number>(30 * 24 * 60 * 60);
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  const [historyPage, setHistoryPage] = useState(1);

  const loadTransfers = useCallback(async () => {
    setLoadingList(true);
    try {
      const [all, timeout] = await Promise.all([getAllTransfers(), getTransferTimeout()]);
      setTransfers(all);
      setTimeoutSec(timeout);
      setNowSec(Math.floor(Date.now() / 1000));
      setHistoryPage(1);
    } catch (err) {
      console.error('Error loading transfers:', err);
      setError('No se pudieron cargar las transferencias');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (account) {
      loadTransfers();
    }
  }, [account, loadTransfers]);

  const isExpiredPending = (t: TransferData) =>
    t.status === TransferStatus.Pending && nowSec > t.timestamp + timeoutSec;

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
      await loadTransfers();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al crear transferencia'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTransfer = async (transferId: number) => {
    setActionId(transferId);
    setError('');
    setSuccess('');
    try {
      await acceptTransfer(transferId);
      setSuccess('Transferencia aceptada');
      await loadTransfers();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al aceptar transferencia'));
    } finally {
      setActionId(null);
    }
  };

  const handleRejectTransfer = async (transferId: number) => {
    setActionId(transferId);
    setError('');
    setSuccess('');
    try {
      await rejectTransfer(transferId);
      setSuccess('Transferencia rechazada');
      await loadTransfers();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al rechazar transferencia'));
    } finally {
      setActionId(null);
    }
  };

  const handleExpireTransfer = async (transferId: number) => {
    setActionId(transferId);
    setError('');
    setSuccess('');
    try {
      await expireTransfer(transferId);
      setSuccess('Transferencia expirada: balance liberado al emisor');
      await loadTransfers();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al expirar transferencia'));
    } finally {
      setActionId(null);
    }
  };

  const handleCancelTransfer = async (transferId: number) => {
    setActionId(transferId);
    setError('');
    setSuccess('');
    try {
      await cancelTransfer(transferId);
      setSuccess('Transferencia cancelada: balance liberado');
      await loadTransfers();
    } catch (err: any) {
      setError(parseContractError(err, 'Error al cancelar transferencia'));
    } finally {
      setActionId(null);
    }
  };

  const statusBadge = (t: TransferData) => {
    const expiredPending = isExpiredPending(t);
    const status = expiredPending ? TransferStatus.Expired : t.status;
    const styles: Record<number, string> = {
      [TransferStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [TransferStatus.Accepted]: 'bg-green-100 text-green-800',
      [TransferStatus.Rejected]: 'bg-red-100 text-red-800',
      [TransferStatus.Expired]: 'bg-orange-100 text-orange-800',
      [TransferStatus.Cancelled]: 'bg-gray-100 text-gray-800',
    };
    const label = expiredPending
      ? 'Pendiente (expirada)'
      : TRANSFER_STATUS_NAMES[status as TransferStatus];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    );
  };

  const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const isMine = (addr: string) => account?.toLowerCase() === addr.toLowerCase();

  const incomingPending = transfers.filter(
    (t) => isMine(t.to) && t.status === TransferStatus.Pending && !isExpiredPending(t)
  );
  const outgoingPending = transfers.filter(
    (t) => isMine(t.from) && t.status === TransferStatus.Pending && !isExpiredPending(t)
  );
  const recoverableExpired = transfers.filter(
    (t) =>
      t.status === TransferStatus.Pending &&
      isExpiredPending(t) &&
      (isMine(t.from) || isMine(t.to))
  );
  const history = transfers
    .filter((t) => isMine(t.to) || isMine(t.from))
    .slice()
    .sort((a, b) => b.transferId - a.transferId);
  const historyPageData = paginate(history, historyPage, DEFAULT_PAGE_SIZE);

  const timeoutDays = Math.round(timeoutSec / (24 * 60 * 60));

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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Transferencias</h1>
            <p className="text-sm text-gray-600 mt-1">
              Timeout de pendientes: {timeoutDays} días. Luego se puede liberar el balance con
              &quot;Expirar&quot;.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadTransfers}
              disabled={loadingList}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              {loadingList ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {showCreateForm ? 'Cancelar' : 'Nueva Transferencia'}
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Transferencia</h2>
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Transferencias Recibidas Pendientes ({incomingPending.length})
          </h2>

          {loadingList ? (
            <p className="text-gray-600">Cargando transferencias...</p>
          ) : incomingPending.length === 0 ? (
            <p className="text-gray-600">No tienes transferencias pendientes por aceptar.</p>
          ) : (
            <div className="space-y-3">
              {incomingPending.map((t) => (
                <div
                  key={t.transferId}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg p-4 gap-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Transferencia #{t.transferId} · Token #{t.tokenId}
                    </p>
                    <p className="text-sm text-gray-600">Cantidad: {t.amount}</p>
                    <p className="text-sm text-gray-500 font-mono">De: {short(t.from)}</p>
                    {t.metadata && (
                      <p className="text-sm text-gray-500">Metadata: {t.metadata}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptTransfer(t.transferId)}
                      disabled={actionId === t.transferId}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                    >
                      {actionId === t.transferId ? 'Procesando...' : 'Aceptar'}
                    </button>
                    <button
                      onClick={() => handleRejectTransfer(t.transferId)}
                      disabled={actionId === t.transferId}
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Transferencias Enviadas Pendientes ({outgoingPending.length})
          </h2>

          {loadingList ? (
            <p className="text-gray-600">Cargando transferencias...</p>
          ) : outgoingPending.length === 0 ? (
            <p className="text-gray-600">No tienes transferencias enviadas pendientes.</p>
          ) : (
            <div className="space-y-3">
              {outgoingPending.map((t) => (
                <div
                  key={t.transferId}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 rounded-lg p-4 gap-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Transferencia #{t.transferId} · Token #{t.tokenId}
                    </p>
                    <p className="text-sm text-gray-600">Cantidad reservada: {t.amount}</p>
                    <p className="text-sm text-gray-500 font-mono">Para: {short(t.to)}</p>
                  </div>
                  <button
                    onClick={() => handleCancelTransfer(t.transferId)}
                    disabled={actionId === t.transferId}
                    className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    {actionId === t.transferId ? 'Procesando...' : 'Cancelar envío'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {recoverableExpired.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Transferencias expiradas por liberar ({recoverableExpired.length})
            </h2>
            <div className="space-y-3">
              {recoverableExpired.map((t) => (
                <div
                  key={t.transferId}
                  className="flex flex-col md:flex-row md:items-center md:justify-between border border-orange-200 rounded-lg p-4 gap-3 bg-orange-50"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Transferencia #{t.transferId} · Token #{t.tokenId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad reservada: {t.amount} · Emisor: {short(t.from)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleExpireTransfer(t.transferId)}
                    disabled={actionId === t.transferId}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                  >
                    {actionId === t.transferId ? 'Procesando...' : 'Expirar y liberar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Mi Historial de Transferencias ({history.length})
          </h2>

          {loadingList ? (
            <p className="text-gray-600">Cargando transferencias...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-600">Aún no tienes transferencias registradas.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Token</th>
                      <th className="px-4 py-2">De</th>
                      <th className="px-4 py-2">Para</th>
                      <th className="px-4 py-2">Cantidad</th>
                      <th className="px-4 py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyPageData.items.map((t) => (
                      <tr key={t.transferId}>
                        <td className="px-4 py-3 text-sm text-gray-800">{t.transferId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">#{t.tokenId}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                          {isMine(t.from) ? 'Yo' : short(t.from)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                          {isMine(t.to) ? 'Yo' : short(t.to)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t.amount}</td>
                        <td className="px-4 py-3 text-sm">{statusBadge(t)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={historyPageData.page}
                totalPages={historyPageData.totalPages}
                total={historyPageData.total}
                pageSize={historyPageData.pageSize}
                onPageChange={setHistoryPage}
                disabled={loadingList}
                label="transferencias"
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
