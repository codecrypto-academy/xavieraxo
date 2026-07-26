# Deploy a Sepolia (testnet)

Guia para desplegar `SupplyChainTracker` en Ethereum Sepolia y conectar la DApp.

## Requisitos

- Foundry (`forge`)
- Node.js
- MetaMask
- ETH de Sepolia (faucet, ej. https://sepoliafaucet.com o el de Alchemy)
- RPC de Sepolia (publico o Alchemy/Infura/QuickNode)

## 1) Variables de entorno (NO subir secretos)

En PowerShell (sesion actual):

```powershell
$env:SEPOLIA_RPC_URL = "https://TU_ENDPOINT_SEPOLIA"
$env:SEPOLIA_PRIVATE_KEY = "0xTU_CLAVE_PRIVADA"
# Opcional para verificar en Etherscan:
$env:ETHERSCAN_API_KEY = "TU_API_KEY"
```

Alternativa: archivo `SC/.env` (gitignored) con:

```env
SEPOLIA_RPC_URL=https://TU_ENDPOINT_SEPOLIA
SEPOLIA_PRIVATE_KEY=0xTU_CLAVE_PRIVADA
ETHERSCAN_API_KEY=TU_API_KEY
```

> No uses las claves privadas de Anvil en Sepolia.

## 2) Deploy + sync

Desde la raiz del repo:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-sepolia.ps1
```

Con verificacion en Etherscan:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-sepolia.ps1 -Verify
```

El script:

1. Ejecuta `forge script script/Deploy.s.sol --broadcast` contra Sepolia
2. Lee `SC/broadcast/Deploy.s.sol/11155111/run-latest.json`
3. Escribe `frontend/.env.local` con:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID=11155111`

## 3) Frontend

```powershell
cd frontend
npm run dev
```

Abre http://localhost:3000 y en MetaMask selecciona **Sepolia**.  
El banner de red pedira cambiar si estas en otra chain.

## 4) Configuracion manual de MetaMask (Sepolia)

Si MetaMask no tiene Sepolia:

- Nombre: Sepolia
- RPC: el mismo de `SEPOLIA_RPC_URL` o `https://rpc.sepolia.org`
- Chain ID: `11155111`
- Simbolo: ETH
- Explorer: https://sepolia.etherscan.io

## 5) Volver a local (Anvil)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-local.ps1
```

Y en `frontend/.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CONTRACT_ADDRESS=...
```

## Troubleshooting

| Problema | Accion |
|----------|--------|
| insufficient funds | Carga Sepolia ETH en la wallet del deployer |
| nonce / replacement | Espera o resetea actividad en MetaMask |
| sync no encuentra broadcast | Confirma que el deploy termino OK y existe `SC/broadcast/.../11155111/run-latest.json` |
| DApp en red incorrecta | `NEXT_PUBLIC_CHAIN_ID=11155111` y reinicia `npm run dev` |

## Nota academica

Sepolia es testnet publica: el contrato queda visible on-chain. Para la defensa local sigue siendo valido Anvil; Sepolia demuestra despliegue real en una red EVM compartida.
