# Bismuth - one-command development launcher
# Usage:  & .\run.ps1
# This starts the Tauri dev server and launches the Bismuth app window.

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Set-Location $ProjectRoot

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "[Bismuth] Rust toolchain not found. Installing rustup..." -ForegroundColor Yellow
    & "scripts\setup-rust.ps1"
}

Write-Host "[Bismuth] Starting development mode (Ctrl+C to stop)..." -ForegroundColor Cyan
npm run tauri dev