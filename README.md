# Supply Chain Tracker

Sistema de trazabilidad de cadena de suministro basado en blockchain. Los Smart Contracts están en Solidity (Foundry) y la interfaz web descentralizada (DApp) en Next.js.

## Descripción

Permite rastrear productos desde la materia prima hasta el consumidor final, usando blockchain para garantizar transparencia, seguridad e inmutabilidad de los datos.

### Características

- Gestión de roles: Productor, Factoría, Distribuidor, Consumidor y Administrador
- Registro y aprobación de usuarios por el administrador
- Tokens que representan materias primas y productos terminados
- Trazabilidad por parentesco entre tokens
- Transferencias controladas por rol con aceptación del receptor
- Eventos en blockchain para auditoría

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

1. Conectar con la cuenta admin de Anvil (ya registrada automáticamente).
2. Importar otra cuenta y registrarla como Productor.
3. Volver al admin y aprobar al usuario.
4. Crear un token como productor y transferirlo siguiendo la cadena de suministro.
5. Aceptar la transferencia desde la cuenta receptora.

## Tecnologías

- **Smart Contracts:** Solidity 0.8.24, Foundry, OpenZeppelin
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Ethers.js

## Documentación adicional

- [EJECUTAR_PROYECTO.md](EJECUTAR_PROYECTO.md) — Guía paso a paso
- [CONFIGURACION_METAMASK.md](CONFIGURACION_METAMASK.md) — Configuración de MetaMask
- [GUIA_RAPIDA_METAMASK.md](GUIA_RAPIDA_METAMASK.md) — Referencia rápida
- [EXPLICACION_DEL_PROYECTO.md](EXPLICACION_DEL_PROYECTO.md) — Mejoras de seguridad del contrato

## Autor

Proyecto final — CodeCripto Academy
