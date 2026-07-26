/**
 * Traduce errores de ethers/MetaMask/contrato a mensajes legibles para la UI.
 */

const CONTRACT_MESSAGES: Record<string, string> = {
  'Solo administrador': 'Solo el administrador puede realizar esta acción.',
  'Usuario no aprobado': 'Tu cuenta aún no está aprobada.',
  'Rol invalido': 'El rol seleccionado no es válido.',
  'Direccion invalida': 'La dirección indicada no es válida.',
  'Token no existe': 'El token indicado no existe.',
  'Cantidad debe ser mayor que cero': 'La cantidad debe ser mayor que cero.',
  'String no puede estar vacio': 'El nombre no puede estar vacío.',
  'Metadata no puede estar vacia': 'La metadata no puede estar vacía.',
  'Metadata muy larga': 'La metadata supera el límite permitido (1000 caracteres).',
  'Usuario ya registrado': 'Esta wallet ya está registrada.',
  'Usuario no pendiente': 'El usuario no está pendiente de aprobación.',
  'Estado invalido para cancelar': 'No se puede cancelar un usuario en ese estado.',
  'Token padre no existe': 'El token padre indicado no existe.',
  'No tienes el token padre': 'No tienes el token padre necesario para crear este derivado.',
  'No eres el propietario': 'Solo el propietario del token puede editar su metadata.',
  'No puedes transferirte a ti mismo': 'No puedes transferirte tokens a ti mismo.',
  'Balance insuficiente': 'No tienes suficiente balance de ese token.',
  'Receptor no aprobado': 'El receptor aún no está aprobado en el sistema.',
  'Transferencia no valida en la cadena':
    'Esa transferencia no es válida según los roles de la cadena de suministro.',
  'Transferencia no existe': 'La transferencia indicada no existe.',
  'No eres el receptor': 'Solo el receptor puede aceptar o rechazar esta transferencia.',
  'Transferencia no pendiente': 'La transferencia ya no está pendiente.',
  'Transferencia expirada':
    'La transferencia expiró. Usa “Expirar y liberar” para devolver el balance al emisor.',
  'Transferencia no expirada': 'Todavía no pasó el tiempo de espera para expirarla.',
  EnforcedPause: 'El contrato está en pausa. Espera a que el admin lo reactive.',
  ExpectedPause: 'El contrato no está pausado.',
};

const GENERIC_PATTERNS: Array<{ test: RegExp; message: string }> = [
  {
    test: /user rejected|denied transaction|ACTION_REJECTED|rejected the request/i,
    message: 'Cancelaste la transacción en MetaMask.',
  },
  {
    test: /network|chain|wrong network/i,
    message: 'Revisa que MetaMask esté en la red Localhost 8545 (Chain ID 31337).',
  },
  {
    test: /insufficient funds/i,
    message: 'No tienes ETH suficiente para pagar el gas.',
  },
  {
    test: /nonce|replacement transaction/i,
    message: 'Hay un problema con el nonce de la transacción. Reintenta o resetea la cuenta en MetaMask.',
  },
  {
    test: /could not coalesce|CALL_EXCEPTION|execution reverted/i,
    message: 'La transacción fue rechazada por el contrato. Revisa permisos, balances y estado.',
  },
];

function collectErrorText(err: unknown): string {
  if (!err) return '';
  if (typeof err === 'string') return err;

  const e = err as Record<string, any>;
  const parts: string[] = [];

  const push = (value: unknown) => {
    if (typeof value === 'string' && value.trim()) parts.push(value);
  };

  push(e.shortMessage);
  push(e.reason);
  push(e.message);
  push(e.code);
  push(e.info?.error?.message);
  push(e.error?.message);
  push(e.data?.message);
  push(e.cause?.message);
  push(e.cause?.reason);

  if (typeof e.data === 'string') push(e.data);

  try {
    parts.push(JSON.stringify(e));
  } catch {
    // ignore circular structures
  }

  return parts.join(' | ');
}

function extractQuotedReason(text: string): string | null {
  const patterns = [
    /execution reverted:\s*["']?([^"'\n]+)["']?/i,
    /reverted with reason string ['"]([^'"]+)['"]/i,
    /Error:\s*VM Exception[^:]*:\s*revert\s+(.+)$/im,
    /"message"\s*:\s*"execution reverted:\s*([^"]+)"/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}

export function parseContractError(
  err: unknown,
  fallback = 'Ocurrió un error al procesar la transacción.'
): string {
  const raw = collectErrorText(err);
  if (!raw) return fallback;

  const quoted = extractQuotedReason(raw);
  if (quoted && CONTRACT_MESSAGES[quoted]) {
    return CONTRACT_MESSAGES[quoted];
  }
  if (quoted) {
    return quoted;
  }

  for (const [key, message] of Object.entries(CONTRACT_MESSAGES)) {
    if (raw.includes(key)) return message;
  }

  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test.test(raw)) return pattern.message;
  }

  // Evitar volcar objetos ethers enormes en la UI
  if (raw.length > 180 || raw.includes('transaction=') || raw.includes('info=')) {
    return fallback;
  }

  return raw;
}
