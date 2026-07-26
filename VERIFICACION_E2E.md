# Verificacion E2E del proyecto

Documento de verificacion punta a punta del MVP.
Fecha de ejecucion registrada: **2026-07-25** (rama base `entrega-proyecto-final`).

## Alcance

| Tipo | Que cubre | Como |
|------|-----------|------|
| Automatizado | Contrato + unit frontend + build | `scripts/verify.ps1` |
| Smoke UI | Rutas clave sin MetaMask | `scripts/e2e-frontend.ps1` |
| Manual (demo) | Flujo MetaMask real | [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md) |

La parte con wallet (MetaMask + Anvil) no se automatiza aqui: requiere navegador e interaccion humana.
Los smoke de Playwright validan que las paginas renderizan (home, registro, trazabilidad, etc.) sin wallet.

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
npm run test:unit
npm run build
```

### Smoke E2E frontend (Playwright)

Primera vez:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/e2e-frontend.ps1 -InstallBrowsers
```

Corridas siguientes:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/e2e-frontend.ps1
```

Equivale a `npm run build` + `npm run test:e2e` en `frontend/` (ademas de `test:unit`).

### Resultado registrado (2026-07-25)

#### Foundry (`forge test`)

- Suite: `SupplyChainTracker.t.sol`
- Resultado: **41 passed, 0 failed, 0 skipped** (incluye alineacion owner/balance)
- Cobertura aproximada del contrato (`forge coverage`): ~96% lineas / ~71% ramas


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
2. (Opcional recomendado) `scripts/e2e-frontend.ps1` termina en OK
3. El checklist de demo se completa al menos hasta transferencia aceptada
4. La address del contrato esta sincronizada (`frontend/.env.local`)

---

## 4) Si falla

| Fallo | Accion |
|-------|--------|
| `forge test` falla | Revisar `SC/test/SupplyChainTracker.t.sol` y dependencias (`forge install`) |
| `tsc` / `build` falla | Revisar errores TypeScript en `frontend/src` |
| `test:unit` falla | Revisar `frontend/src/lib/pagination.ts` |
| Playwright e2e falla | `npx playwright install chromium` y `npm run build` previo |
| MetaMask no conecta | Anvil activo + red 31337 ([EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md)) |
| Tx revierten | Redeploy + `node scripts/sync-contract-address.mjs` y reiniciar `npm run dev` |

---

## 5) Relacion con otras guias

- Setup: [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md)
- Demo guiada: [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)
- Mapa tecnico: [INDICE_PROYECTO.md](INDICE_PROYECTO.md)
