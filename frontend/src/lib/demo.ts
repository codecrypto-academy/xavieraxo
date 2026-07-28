/**
 * Modo UI para capturas / preview sin MetaMask ni registro.
 * Activar SOLO en local: NEXT_PUBLIC_DEMO_UI=1 en frontend/.env.local
 * Por defecto OFF → la entrega y la evaluación usan el flujo normal con wallet.
 */
export const DEMO_UI =
  process.env.NEXT_PUBLIC_DEMO_UI === '1' ||
  process.env.NEXT_PUBLIC_DEMO_UI === 'true';
