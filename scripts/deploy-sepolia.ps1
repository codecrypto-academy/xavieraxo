# Deploy a Sepolia + sync de address al frontend
# Requisitos:
#   - Variables de entorno SEPOLIA_RPC_URL y SEPOLIA_PRIVATE_KEY
#   - Opcional: ETHERSCAN_API_KEY para -Verify
# Uso (desde la raiz del repo):
#   powershell -ExecutionPolicy Bypass -File scripts/deploy-sepolia.ps1
#   powershell -ExecutionPolicy Bypass -File scripts/deploy-sepolia.ps1 -Verify

param(
  [switch]$Verify
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$ScDir = Join-Path $Root "SC"
$ChainId = "11155111"
$EnvLocal = Join-Path $Root "frontend\.env.local"

if (-not $env:SEPOLIA_RPC_URL) {
  throw "Falta SEPOLIA_RPC_URL (ej. https://rpc.sepolia.org o un endpoint Alchemy/Infura)"
}
if (-not $env:SEPOLIA_PRIVATE_KEY) {
  throw "Falta SEPOLIA_PRIVATE_KEY (clave de una wallet con Sepolia ETH). No uses la PK de Anvil."
}

Write-Host "Desplegando SupplyChainTracker en Sepolia..."
Write-Host "RPC: $($env:SEPOLIA_RPC_URL)"

$forgeArgs = @(
  "script", "script/Deploy.s.sol",
  "--rpc-url", $env:SEPOLIA_RPC_URL,
  "--broadcast",
  "--private-key", $env:SEPOLIA_PRIVATE_KEY
)

if ($Verify) {
  if (-not $env:ETHERSCAN_API_KEY) {
    throw "Para -Verify necesitas ETHERSCAN_API_KEY"
  }
  $forgeArgs += @("--verify", "--etherscan-api-key", $env:ETHERSCAN_API_KEY)
}

Push-Location $ScDir
try {
  & forge @forgeArgs
  if ($LASTEXITCODE -ne 0) {
    throw "forge script fallo con codigo $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Sincronizando address hacia frontend/.env.local (chain $ChainId) ..."
node (Join-Path $Root "scripts\sync-contract-address.mjs") --chain-id $ChainId
if ($LASTEXITCODE -ne 0) {
  throw "sync-contract-address fallo con codigo $LASTEXITCODE"
}

# Asegura que el frontend apunte a Sepolia
$lines = @()
if (Test-Path $EnvLocal) {
  $lines = Get-Content $EnvLocal
}
$hasChain = $false
$hasRpc = $false
$newLines = foreach ($line in $lines) {
  if ($line -match '^NEXT_PUBLIC_CHAIN_ID=') {
    $hasChain = $true
    "NEXT_PUBLIC_CHAIN_ID=$ChainId"
  } elseif ($line -match '^NEXT_PUBLIC_RPC_URL=') {
    $hasRpc = $true
    "NEXT_PUBLIC_RPC_URL=$($env:SEPOLIA_RPC_URL)"
  } else {
    $line
  }
}
if (-not $hasChain) { $newLines += "NEXT_PUBLIC_CHAIN_ID=$ChainId" }
if (-not $hasRpc) { $newLines += "NEXT_PUBLIC_RPC_URL=$($env:SEPOLIA_RPC_URL)" }
Set-Content -Path $EnvLocal -Value $newLines

Write-Host ""
Write-Host "Listo. Reinicia npm run dev y conecta MetaMask a Sepolia."
Write-Host "Guia: DEPLOY_SEPOLIA.md"
