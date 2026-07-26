# Verificacion automatizada del MVP
# Uso (desde la raiz del repo):
#   powershell -ExecutionPolicy Bypass -File scripts/verify.ps1

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$ScDir = Join-Path $Root "SC"
$FrontendDir = Join-Path $Root "frontend"
$Failed = $false

function Write-Step($msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Host "Verificacion E2E automatizada"
Write-Host "Root: $Root"

Write-Step "forge test"
Push-Location $ScDir
try {
  forge test
  if ($LASTEXITCODE -ne 0) { $Failed = $true }
}
finally {
  Pop-Location
}

Write-Step "npx tsc --noEmit"
Push-Location $FrontendDir
try {
  npx tsc --noEmit
  if ($LASTEXITCODE -ne 0) { $Failed = $true }

  Write-Step "npm run build"
  npm run build
  if ($LASTEXITCODE -ne 0) { $Failed = $true }
}
finally {
  Pop-Location
}

Write-Host ""
if ($Failed) {
  Write-Host "RESULTADO: FAIL" -ForegroundColor Red
  exit 1
}

Write-Host "RESULTADO: OK" -ForegroundColor Green
Write-Host "Siguiente: checklist manual en CHECKLIST_DEMO.md / VERIFICACION_E2E.md"
exit 0
