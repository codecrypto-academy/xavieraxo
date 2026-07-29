# Supply Chain Tracker — TFM / Proyecto Final

## Descripción

MVP de **trazabilidad logística on-chain** para monitorizar productos, envíos y mercancías a lo largo de la cadena de suministro (origen → destino), con transparencia y verificabilidad en blockchain EVM.

Los smart contracts están en **Solidity (Foundry)** y la DApp en **Next.js + MetaMask + ethers.js**.

## Problema que resuelve

En cadenas de suministro tradicionales es difícil auditar el recorrido real de un producto: los registros suelen estar fragmentados, ser modificables off-chain y poco transparentes entre actores. Este proyecto concentra identidad (roles), tokens de mercancía, transferencias con aceptación y linaje de productos en un contrato inteligente consultable desde una DApp.

## Tecnologías utilizadas

- **Blockchain:** Ethereum-compatible (Anvil local / Sepolia testnet)
- **Smart Contracts:** Solidity 0.8.24, Foundry, OpenZeppelin (ReentrancyGuard, Pausable)
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Ethers.js v6
- **Wallet:** MetaMask
- **IA / herramientas:** Cursor (asistencia de desarrollo y documentación)

## Arquitectura del sistema

Ver diagramas Mermaid en [docs/diagramas.md](docs/diagramas.md).

```text
Usuario + MetaMask → Frontend Next.js → RPC (Anvil/Sepolia) → SupplyChainTracker.sol
```

## Instalación y configuración

### Requisitos previos

- Node.js 18+
- Foundry (`forge`, `anvil`)
- MetaMask

### Instalación

```powershell
cd SC
forge install
forge build

cd ..\frontend
npm install
```

### Configuración

1. Arrancar Anvil: `anvil`
2. Deploy + sync address:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\deploy-local.ps1
   ```
3. Frontend:
   ```powershell
   cd frontend
   npm run dev
   ```
4. Abrir http://localhost:3000 y conectar MetaMask a **Localhost 8545** (Chain ID `31337`).

Guía detallada: [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md) · MetaMask: [GUIA_RAPIDA_METAMASK.md](GUIA_RAPIDA_METAMASK.md)

### Deploy Sepolia (opcional)

Ver [DEPLOY_SEPOLIA.md](DEPLOY_SEPOLIA.md).

## Smart contracts desplegados

| Red | Chain ID | Notas |
|-----|----------|--------|
| Anvil (local) | 31337 | Address en `frontend/.env.local` tras `deploy-local.ps1` |
| Sepolia | 11155111 | Tras `scripts/deploy-sepolia.ps1` + sync |

Contrato principal: `SC/src/SupplyChainTracker.sol`

## Casos de uso

1. Registro y aprobación de actores (Productor, Factoría, Retailer, Consumidor)
2. Creación de tokens (materia prima / producto con metadata JSON)
3. Transferencias con aceptación / rechazo / cancelación / expiración
4. Consulta de trazabilidad (linaje + historial)
5. Administración (aprobaciones, pausa de emergencia)

## Capturas de pantalla

Ver carpeta [screenshots/](screenshots/).

## Diagramas técnicos

[docs/diagramas.md](docs/diagramas.md)

## Video demostración

🎥 [Ver demostración completa en Loom](https://www.loom.com/share/c30d1e405cda47cd877ba46b9ad1925b)

## Innovaciones implementadas (respecto al esqueleto base)

- Timeout y expiración de transferencias pendientes
- Cancelación de transferencia por el emisor
- Re-registro tras rechazo/cancelación
- Vista de trazabilidad (linaje + historial)
- Paginación de listados en UI
- Alineación owner/balance en transferencias parciales
- Restricción de materia prima al rol Productor
- Script de deploy Sepolia + soporte multi-red en frontend
- Smoke E2E Playwright + tests de contrato (~41) y verify automatizado
- Modo capturas opcional (`NEXT_PUBLIC_DEMO_UI`, OFF por defecto)

## Uso de herramientas de IA

Desarrollo asistido con **Cursor** para implementación de features, tests, documentación de entrega y scripts de verificación. El código y la lógica de negocio fueron revisados y ejecutados localmente (forge test, build, demo MetaMask).

## Verificación

```powershell
powershell -ExecutionPolicy Bypass -File scripts\verify.ps1
powershell -ExecutionPolicy Bypass -File scripts\e2e-frontend.ps1
```

Detalle: [VERIFICACION_E2E.md](VERIFICACION_E2E.md) · Demo: [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)

## Documentación adicional

- [DOCUMENTO_ENTREGA.md](DOCUMENTO_ENTREGA.md)
- [INDICE_PROYECTO.md](INDICE_PROYECTO.md)
- [EXPLICACION_DEL_PROYECTO.md](EXPLICACION_DEL_PROYECTO.md)

## Autor

- **Proyecto:** Supply Chain Tracker — CodeCripto Academy
- **Rama de trabajo:** `entrega-proyecto-final`

## Licencia

MIT License — ver [LICENSE](LICENSE)
