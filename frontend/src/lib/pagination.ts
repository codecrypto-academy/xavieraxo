/** Utilidades de paginación en cliente. */

export const DEFAULT_PAGE_SIZE = 10;

export type PageSlice<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(1, page), totalPages);
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): PageSlice<T> {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const safePage = clampPage(page, totalPages || 1);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: total === 0 ? 1 : safePage,
    pageSize,
    total,
    totalPages,
  };
}

/** Rango de IDs on-chain (1-based, inclusive), más recientes primero. */
export function idRangeForPage(
  total: number,
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): { start: number; end: number; totalPages: number; page: number } {
  if (total <= 0) {
    return { start: 0, end: 0, totalPages: 0, page: 1 };
  }
  const totalPages = Math.ceil(total / pageSize);
  const safePage = clampPage(page, totalPages);
  const end = total - (safePage - 1) * pageSize;
  const start = Math.max(1, end - pageSize + 1);
  return { start, end, totalPages, page: safePage };
}
