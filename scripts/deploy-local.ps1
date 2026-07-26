# Deploy local (Anvil) + sync de address al frontend
# Uso (desde la raiz del repo, con Anvil corriendo):
#   powershell -ExecutionPolicy Bypass -File scripts/deploy-local.ps1

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$ScDir = Join-Path $Root "SC"
$PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
$RpcUrl = "http://127.0.0.1:8545"

Write-Host "Desplegando SupplyChainTracker en $RpcUrl ..."
Push-Location $ScDir
try {
  forge script script/Deploy.s.sol --rpc-url $RpcUrl --broadcast --private-key $PrivateKey
  if ($LASTEXITCODE -ne 0) {
    throw "forge script fallo con codigo $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Sincronizando address hacia frontend/.env.local ..."
node (Join-Path $Root "scripts/sync-contract-address.mjs") --chain-id 31337
if ($LASTEXITCODE -ne 0) {
  throw "sync-contract-address fallo con codigo $LASTEXITCODE"
}

Write-Host ""
Write-Host "Listo. Si el frontend esta corriendo, reinicia npm run dev."
