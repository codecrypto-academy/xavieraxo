'use client';

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  label?: string;
};

export default function PaginationControls({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  disabled = false,
  label = 'registros',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-gray-600">
        Mostrando {from}–{to} de {total} {label}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-semibold py-2 px-3 rounded-lg text-sm"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700 font-medium px-2">
          Página {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-semibold py-2 px-3 rounded-lg text-sm"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
