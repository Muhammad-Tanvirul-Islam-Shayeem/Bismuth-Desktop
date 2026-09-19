# Bismuth - Rust toolchain setup (idempotent)
# Installs rustup + stable toolchain if cargo is missing.

$ErrorActionPreference = "Stop"

if (Get-Command cargo -ErrorAction SilentlyContinue) {
    Write-Host "[Bismuth] Rust toolchain already installed: $(cargo --version)" -ForegroundColor Green
    exit 0
}

Write-Host "[Bismuth] Installing Rust toolchain (rustup)..."
$rustup = Join-Path $env:TEMP "rustup-init.exe"
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile $rustup

& $rustup -y --default-toolchain stable --profile minimal
if ($LASTEXITCODE -ne 0) {
    Write-Host "[Bismuth] rustup installation failed." -ForegroundColor Red
    exit 1
}

# Add cargo to current session PATH for this process tree
$env:PATH = "$env:USERPROFILE\.cargo\bin;" + $env:PATH
Write-Host "[Bismuth] Rust installed: $(cargo --version)" -ForegroundColor Green
Write-Host "[Bismuth] Note: new shells need restart to pick up cargo." -ForegroundColor Yellow