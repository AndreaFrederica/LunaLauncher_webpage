# Luna Launcher Website

This is the static website for Luna Launcher, hosted via GitHub Pages.

## About
Luna Launcher is a custom Minecraft launcher. This website serves as the landing page for the project.

The landing page also links to LunaUI custom panel scripting docs:

- `docs/lunaui/README.md`
- `docs/lunaui/lunaui.d.ts`

## Development
This website is a simple static HTML site. To make changes, edit `index.html`.

---

# Building Luna Launcher

## NextGen Build (Meson + Pixi) — Recommended

The new build system uses **Meson** with **Pixi** for dependency management. This is the recommended way to build Luna Launcher.

### Prerequisites

- [Pixi](https://pixi.sh/latest/installation/)
- **Windows:** Visual Studio 2022 Build Tools (from x64 Native Tools Command Prompt)
- **Linux:** `gcc`, `g++`, `pkg-config`, Qt 6 dev libraries

### Quick Start

```bash
# Clone with submodules
git clone --recursive https://github.com/AndreaFrederica/LunaLauncher.git
cd LunaLauncher

# Configure + Build + Install
pixi run configure
pixi run build
pixi run install
```

### Available Tasks

| Command | Description |
|---------|-------------|
| `pixi run configure` | Configure Meson build directory |
| `pixi run build` | Compile with Meson |
| `pixi run install` | Install to `install-{profile}/` |
| `pixi run deploy` | Deploy Qt runtime DLLs (Windows only) |
| `pixi run test` | Run built executable |
| `pixi run clean-all` | Remove all build directories |

### Build Profiles

| Profile | Description |
|---------|-------------|
| `release` (default) | Release build, static libraries |
| `debug` | Debug build, shared libraries |
| `linux-x64-gcc-release` | Linux cross-compile from Windows |

```bash
pixi run build --profile debug
```

### Offline Test Build (Automated Testing Only)

For CI/automated testing, you can build with ownership checks disabled:

```powershell
# PowerShell
$env:LUNA_DISABLE_OWNERSHIP_CHECK = "1"
$env:LUNA_BUILD_DIR = "test-offline/build"
$env:LUNA_INSTALL_DIR = "test-offline/install"
pixi run build debug
```

Or use the built-in task:

```bash
pixi run build-test-offline
```

> **Warning:** The offline test build disables Minecraft ownership verification. This is for automated testing only — do NOT use in production builds.

### Isolated Builds (Multi-branch)

Use `LUNA_BUILD_DIR` and `LUNA_INSTALL_DIR` to isolate builds per branch:

```bash
LUNA_BUILD_DIR=branch-a/build LUNA_INSTALL_DIR=branch-a/install pixi run build debug
```

Relative paths resolve against the project root.

---

## Legacy Build (CMake) — Deprecated

> **Note:** The CMake-based build system is **deprecated** and will be removed in a future release. Please migrate to the Meson + Pixi build system above.

<details>
<summary>Click to expand legacy CMake build instructions</summary>

### Windows (MSYS2)

```bash
# Install MSYS2 UCRT64 toolchain
pacboy -S toolchain:p cmake:p ninja:p qt6-base:p qt6-5compat:p qt6-svg:p qt6-imageformats:p quazip-qt6:p extra-cmake-modules:p ccache:p

# Configure
cmake -Bbuild -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=install

# Build + Install
cmake --build build
cmake --install build
```

### Windows (MSVC)

```cmd
REM From x64 Native Tools Command Prompt
cmake -Bbuild -G Ninja -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=install -DCMAKE_PREFIX_PATH=C:\Qt\6.x.x\msvc2022_64\lib\cmake
cmake --build build
cmake --install build
```

### Linux / macOS

See [upstream Prism Launcher docs](https://prismlauncher.org/wiki/development/).

</details>
