# Documento de entrega — Supply Chain Tracker

**Proyecto final — CodeCripto Academy**  
**Categoría:** Plataforma de Trazabilidad Logística para Envíos y Cadena de Suministro (blockchain EVM)  
**Rama de entrega:** `entrega-proyecto-final`  
**Fecha de este documento:** 2026-07-25

---

## 1. Resumen ejecutivo

MVP de trazabilidad logística on-chain: productos y mercancías se modelan como tokens con metadata JSON; cada movimiento entre actores queda como transferencia verificable en una blockchain EVM local (Anvil) con wallet MetaMask.

El sistema garantiza:

- Identidad por wallet + roles de negocio
- Aprobación administrativa de participantes
- Linaje de productos (`parentTokenId`)
- Historial de transferencias auditable
- Controles de emergencia (pausa) y timeout de transferencias pendientes

---

## 2. Objetivos cumplidos

| Objetivo | Estado |
|----------|--------|
| Smart contract de cadena de suministro | Cumplido (`SupplyChainTracker.sol`) |
| DApp Next.js + MetaMask | Cumplido |
| Flujo Producer → Factory → Retailer → Consumer | Cumplido (tests + demo) |
| Trazabilidad visual (linaje + historial) | Cumplido (`/traceability`) |
| Deploy local reproducible + sync de address | Cumplido (`scripts/deploy-local.ps1`) |
| Verificación automatizada | Cumplido (`scripts/verify.ps1`, 32 tests) |
| Documentación de ejecución y demo | Cumplido |

---

## 3. Arquitectura

```text
[Usuario + MetaMask]
        |
        v
[Frontend Next.js 14 / TypeScript / Ethers v6]
        |
        | JSON-RPC
        v
[Anvil localhost:8545 — Chain ID 31337]
        |
        v
[Contrato SupplyChainTracker]
```

### Capas

1. **On-chain (`SC/`)** — lógica de negocio, roles, tokens, transferencias, eventos.
2. **Frontend (`frontend/`)** — UI, conexión wallet, lectura/escritura al contrato.
3. **Scripts (`scripts/`)** — deploy local, sync de address, verificación.

### Diagrama de flujo de negocio

```text
Registro (rol) --> Admin aprueba --> Crear token
                                      |
                                      v
                         Crear transferencia (roles validos)
                                      |
                    +-----------------+------------------+
                    |                                    |
                    v                                    v
              Receptor acepta                    Receptor rechaza
                    |                            / Timeout expira
                    v                                    |
              Balance al receptor              Balance vuelve al emisor
                    |
                    v
         (opcional) Token derivado con parentTokenId
                    |
                    v
              Vista /traceability (linaje + historial)
```

---

## 4. Roles y reglas de transferencia

| Rol | Función |
|-----|---------|
| Admin | Aprueba/rechaza/cancela usuarios; pausa/despausa el contrato |
| Producer | Crea materia prima; transfiere a Factory |
| Factory | Puede crear derivados; recibe de Producer; envía a Retailer |
| Retailer (Distribuidor) | Recibe de Factory; envía a Consumer |
| Consumer | Recibe de Retailer |

**Cadena válida de transferencias:**

- Producer → Factory  
- Factory → Retailer  
- Retailer → Consumer  

Otras combinaciones son rechazadas por el contrato.

**Estados de usuario:** NotRegistered → Pending → Approved | Rejected | Cancelled  

**Estados de transferencia:** Pending → Accepted | Rejected | Expired  

---

## 5. Funcionalidades principales

### Contrato

- Registro con rol y nombre
- Aprobación / rechazo / cancelación (admin)
- Tokens con metadata y parentesco
- Edición de metadata por owner
- Transferencias con reserva de balance
- Timeout (`TRANSFER_TIMEOUT` = 30 días) + `expireTransfer`
- Pausa de emergencia (`Pausable` + `ReentrancyGuard`)

### DApp (rutas)

| Ruta | Propósito |
|------|-----------|
| `/` | Conexión y enrutado por estado de usuario |
| `/register` | Alta de usuario |
| `/dashboard` | Métricas y accesos rápidos |
| `/tokens` | Crear / listar / editar metadata |
| `/transfers` | Crear / aceptar / rechazar / expirar |
| `/traceability` | Linaje e historial por token |
| `/profile` | Perfil y portafolio |
| `/admin` | Gestión de usuarios y pausa |

### Utilidades

- Sync automático de address: `scripts/deploy-local.ps1` / `sync-contract-address.mjs`
- Errores legibles: `frontend/src/lib/errors.ts`
- Verificación: `scripts/verify.ps1`

---

## 6. Stack tecnológico

- Solidity 0.8.24, Foundry (forge, anvil), OpenZeppelin
- Next.js 14, React 18, TypeScript, Tailwind CSS, Ethers.js v6
- MetaMask (Chain ID 31337)

---

## 7. Cómo ejecutar (resumen)

Detalle completo: [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md)

```powershell
# Contratos
cd SC
forge install
forge build
forge test

# Blockchain (otra terminal)
anvil

# Deploy + sync address (raiz del repo)
powershell -ExecutionPolicy Bypass -File scripts/deploy-local.ps1

# Frontend
cd frontend
npm install
npm run dev
```

Abrir http://localhost:3000 con MetaMask en Localhost 8545.

**Demo guiada (5–10 min):** [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)  
**Verificación automatizada:** [VERIFICACION_E2E.md](VERIFICACION_E2E.md)

---

## 8. Evidencia de verificación

Corrida documentada en el proyecto:

- `forge test`: **32 passed**
- Cobertura aproximada del contrato: **~96% líneas / ~71% ramas**
- `npx tsc --noEmit`: OK
- `npm run build`: OK (incluye `/traceability`)

Comando único:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify.ps1
```

---

## 9. Capturas sugeridas para la defensa

Incluir en la presentación (o anexo) capturas de:

1. MetaMask conectado a Localhost 8545 (Chain ID 31337)
2. Home / Dashboard con cuenta Admin
3. Registro de Productor + aprobación en Panel Admin
4. Creación de token (materia prima) en `/tokens`
5. Transferencia pendiente y aceptación en `/transfers`
6. Token derivado y vista `/traceability` con linaje
7. (Opcional) Pausa del contrato desde Admin
8. (Opcional) Mensaje de error legible tras una acción inválida

> Las capturas se toman en runtime local; no se versionan binarios de imagen en el repo para mantenerlo liviano.

---

## 10. Estructura del repositorio

```text
SC/            contratos, tests, deploy Foundry
frontend/      DApp Next.js
scripts/       deploy-local, sync-address, verify
docs .md       README, INDICE, EJECUTAR, CHECKLIST, VERIFICACION, este documento
```

Mapa técnico: [INDICE_PROYECTO.md](INDICE_PROYECTO.md)  
Seguridad del contrato: [EXPLICACION_DEL_PROYECTO.md](EXPLICACION_DEL_PROYECTO.md)

---

## 11. Limitaciones conocidas (MVP académico)

- Ejecución pensada para red local (Anvil), no producción/mainnet
- Listados on-chain sin indexer externo (suficiente para demo; escala limitada)
- `Token.owner` pasa al receptor solo cuando el emisor queda con balance 0; con saldos compartidos cualquier titular con balance puede editar metadata
- Timeout de 30 días: en demo real suele mostrarse con `vm.warp` en tests

---

## 12. Conclusión

El proyecto entrega un MVP funcional y documentado de trazabilidad logística en blockchain EVM: contrato con reglas de cadena de suministro, DApp operable con MetaMask, trazabilidad visible, scripts de operación y batería de tests para defensa académica.

**Punto de entrada recomendado para evaluadores:**

1. Este documento  
2. [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)  
3. [VERIFICACION_E2E.md](VERIFICACION_E2E.md)  
4. `SC/src/SupplyChainTracker.sol`  
5. `frontend/src/app/traceability/page.tsx`
