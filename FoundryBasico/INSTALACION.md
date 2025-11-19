# 📥 Instalación de Foundry

Guía para instalar Foundry en diferentes sistemas operativos.

## 🪟 Windows

### Opción 1: PowerShell (Recomendada)

1. Abrir PowerShell como Administrador

2. Ejecutar el instalador:
```powershell
# Descargar e instalar Foundry
iex (iwr -useb https://raw.githubusercontent.com/foundry-rs/foundry/master/foundryup/install)
```

3. Cerrar y reabrir PowerShell

4. Actualizar Foundry:
```powershell
foundryup
```

### Opción 2: WSL (Windows Subsystem for Linux)

1. Instalar WSL2 (si no lo tienes):
```powershell
wsl --install
```

2. Abrir Ubuntu/WSL y seguir las instrucciones de Linux

### Opción 3: Scoop

```powershell
scoop install foundry
```

## 🐧 Linux / macOS

### Instalación Estándar

```bash
# Descargar e instalar
curl -L https://foundry.paradigm.xyz | bash

# Actualizar PATH (si es necesario, reiniciar terminal)
source ~/.bashrc  # o ~/.zshrc en macOS

# Instalar las herramientas
foundryup
```

### Requisitos Previos (Linux)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install build-essential

# Fedora/RHEL
sudo dnf groupinstall "Development Tools"

# Arch Linux
sudo pacman -S base-devel
```

## ✅ Verificar Instalación

```bash
# Verificar que forge está instalado
forge --version

# Debería mostrar algo como: forge 0.x.x

# Verificar otras herramientas
cast --version
anvil --version
chisel --version
```

## 🔧 Configurar el Proyecto

Una vez instalado Foundry:

```bash
# Navegar al proyecto
cd FoundryBasico

# Instalar dependencias (ya están instaladas en este proyecto)
# forge install

# Compilar
forge build

# Ejecutar tests
forge test
```

## 🛠️ Herramientas de Foundry

Foundry incluye 4 herramientas principales:

### 1. Forge
```bash
forge build     # Compilador de Solidity
forge test      # Framework de testing
forge script    # Deployment y scripts
```

### 2. Cast
```bash
cast call       # Llamar funciones de contratos
cast send       # Enviar transacciones
cast balance    # Ver balance de una address
```

### 3. Anvil
```bash
anvil          # Blockchain local para desarrollo
```

### 4. Chisel
```bash
chisel         # REPL de Solidity para testing rápido
```

## 🔄 Actualizar Foundry

```bash
# Actualizar a la última versión
foundryup

# Actualizar a una versión específica
foundryup --version 0.2.0

# Actualizar a una versión nightly
foundryup --branch master
```

## 🐛 Solución de Problemas

### Forge no se reconoce como comando

**Windows:**
1. Verificar que `~/.foundry/bin` está en el PATH
2. Reiniciar la terminal
3. Si persiste, agregar manualmente al PATH

**Linux/macOS:**
```bash
export PATH="$HOME/.foundry/bin:$PATH"
echo 'export PATH="$HOME/.foundry/bin:$PATH"' >> ~/.bashrc
```

### Error de permisos

**Linux/macOS:**
```bash
chmod +x ~/.foundry/bin/*
```

### Error de compilación

```bash
# Limpiar cache y recompilar
forge clean
forge build --force
```

### Dependencias no encontradas

```bash
# Reinstalar dependencias
rm -rf lib/
git submodule update --init --recursive
```

## 📦 Dependencias del Sistema

### Git
Foundry requiere Git instalado:

**Windows:**
```powershell
winget install Git.Git
```

**Linux:**
```bash
sudo apt install git  # Ubuntu/Debian
sudo dnf install git  # Fedora
```

**macOS:**
```bash
brew install git
```

### Rust (Opcional)
Para compilar Foundry desde el código fuente:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## 🌐 Recursos

- [Documentación oficial](https://book.getfoundry.sh/)
- [Repositorio de GitHub](https://github.com/foundry-rs/foundry)
- [Discord de Foundry](https://discord.gg/foundry)

## 💡 Consejos Post-Instalación

1. **Configurar VSCode** (si usas VSCode):
   - Instalar extensión "Solidity" de Juan Blanco
   - Configurar formatter para usar `forge fmt`

2. **Alias útiles** (opcional):
   ```bash
   # Agregar a ~/.bashrc o ~/.zshrc
   alias ft="forge test -vv"
   alias fb="forge build"
   alias fc="forge clean"
   ```

3. **Configurar Git hooks** (opcional):
   ```bash
   # Pre-commit hook para formatear código
   echo "forge fmt" > .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

## ✨ ¡Listo!

Una vez instalado, puedes:

```bash
cd FoundryBasico
forge build
forge test -vv
```

---

**¿Problemas?** Consulta la [documentación oficial](https://book.getfoundry.sh/getting-started/installation) o abre un issue en el repositorio.

