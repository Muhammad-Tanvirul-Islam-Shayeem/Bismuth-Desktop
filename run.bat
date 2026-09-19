@echo off
title Bismuth - Development
cd /d "%~dp0"

where cargo >nul 2>nul
if errorlevel 1 (
    echo [Bismuth] Rust toolchain not found. Installing...
    "%USERPROFILE%\Desktop\Bismith\scripts\setup-rust.ps1"
)

echo [Bismuth] Starting Bismuth in development mode...
call npm run tauri dev