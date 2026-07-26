# 🚀 Cómo Ejecutar el Proyecto - Guía Paso a Paso

## 📋 Pre-requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado y configurado:

- ✅ Foundry (forge, anvil) - [Guía oficial de instalación](https://book.getfoundry.sh/getting-started/installation)
- ✅ Node.js y npm
- ✅ Dependencias del frontend instaladas (`npm install` en la carpeta `frontend`)
- ✅ MetaMask instalado en tu navegador

**Nota:** Si no tienes Foundry instalado, sigue la [guía oficial](https://book.getfoundry.sh/getting-started/installation) (`curl -L https://foundry.paradigm.xyz | bash` y luego `foundryup`).

---

## 📦 Paso 1: Compilar el Smart Contract

```powershell
cd SC
forge build
```

**Deberías ver:** `Compiler run successful`

---

## 🧪 Paso 2: Probar el Contrato (Opcional pero Recomendado)

```powershell
forge test
```

---

## 🔗 Paso 3: Iniciar Anvil (Blockchain Local)

**Abre una NUEVA terminal** y ejecuta:

```powershell
anvil
```

**⚠️ MANTÉN ESTA TERMINAL ABIERTA** - Verás algo como:

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Listening on 127.0.0.1:8545
```

**📝 Nota:** Guarda la primera clave privada, la necesitarás para MetaMask (es la cuenta admin).

---

## 🚀 Paso 4: Desplegar el Contrato

**Abre OTRA terminal nueva** (deja Anvil corriendo):

```powershell
cd SC
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Busca en el output:**
```
== Return ==
Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**📝 Copia esa dirección del contrato** (será algo como `0x...`)

---

## ⚙️ Paso 5: Configurar el Frontend

Edita el archivo `frontend/src/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
// ↑ Reemplaza con la dirección que copiaste en el paso anterior
```

---

## 🦊 Paso 6: Configurar MetaMask (Solo la Primera Vez)

**⚠️ IMPORTANTE:** Debes usar tu **navegador real** (Chrome, Edge, Firefox, Brave) donde tengas MetaMask instalado, **NO el navegador automatizado de Cursor**.

**📥 Si no tienes MetaMask instalado:** Ver [GUIA_RAPIDA_METAMASK.md](GUIA_RAPIDA_METAMASK.md) para instrucciones de instalación.

**Si ya configuraste MetaMask anteriormente, salta este paso.**

1. **Abre MetaMask** en tu navegador

2. **Agregar Red Local:**
   - Click en el selector de red (arriba)
   - Click en "Agregar red" → "Agregar red manualmente"
   - Completa:
     - **Nombre de la red:** `Localhost 8545`
     - **Nueva URL de RPC:** `http://127.0.0.1:8545`
     - **ID de cadena:** `31337`
     - **Símbolo de moneda:** `ETH`
     - **URL del explorador:** (déjalo vacío)
   - Click en "Guardar"

3. **Importar Cuenta de Prueba (Admin):**
   - Click en el ícono de cuenta (arriba derecha)
   - Click en "Importar cuenta"
   - Selecciona "Clave privada"
   - Pega la clave privada de la primera cuenta de Anvil:
     ```
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     ```
   - Click en "Importar"
   
   **Esta cuenta es el ADMIN** (ya está registrada automáticamente en el contrato)

---

## 🎨 Paso 7: Ejecutar el Frontend

**Abre OTRA terminal nueva** (deja Anvil corriendo):

```powershell
cd frontend
npm run dev
```

Deberías ver:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

**⚠️ MANTÉN ESTA TERMINAL ABIERTA**

---

## 🌐 Paso 8: Usar la Aplicación

**⚠️ IMPORTANTE:** Abre la aplicación en tu **navegador real** (Chrome, Edge, Firefox, Brave) donde instalaste MetaMask.

1. Abre en tu navegador: **http://localhost:3000**

2. Click en **"Conectar MetaMask"**

3. Si te pide seleccionar red, elige **"Localhost 8545"**

4. **Deberías ver:**
   - Como eres admin (cuenta importada en el Paso 6), ya estás registrado
   - Verás opciones de Dashboard, Tokens, Transfers, Admin Panel, etc.

---

## 🎬 Checklist de demo (5-10 min)

Para una demostración guiada del flujo completo (admin → roles → tokens → transferencias), usa:

- [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md)

---

## ✅ Verificación Rápida

Para probar que todo funciona:

1. **Ve a "Panel Admin"** - Deberías ver que eres administrador
2. **Importa otra cuenta** en MetaMask (segunda cuenta de Anvil):
   - Clave privada: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
3. **Cambia a esa cuenta** en MetaMask
4. **Ve a la página principal** - Deberías ver "Registrarse"
5. **Regístrate como Productor**
6. **Vuelve a la cuenta admin** y aprueba el usuario desde "Panel Admin"

---

## 📋 Resumen de Terminales Necesarias

Para ejecutar el proyecto necesitas **2 terminales** abiertas simultáneamente:

1. **Terminal 1:** Anvil corriendo (blockchain local) - `anvil`
2. **Terminal 2:** Frontend corriendo - `npm run dev`

**Opcional:** Una tercera terminal para comandos adicionales (compilar, testear, etc.)

---

## 🔍 Solución de Problemas

### "forge: comando no encontrado" o "anvil: comando no encontrado"
- **Causa:** Foundry no está instalado o no está en el PATH
- **Solución:** Revisa la documentación de instalación de Foundry

### "Error al conectar MetaMask"
- Verifica que Anvil esté corriendo en Terminal 1
- Verifica que MetaMask tenga la red "Localhost 8545" agregada
- Verifica que el Chain ID sea `31337`

### "El contrato no funciona"
- Verifica que la dirección en `frontend/src/lib/contracts.ts` sea correcta
- Verifica que el contrato se haya desplegado correctamente (Paso 4)
- Asegúrate de haber copiado la dirección correcta del output del deployment

### "Puerto 3000 en uso"
```powershell
cd frontend
npm run dev -- -p 3001
```
Luego abre: http://localhost:3001

### "Error de compilación del contrato"
- Verifica que estés en la carpeta `SC` al ejecutar `forge build`
- Asegúrate de que Foundry esté correctamente instalado

---

## 🎯 Comandos Rápidos de Referencia

```powershell
# Compilar el contrato
forge build

# Probar el contrato
forge test

# Iniciar blockchain local
anvil

# Desplegar el contrato
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Iniciar el frontend
npm run dev
```

---

¡Listo! 🎉 Ahora tienes todo funcionando.

