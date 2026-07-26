# Plataforma de Trazabilidad Logística Basada en Blockchain

MVP de trazabilidad logística para monitorizar productos, envíos y mercancías a lo largo de toda la cadena de distribución, desde su origen hasta el destino final, garantizando transparencia y verificabilidad on-chain.

Los Smart Contracts están en Solidity (Foundry) y la interfaz web descentralizada (DApp) en Next.js.

> **Categoría del proyecto:** Plataforma de Trazabilidad Logística para Envíos y Cadena de Suministro (blockchain EVM).

## Descripción

El sistema modela la cadena de suministro como una secuencia de actores con roles definidos. Cada producto o mercancía se representa como un token con metadata (JSON), y cada movimiento entre actores queda registrado como una transferencia verificable en la blockchain. Así se puede rastrear el recorrido completo de un producto y auditar cada paso.

### Características

- Gestión de roles: Productor, Factoría, Distribuidor, Consumidor y Administrador
- Registro y aprobación de usuarios por el administrador
- Tokens que representan materias primas, productos o mercancías en tránsito
- Trazabilidad por parentesco entre tokens (origen → destino)
- Transferencias controladas por rol con aceptación del receptor
- Eventos en blockchain para auditoría y verificabilidad
- Panel de administración y listados de tokens y transferencias en la DApp

## Estructura del proyecto

```
├── SC/                 # Smart Contracts (Foundry)
│   ├── src/
│   ├── test/
│   └── script/
├── frontend/           # DApp (Next.js + TypeScript)
│   └── src/
├── EJECUTAR_PROYECTO.md
├── CONFIGURACION_METAMASK.md
└── GUIA_RAPIDA_METAMASK.md
```

## Requisitos

- Node.js 18+
- Foundry (forge, anvil)
- MetaMask en el navegador

## Inicio rápido

Sigue la guía detallada en [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md).

```powershell
# 1. Dependencias del contrato
cd SC
forge install
forge build
forge test

# 2. Blockchain local (terminal aparte)
anvil

# 3. Desplegar contrato
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 4. Frontend
cd ../frontend
npm install
npm run dev
```

Abre http://localhost:3000 y conecta MetaMask a la red Localhost 8545 (Chain ID 31337).

## Demo sugerida

Checklist minuto a minuto (5-10 min): [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)

1. Conectar con la cuenta admin de Anvil (ya registrada automáticamente).
2. Importar otra cuenta y registrarla como Productor.
3. Volver al admin y aprobar al usuario.
4. Crear un token como productor y transferirlo siguiendo la cadena de suministro.
5. Aceptar la transferencia desde la cuenta receptora.

## Tecnologías

- **Smart Contracts:** Solidity 0.8.24, Foundry, OpenZeppelin
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Ethers.js

## Documentación adicional

- [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md) — Checklist de demo (5-10 min)
- [INDICE_PROYECTO.md](INDICE_PROYECTO.md) — Mapa técnico del proyecto
- [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md) — Guía paso a paso
- [CONFIGURACION_METAMASK.md](CONFIGURACION_METAMASK.md) — Configuración de MetaMask
- [GUIA_RAPIDA_METAMASK.md](GUIA_RAPIDA_METAMASK.md) — Referencia rápida
- [EXPLICACION_DEL_PROYECTO.md](EXPLICACION_DEL_PROYECTO.md) — Mejoras de seguridad del contrato

## Autor

Proyecto final — CodeCripto Academy
