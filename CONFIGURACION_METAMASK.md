# 🦊 Guía Completa: Configuración de MetaMask para el Proyecto

## ⚠️ Problema Común: "No tengo crédito en MetaMask"

Si ves que tu cuenta de MetaMask muestra **0 ETH** o no tiene fondos, es porque estás conectado a la red equivocada o no has configurado correctamente la red local de Anvil.

---

## 📋 Solución Paso a Paso

### ✅ Paso 1: Verificar que Anvil esté corriendo

**Antes de hacer CUALQUIER COSA**, asegúrate de que Anvil esté corriendo:

1. Abre una terminal
2. Ejecuta: `anvil`
3. Deberías ver:
```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000.000000000000000000 ETH)
...
Listening on 127.0.0.1:8545
```

**⚠️ IMPORTANTE:** Si Anvil no está corriendo, MetaMask no podrá conectarse y no tendrás fondos.

---

### ✅ Paso 2: Agregar la Red Local en MetaMask

1. **Abre MetaMask** en tu navegador

2. **Click en el selector de red** (arriba, donde dice el nombre de la red actual)

3. **Click en "Agregar red"**

4. **Click en "Agregar red manualmente"** (abajo)

5. **Completa los siguientes campos EXACTAMENTE:**
   ```
   Nombre de la red:     Localhost 8545
   Nueva URL de RPC:     http://127.0.0.1:8545
   ID de cadena:         31337
   Símbolo de moneda:    ETH
   URL del explorador:   (déjalo vacío)
   ```

6. **Click en "Guardar"**

7. **Cambia a esta red** haciendo click en el selector de red y eligiendo "Localhost 8545"

---

### ✅ Paso 3: Importar una Cuenta con Fondos

Anvil proporciona 10 cuentas de prueba, cada una con **10,000 ETH**. Vamos a importar la primera (que es la cuenta ADMIN):

1. **En MetaMask, click en el ícono de cuenta** (arriba derecha, círculo con iniciales)

2. **Click en "Importar cuenta"**

3. **Selecciona "Clave privada"**

4. **Pega la siguiente clave privada:**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

5. **Click en "Importar"**

6. **¡LISTO!** Deberías ver **10,000 ETH** en tu cuenta

---

### ✅ Paso 4: Verificar la Conexión

1. **Abre la aplicación:** http://localhost:3000

2. **Click en "Conectar MetaMask"**

3. **MetaMask te pedirá permiso:**
   - Selecciona la cuenta que importaste (Account 1 o similar)
   - Click en "Siguiente"
   - Click en "Conectar"

4. **Deberías ver:**
   - Tu dirección en la esquina superior derecha
   - Un panel de navegación (Dashboard, Tokens, etc.)
   - **10,000 ETH** disponibles

---

## 🔍 Solución de Problemas

### "Sigo sin ver fondos en MetaMask"

**Causa 1: Estás en la red equivocada**
- **Solución:** Verifica que MetaMask esté conectado a "Localhost 8545" (31337)
- Mira el selector de red en la parte superior de MetaMask

**Causa 2: Anvil no está corriendo**
- **Solución:** Abre una terminal y ejecuta `anvil`
- Mantén esa terminal abierta mientras usas la aplicación

**Causa 3: La cuenta no está importada correctamente**
- **Solución:** Elimina la cuenta de MetaMask e impórtala nuevamente
- Verifica que uses la clave privada completa (empieza con `0x`)

**Causa 4: Reiniciaste Anvil**
- **Problema:** Cada vez que reinicias Anvil, es una blockchain nueva (sin historial)
- **Solución:** 
  1. Cierra y abre MetaMask
  2. O cambia a otra red y vuelve a "Localhost 8545"
  3. Los fondos deberían aparecer (siempre son 10,000 ETH al inicio)

---

## 📝 Entendiendo las Cuentas de Anvil

Anvil proporciona **10 cuentas de prueba**. Aquí están las primeras 3:

### Cuenta 0 (ADMIN) - ⭐ Esta es la principal
```
Dirección:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Clave Privada: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Rol:           Administrador del contrato
Fondos:        10,000 ETH
```

### Cuenta 1 - Para probar como Productor/Distribuidor
```
Dirección:     0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Clave Privada: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Fondos:        10,000 ETH
```

### Cuenta 2 - Para probar como otro usuario
```
Dirección:     0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Clave Privada: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Fondos:        10,000 ETH
```

**Nota:** Puedes importar todas las cuentas que necesites para probar diferentes roles.

---

## 🎯 Flujo Completo de Prueba

### 1. Como ADMIN (Cuenta 0):
1. Importa la Cuenta 0 en MetaMask
2. Conecta MetaMask a la aplicación
3. Deberías ver el **Panel Admin** en el menú
4. Puedes aprobar/rechazar usuarios
5. Puedes ver todos los tokens y transferencias

### 2. Como Usuario Nuevo (Cuenta 1):
1. **Importa la Cuenta 1** en MetaMask:
   - Click en el ícono de cuenta → "Importar cuenta"
   - Pega: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
   
2. **Cambia a la Cuenta 1** en MetaMask (click en el ícono de cuenta)

3. **Recarga la página** (F5)

4. **Click en "Conectar MetaMask"** y selecciona la Cuenta 1

5. **Regístrate:**
   - Click en "Registrarse"
   - Selecciona un rol (Productor, Factoría, Distribuidor, Consumidor)
   - Ingresa tu nombre
   - Click en "Registrar Usuario"
   - MetaMask te pedirá **confirmar la transacción** → Click en "Confirmar"
   - Espera unos segundos

6. **Tu estado será "Pendiente"** hasta que el admin te apruebe

### 3. Aprobar Usuario (como ADMIN):
1. **Cambia a la Cuenta 0** en MetaMask
2. **Recarga la página**
3. **Ve a "Panel Admin"**
4. Deberías ver el nuevo usuario con estado "Pendiente"
5. Click en **"Aprobar"**
6. Confirma la transacción en MetaMask
7. El usuario ahora está **"Aprobado"**

### 4. Usar el Sistema (como Usuario Aprobado):
1. **Cambia a la Cuenta 1** en MetaMask
2. **Recarga la página**
3. Ahora deberías ver:
   - Dashboard
   - Crear Token
   - Mis Tokens
   - Transferencias
   - etc.

---

## ⚡ Comandos Útiles para Resetear

### Si algo sale mal, resetea todo:

1. **Detén Anvil:** Presiona `Ctrl+C` en la terminal de Anvil

2. **Inicia Anvil nuevamente:** `anvil`

3. **Redespliega el contrato:**
   ```powershell
   cd SC
   forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

4. **Sincroniza la dirección del contrato** con:
   `node scripts/sync-contract-address.mjs`
   (o usa `scripts/deploy-local.ps1` que hace deploy + sync)

5. **Reinicia el frontend:** 
   - Presiona `Ctrl+C` en la terminal del frontend
   - Ejecuta: `npm run dev`

6. **En MetaMask:**
   - Cambia a otra red (ej: Ethereum Mainnet)
   - Vuelve a "Localhost 8545"
   - Tus fondos deberían volver a 10,000 ETH

---

## 🔐 Seguridad

**⚠️ NUNCA uses estas claves privadas en una red real (Mainnet, Testnet, etc.)**

Estas claves son públicas y conocidas por todos. Solo úsalas para desarrollo local con Anvil.

Para producción:
- Crea cuentas nuevas
- Usa variables de entorno
- NUNCA commits claves privadas al repositorio

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué necesito importar la cuenta si Anvil ya tiene fondos?**

R: MetaMask es una billetera separada. Anvil crea las cuentas en la blockchain local, pero MetaMask necesita la clave privada para "controlar" esa cuenta.

**P: ¿Puedo usar otra cuenta que no sea la primera?**

R: Sí, puedes importar cualquiera de las 10 cuentas de Anvil. Todas tienen 10,000 ETH.

**P: ¿Los fondos desaparecen cuando cierro Anvil?**

R: Sí, Anvil no persiste datos por defecto. Cada vez que lo inicias, es una blockchain nueva con los fondos reseteados a 10,000 ETH por cuenta.

**P: ¿Necesito hacer algo especial después de hacer una transacción?**

R: No, Anvil confirma las transacciones instantáneamente. Solo espera 1-2 segundos y recarga la página si es necesario.

---

¡Ahora deberías poder usar el proyecto sin problemas de crédito! 🎉

