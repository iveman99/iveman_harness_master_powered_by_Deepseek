# Start iVeman Harness with Cloudflare Tunnel for public access
$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
Set-Location $workspaceRoot

# 1. Initialize Node / FNM environment
$fnmPath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\fnm.exe"
if (Test-Path $fnmPath) {
    & $fnmPath env --use-on-cd | Out-String | Invoke-Expression
}

Write-Host "Starting DeepSeek Harness server on port 3080..." -ForegroundColor Cyan
$serverJob = Start-Process -FilePath "node" -ArgumentList "$env:APPDATA\npm\node_modules\@deepseek-ai\dsh\lib\bin.js web" -PassThru -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "Starting Cloudflare Tunnel..." -ForegroundColor Green
$cloudflaredPath = "$workspaceRoot\bin\cloudflared.exe"
& $cloudflaredPath tunnel --url http://localhost:3080 --http-host-header localhost:3080
