# INDICE DEL PROYECTO

## 1) Resumen
Plataforma de trazabilidad logistica basada en blockchain EVM.

- Smart contract: Solidity + Foundry
- Frontend: Next.js 14 + TypeScript + Ethers v6 + Tailwind
- Wallet: MetaMask
- Red esperada en local: Chain ID 31337 (Anvil)

## 2) Estructura principal

- `SC/`: contratos, scripts y tests Foundry
- `frontend/`: DApp (Next.js)
- `scripts/`: utilidades locales (deploy, sync address, verify)
- `README.md`: descripcion general
- `INDICE_PROYECTO.md`: mapa tecnico del proyecto
- `CHECKLIST_DEMO.md`: checklist de demo (5-10 min)
- `VERIFICACION_E2E.md`: verificacion automatizada y criterios E2E
- `DOCUMENTO_ENTREGA.md`: documento de entrega / defensa academica
- `EJECUTAR_PROYECTO.md`: guia de ejecucion
- `CONFIGURACION_METAMASK.md`: configuracion de wallet
- `GUIA_RAPIDA_METAMASK.md`: referencia rapida
- `EXPLICACION_DEL_PROYECTO.md`: notas tecnicas

No pertenece a este repo una carpeta `solidity/` externa: el contrato vive en `SC/src/`.

## 3) Backend on-chain (SC)

### 3.1 Contrato principal
- `SC/src/SupplyChainTracker.sol`

Implementa:
- Registro y gestion de usuarios con roles
- Estados de usuario (Pending, Approved, etc.)
- Re-registro permitido tras Rejected o Cancelled
- Creacion de tokens con trazabilidad (token padre)
- Materia prima (`parentTokenId = 0`) solo por rol Productor
- Owner del token se actualiza al aceptar si el emisor queda sin balance
- Titulares con balance pueden editar metadata
- Transferencias con aceptacion/rechazo del receptor
- Cancelacion de transferencia pendiente por el emisor (`cancelTransfer`)
- Timeout de transferencias pendientes (`TRANSFER_TIMEOUT` + `expireTransfer`)
- Pausa de emergencia del contrato

### 3.2 Script de despliegue
- `SC/script/Deploy.s.sol`

Accion:
- Despliega `SupplyChainTracker`
- Muestra direccion y admin por consola

### 3.3 Pruebas
- `SC/test/SupplyChainTracker.t.sol`

Cobertura principal:
- Registro/aprobacion/rechazo/cancelacion de usuarios
- Creacion de tokens y update de metadata
- Transferencias, timeout y cambios de estado
- Pausa/despausa de emergencia
- Validaciones de borde (amount 0, auto-transfer, metadata)
- Flujo completo Productor -> Factoria -> Retailer -> Consumidor

### 3.4 Configuracion Foundry
- `SC/foundry.toml`

## 4) Frontend (Next.js)

### 4.1 App shell
- `frontend/src/app/layout.tsx`

Monta:
- `Web3Provider`
- `NetworkBanner`

### 4.2 Rutas principales
- `frontend/src/app/page.tsx`: entrada y enrutado por estado del usuario
- `frontend/src/app/register/page.tsx`: registro de usuario
- `frontend/src/app/dashboard/page.tsx`: resumen y accesos rapidos
- `frontend/src/app/tokens/page.tsx`: crear/listar/editar metadata de tokens
- `frontend/src/app/transfers/page.tsx`: crear/aceptar/rechazar transferencias
- `frontend/src/app/traceability/page.tsx`: linaje e historial de transferencias por token
- `frontend/src/app/profile/page.tsx`: perfil y portafolio
- `frontend/src/app/admin/page.tsx`: aprobaciones y pausa de contrato

### 4.3 Estado Web3
- `frontend/src/context/Web3Context.tsx`

Responsabilidades:
- Conexion a MetaMask
- Cuenta activa
- Deteccion de red
- Cambio/agregado de red 31337

### 4.4 Integracion con contrato
- `frontend/src/lib/contracts.ts`: address, ABI, enums y etiquetas
- `frontend/src/lib/contractFunctions.ts`: funciones de lectura/escritura on-chain
- `frontend/src/lib/errors.ts`: mensajes legibles para reverts y errores de wallet

### 4.5 Componentes UI
- `frontend/src/components/NetworkBanner.tsx`: aviso de red incorrecta

### 4.6 Estilos
- `frontend/src/styles/globals.css`

## 5) Flujo funcional de negocio

1. Usuario conecta MetaMask
2. Si no esta registrado, se registra con rol
3. Admin aprueba o rechaza
4. Usuario aprobado crea tokens (materia prima o derivados)
5. Se crean transferencias entre roles validos
6. Receptor acepta/rechaza
7. El historial queda verificable on-chain

## 6) Comandos rapidos

### 6.1 Contratos
```bash
cd SC
forge install
forge build
forge test
```

### 6.2 Red local
```bash
anvil
```

### 6.3 Deploy
```powershell
# Recomendado (deploy Anvil + sync a frontend/.env.local)
powershell -ExecutionPolicy Bypass -File scripts/deploy-local.ps1

# Alternativa manual
cd SC
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <PRIVATE_KEY>
node ../scripts/sync-contract-address.mjs
```

### 6.4 Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6.5 Verificacion automatizada
```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify.ps1
```

Detalle y resultados: `VERIFICACION_E2E.md`.

## 7) Configuracion importante

- Variable frontend:
  - `NEXT_PUBLIC_CONTRACT_ADDRESS` en `frontend/.env.local`
- Sync automatico tras deploy:
  - `node scripts/sync-contract-address.mjs`
  - o `powershell -File scripts/deploy-local.ps1` (deploy + sync)
- Si no se define, el frontend usa una direccion local por defecto en `frontend/src/lib/contracts.ts`

## 8) Observaciones tecnicas

- El contrato usa `ReentrancyGuard` y `Pausable` (OpenZeppelin).
- Hay limite de longitud para metadata en contrato.
- La vista `/traceability` usa listados on-chain (`getAllTokens` / transferencias) para linaje e historial.
- En volumen alto convendria paginar o indexar eventos off-chain.

## 9) Punto de entrada recomendado para lectura de codigo

1. `DOCUMENTO_ENTREGA.md`
2. `README.md`
3. `INDICE_PROYECTO.md` / `VERIFICACION_E2E.md`
4. `SC/src/SupplyChainTracker.sol`
5. `SC/test/SupplyChainTracker.t.sol`
6. `frontend/src/context/Web3Context.tsx`
7. `frontend/src/lib/contractFunctions.ts`
8. `frontend/src/app/page.tsx`
9. `frontend/src/app/traceability/page.tsx`
