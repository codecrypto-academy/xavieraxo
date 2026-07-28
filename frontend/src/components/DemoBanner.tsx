'use client';

import { DEMO_UI } from '@/lib/demo';

/** Aviso visible solo cuando DEMO_UI está activo (capturas locales). */
export default function DemoBanner() {
  if (!DEMO_UI) return null;

  return (
    <div className="bg-amber-500 text-amber-950 text-center text-sm font-medium px-4 py-2">
      Modo capturas activo (sin MetaMask/registro). Desactiva{' '}
      <code className="bg-amber-200 px-1 rounded">NEXT_PUBLIC_DEMO_UI</code> antes de la demo
      de evaluación.
    </div>
  );
}
