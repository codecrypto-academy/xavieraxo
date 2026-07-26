# Smoke E2E del frontend (sin MetaMask)
# Uso (desde la raiz del repo):
#   powershell -ExecutionPolicy Bypass -File scripts/e2e-frontend.ps1
#
# Primera vez (instala Chromium para Playwright):
#   powershell -ExecutionPolicy Bypass -File scripts/e2e-frontend.ps1 -InstallBrowsers

param(
  [switch]$InstallBrowsers,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$FrontendDir = Join-Path $Root "frontend"
$Failed = $false

function Write-Step($msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Host "E2E frontend"
Write-Host "Root: $Root"

Push-Location $FrontendDir
try {
  Write-Step "npm run test:unit"
  npm run test:unit
  if ($LASTEXITCODE -ne 0) { $Failed = $true }

  if ($InstallBrowsers) {
    Write-Step "npx playwright install chromium"
    npx playwright install chromium
    if ($LASTEXITCODE -ne 0) { $Failed = $true }
  }

  if (-not $SkipBuild) {
    Write-Step "npm run build"
    npm run build
    if ($LASTEXITCODE -ne 0) {
      $Failed = $true
      throw "build fallo; no se ejecutan smoke e2e"
    }
  }

  Write-Step "npm run test:e2e"
  npm run test:e2e
  if ($LASTEXITCODE -ne 0) { $Failed = $true }
}
finally {
  Pop-Location
}

Write-Host ""
if ($Failed) {
  Write-Host "RESULTADO: FAIL" -ForegroundColor Red
  Write-Host "Si falta el browser: powershell -File scripts/e2e-frontend.ps1 -InstallBrowsers"
  exit 1
}

Write-Host "RESULTADO: OK" -ForegroundColor Green
exit 0
