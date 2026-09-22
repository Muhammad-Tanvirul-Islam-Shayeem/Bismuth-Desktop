# Bismuth Desktop

Bismuth is a modern Windows customization app built with Tauri, React, and TypeScript. It gives users a clean, high-performance desktop interface for managing personalization, power, display, and system behavior in one place.

## Overview

Bismuth focuses on the idea of a lightweight, customizable Windows control center. Instead of scattering settings across the system, the app brings key customization options together in a polished and streamlined experience.

## Features

- Personalized UI theming and visual styling
- Display and productivity-oriented adjustments
- Power and performance controls
- Safety-focused system guidance and protections
- Modular architecture for future expansion
- Native desktop experience via Tauri
- Fast UI built with React + Vite

## Tech Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Desktop shell: Tauri
- State management: Zustand
- Animation: Framer Motion
- Icons: Lucide React

## Project Structure

```text
.
├── src/                  # React application source
│   ├── components/       # Reusable UI components
│   ├── hooks/            # App hooks
│   ├── modules/          # Feature modules
│   ├── stores/           # Zustand stores
│   ├── themes/           # Theme system
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app layout
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styling
├── src-tauri/            # Tauri backend / native app config
│   ├── src/              # Rust backend source
│   ├── icons/            # App icons
│   ├── Cargo.toml        # Rust dependencies
│   ├── tauri.conf.json   # Tauri config
│   └── build.rs          # Build script
├── scripts/              # Helper scripts
├── user-scripts/         # User-specific script area
├── index.html            # Vite entry HTML
├── package.json          # Node project config
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind config
├── run.bat               # Windows run shortcut
├── run.ps1               # PowerShell launcher
├── app-icon.png          # App icon asset
└── README.md             # Project documentation
```

## Getting Started

## Getting Started

### Prerequisites

Before setting up the project, make sure you have the following installed on your machine.

#### 1. Node.js & npm
* **Download:** Visit [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** version.
* **Winget:** `winget install OpenJS.NodeJS.LTS`
* **Verify:** Open terminal and run `node -v` (should be v18 or later) and `npm -v`.

#### 2. Visual Studio 2022 C++ Build Tools
Tauri requires C++ build dependencies on Windows to compile native binaries.
* **Download:** Download the installer from [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
* **Installation Setup:** During setup, make sure to check the **"Desktop development with C++"** workload and ensure **"Windows 10/11 SDK"** is selected.

#### 3. Rust Toolchain
* **Download:** Go to [rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) to download and run `rustup-init.exe`.
* **Winget:** `winget install Rustlang.Rustup`
* **Configuration:** Choose default installation option (select the `msvc` toolchain if prompted).
* **Verify:** Open a new terminal window and run `rustc --version` and `cargo --version`.

#### 4. Microsoft Edge WebView2
*(Pre-installed on most modern Windows 10/11 machines)*
* **Download:** If missing, download the **Evergreen Bootstrapper** from [Microsoft WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run tauri dev
```

### Build for production

```bash
npm run tauri build
```

### Alternative quick launch

On Windows, you can also use the included scripts:

```powershell
./run.ps1
```

or

```bat
run.bat
```

## Development Notes

This project uses a modular app architecture, where features are organized into dedicated modules such as display, power, performance, safety, and UI customization. This allows for easier maintenance and future expansion without cluttering the main application logic.

## Contributing

Contributions are welcome. If you want to improve the app, add features, or fix issues, feel free to open a pull request or work from a feature branch.

## Roadmap

The app is positioned as a customizable Windows productivity and personalization tool. Future work may include broader configuration controls, more polished module views, and additional system integrations.
