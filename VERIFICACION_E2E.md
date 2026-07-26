# Verificacion E2E del proyecto

Documento de verificacion punta a punta del MVP.
Fecha de ejecucion registrada: **2026-07-25** (rama base `entrega-proyecto-final`).

## Alcance

| Tipo | Que cubre | Como |
|------|-----------|------|
| Automatizado | Contrato + build frontend | `scripts/verify.ps1` |
| Manual (demo) | Flujo MetaMask real | [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md) |

La parte con wallet (MetaMask + Anvil) no se automatiza aqui: requiere navegador e interaccion humana.

---

## 1) Verificacion automatizada

### Comando unico

Desde la raiz del repo:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify.ps1
```

### Pasos equivalentes

```powershell
# Contratos
cd SC
forge test

# Frontend
cd ../frontend
npx tsc --noEmit
npm run build
```

### Resultado registrado (2026-07-25)

#### Foundry (`forge test`)

- Suite: `SupplyChainTracker.t.sol`
- Resultado: **16 passed, 0 failed, 0 skipped** (incluye timeout de transferencias)

#### TypeScript (`npx tsc --noEmit`)

- Resultado: **OK** (exit code 0)

#### Next.js (`npm run build`)

- Next.js: 14.2.35
- Resultado: **Compiled successfully**
- Rutas generadas:
  - `/`
  - `/admin`
  - `/dashboard`
  - `/profile`
  - `/register`
  - `/tokens`
  - `/traceability`
  - `/transfers`

#### Entorno usado en esa corrida

- Node.js: v22.17.0
- Foundry forge: 1.5.0-stable
- OS: Windows

---

## 2) Verificacion manual (demo local)

Usar [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md) con este orden minimo:

1. Anvil + `scripts/deploy-local.ps1` + `npm run dev`
2. Admin conecta y ve Panel Admin
3. Registrar/aprobar Productor y Factoria
4. Crear token + transferencia aceptada
5. Abrir `/traceability` y confirmar linaje

### Criterio de exito manual

- [ ] Wallet conecta en chain 31337
- [ ] Transacciones confirman en MetaMask
- [ ] Tokens y transferencias visibles en UI
- [ ] Trazabilidad muestra linaje y/o historial

---

## 3) Criterio global de "listo para demo"

El proyecto se considera verificado para entrega academica local si:

1. `scripts/verify.ps1` termina en OK
2. El checklist de demo se completa al menos hasta transferencia aceptada
3. La address del contrato esta sincronizada (`frontend/.env.local`)

---

## 4) Si falla

| Fallo | Accion |
|-------|--------|
| `forge test` falla | Revisar `SC/test/SupplyChainTracker.t.sol` y dependencias (`forge install`) |
| `tsc` / `build` falla | Revisar errores TypeScript en `frontend/src` |
| MetaMask no conecta | Anvil activo + red 31337 ([EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md)) |
| Tx revierten | Redeploy + `node scripts/sync-contract-address.mjs` y reiniciar `npm run dev` |

---

## 5) Relacion con otras guias

- Setup: [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md)
- Demo guiada: [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)
- Mapa tecnico: [INDICE_PROYECTO.md](INDICE_PROYECTO.md)
