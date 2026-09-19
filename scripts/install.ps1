#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Installs Bismuth - Modern Windows Customization App
.DESCRIPTION
    One-line installer:
    irm https://raw.githubusercontent.com/yourname/bismuth/main/scripts/install.ps1 | iex
#>

$ErrorActionPreference = "Stop"

$INSTALL_DIR = "$env:LOCALAPPDATA\Bismuth"
$GITHUB_REPO = "https://github.com/yourname/bismuth"
$RELEASE_URL = "$GITHUB_REPO/releases/latest/download"

Write-Host ""
Write-Host "  Bismuth Installer" -ForegroundColor Cyan
Write-Host "  =================" -ForegroundColor DarkGray
Write-Host ""

# Check Windows version
$build = [Environment]::OSVersion.Version.Build
if ($build -lt 19041) {
    Write-Host "  [!] Bismuth requires Windows 10 build 19041 or later." -ForegroundColor Red
    exit 1
}

# Create install directory
if (-not (Test-Path $INSTALL_DIR)) {
    Write-Host "  Creating install directory..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null
}

# Download latest release
Write-Host "  Downloading latest release..." -ForegroundColor Gray
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $release = Invoke-RestMethod "$GITHUB_REPO/releases/latest" -UseBasicParsing
    $asset = $release.assets | Where-Object { $_.name -match ".*\.msi$" -or $_.name -match ".*\.exe$" } | Select-Object -First 1

    if (-not $asset) {
        Write-Host "  [!] No installer found in latest release." -ForegroundColor Red
        exit 1
    }

    $installer = Join-Path $env:TEMP $asset.name
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $installer -UseBasicParsing
    Write-Host "  Downloaded: $($asset.name)" -ForegroundColor Green
} catch {
    Write-Host "  [!] Download failed: $_" -ForegroundColor Red
    exit 1
}

# Run installer silently
Write-Host "  Running installer..." -ForegroundColor Gray
if ($installer -match "\.msi$") {
    Start-Process msiexec.exe -ArgumentList "/i `"$installer`" /qn /norestart" -Wait -Verb RunAs
} else {
    Start-Process $installer -ArgumentList "/S" -Wait -Verb RunAs
}

Write-Host ""
Write-Host "  Bismuth installed successfully!" -ForegroundColor Green
Write-Host "  Launch from Start Menu or run: $INSTALL_DIR\Bismuth.exe" -ForegroundColor Gray
Write-Host ""

# Cleanup
Remove-Item $installer -Force -ErrorAction SilentlyContinue