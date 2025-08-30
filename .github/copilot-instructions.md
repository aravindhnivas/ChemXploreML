# ChemXploreML - GitHub Copilot Instructions

**ALWAYS follow these instructions first** and only fall back to additional search and context gathering if the information here is incomplete or found to be in error.

ChemXploreML is a Tauri-based desktop application for molecular property prediction using machine learning. It consists of a TypeScript/Svelte frontend with a Rust backend, and interfaces with external Python scripts for ML computations.

## Working Effectively

### Prerequisites and Setup

**ALWAYS install these prerequisites in order:**

1. **Node.js (v20+) and pnpm**:

    ```bash
    # Verify Node.js is available
    node --version  # Should show v20+
    npm install -g pnpm@8
    pnpm --version  # Should show 8.x
    ```

2. **Rust toolchain**:

    ```bash
    # Verify Rust is available
    rustc --version  # Should show v1.80+
    cargo --version
    ```

3. **System dependencies (Linux only)**:

    ```bash
    # Ubuntu/Debian
    sudo apt update
    sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

    # Note: Ubuntu 24.04+ uses libwebkit2gtk-4.1-dev (not 4.0-dev)
    ```

### Build and Development

**Bootstrap the project:**

```bash
cd /path/to/ChemXploreML
pnpm install
# Takes ~60 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
```

**Development workflow:**

```bash
# Start frontend development server
pnpm dev
# Server runs at http://localhost:1420
# Press Ctrl+C to stop

# Build frontend only
pnpm build
# Takes ~45 seconds. NEVER CANCEL. Set timeout to 90+ seconds.

# Full Tauri build (frontend + Rust backend)
npx tauri build --ignore-version-mismatches
# Takes 5-6 minutes. NEVER CANCEL. Set timeout to 600+ seconds.
# The --ignore-version-mismatches flag is REQUIRED due to version mismatches between Rust and npm packages.
```

**Development mode (with Rust backend):**

```bash
npx tauri dev --ignore-version-mismatches
# Takes 3-4 minutes for initial compilation. NEVER CANCEL. Set timeout to 600+ seconds.
# Subsequent runs are faster due to incremental compilation.
```

### Validation and Testing

**ALWAYS run these validation steps before completing work:**

```bash
# 1. Type checking (will show warnings but should not fail on critical errors)
pnpm run check
# Takes ~15 seconds. Set timeout to 60+ seconds.

# 2. Code formatting (auto-fixes formatting issues)
pnpm run format
# Takes ~5 seconds.

# 3. Test that frontend builds successfully
pnpm build
# Should complete without errors.

# 4. Test that dev server starts
pnpm dev
# Check http://localhost:1420 responds, then stop with Ctrl+C.
```

### Common Issues and Solutions

**Version mismatch errors:**

- Always use `--ignore-version-mismatches` flag with Tauri commands
- This is expected due to pinned npm package versions vs latest Rust crates

**Build failures:**

- On first build, Rust compilation downloads many dependencies (normal)
- If build hangs, wait at least 10 minutes before considering it failed
- AppImage bundling may fail but .deb and .rpm should succeed

**Missing auto-imports:**

- The project uses unplugin-auto-import, so imports like `toast`, `fs`, `path` are automatically available
- If you see "not defined" warnings, check `vite.config.ts` AutoImport configuration

## Project Structure

### Key directories:

- `src/` - TypeScript/Svelte frontend code
- `src-tauri/` - Rust backend code and Tauri configuration
- `docs/` - VitePress documentation (separate build system)
- `src/lib/pyserver/` - Python integration layer
- `src/pages/` - Application pages/views
- `src/lib/components/` - Reusable Svelte components

### Important files:

- `package.json` - npm dependencies and scripts
- `src-tauri/Cargo.toml` - Rust dependencies
- `src-tauri/tauri.conf.json` - Tauri app configuration
- `vite.config.ts` - Frontend build configuration
- `.env` - Environment variables (includes Python package info)

## External Dependencies

**Python Integration:**

- The app interfaces with an external Python package `cxml_py`
- In development mode, set `pythonscript` path in settings
- In production, the app expects the `cxml_py` package to be installed
- Python scripts run as separate processes, not embedded

**Key environment variables (from .env):**

- `VITE_pypackage='cxml_py'` - Python package name
- `VITE_pyrepo='cxml_py'` - Python repository name
- `VITE_username='aravindhnivas'` - GitHub username

## Build Artifacts

**Successful build produces:**

- `src-tauri/target/release/ChemXploreML` - Main binary (Linux)
- `src-tauri/target/release/bundle/deb/ChemXploreML_*.deb` - Debian package
- `src-tauri/target/release/bundle/rpm/ChemXploreML-*.rpm` - RPM package
- AppImage may fail to build but is not critical

## Validation Scenarios

**After making changes, ALWAYS verify:**

1. **Frontend builds successfully**: `pnpm build` completes without errors
2. **Dev server starts**: `pnpm dev` serves content at localhost:1420
3. **Types are valid**: `pnpm run check` shows expected warnings but no new critical errors
4. **Code is formatted**: `pnpm run format` runs without issues
5. **Full build works**: `npx tauri build --ignore-version-mismatches` produces binaries

**Manual testing scenarios:**

- Load the app in development mode (`pnpm dev`)
- Navigate to different pages (Home, Load File, ML Training, etc.)
- Check that the Python server integration UI appears in settings
- Verify molecular visualization components load without errors

## Performance Expectations

**Build times (add 50% buffer for timeouts):**

- `pnpm install`: 60 seconds → timeout: 120 seconds
- `pnpm build`: 45 seconds → timeout: 90 seconds
- `npx tauri build`: 6 minutes → timeout: 600 seconds
- `pnpm run check`: 15 seconds → timeout: 60 seconds
- Initial `npx tauri dev`: 4 minutes → timeout: 600 seconds

## CI/CD Information

**GitHub Actions workflow:**

- `.github/workflows/release.yml` - Multi-platform release builds
- `.github/workflows/deploy-docs.yml` - Documentation deployment
- Builds for macOS (Intel/ARM/Universal), Ubuntu, Windows
- Uses pnpm with caching for faster builds

**CRITICAL REMINDERS:**

- NEVER CANCEL long-running builds - they are expected to take 5-10 minutes
- ALWAYS use `--ignore-version-mismatches` with Tauri commands
- The app is a desktop application - it cannot run without a display (but builds successfully)
- Python integration requires separate setup - the main app builds independently
