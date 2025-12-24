# 🦊 Guía Rápida: Instalar y Configurar MetaMask

## 📥 Instalación de MetaMask

### 1. Descargar MetaMask
- **Sitio oficial:** https://metamask.io/download/
- **Compatible con:** Chrome, Firefox, Brave, Edge

### 2. Instalar la Extensión
1. Click en "Install MetaMask"
2. Se abrirá la tienda de extensiones de tu navegador
3. Click en "Agregar/Add to [navegador]"
4. Click en el ícono de extensiones (🧩) y fija MetaMask

### 3. Configuración Inicial (Si es tu primera vez)
1. Click en "Comenzar"
2. Selecciona "Crear una nueva billetera"
3. Acepta los términos
4. Crea una contraseña segura
5. **MUY IMPORTANTE:** Guarda tu frase de recuperación de 12 palabras en un lugar seguro
6. Confirma la frase de recuperación
7. ¡Listo!

---

## 🔧 Configuración para Este Proyecto

### Paso A: Agregar Red Local (Anvil)

1. **Abre MetaMask** (click en el ícono de zorro)

2. **Click en el selector de red** (arriba, donde dice "Ethereum Mainnet" o similar)

3. **Scroll hasta abajo** y click en **"Agregar red"**

4. **Click en "Agregar red manualmente"** (abajo)

5. **Completa EXACTAMENTE estos datos:**

```
Nombre de la red:          Localhost 8545
Nueva URL de RPC:          http://127.0.0.1:8545
ID de cadena:              31337
Símbolo de moneda:         ETH
URL del explorador:        (déjalo vacío)
```

6. **Click en "Guardar"**

7. **Cambia a esta red** - Click en el selector de red y elige "Localhost 8545"

---

### Paso B: Importar Cuenta con Fondos (Admin)

Anvil proporciona cuentas de prueba con 10,000 ETH cada una.

1. **En MetaMask, click en el ícono de cuenta** (arriba derecha, círculo con tus iniciales)

2. **Click en "Importar cuenta"**

3. **Selecciona "Clave privada"**

4. **Pega esta clave privada:**
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

5. **Click en "Importar"**

6. **Renombra la cuenta (opcional):**
   - Click en los tres puntos ⋮ → "Detalles de la cuenta"
   - Click en el lápiz ✏️ junto al nombre
   - Escribe "Admin - Anvil" o similar
   - Click en ✓

7. **¡Deberías ver 10,000 ETH!** 🎉

---

### Paso C: Importar Más Cuentas (Opcional)

Para probar diferentes roles (Productor, Distribuidor, etc.):

**Cuenta 2 (Para Usuario Normal):**
```
Clave privada: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Dirección:     0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Cuenta 3:**
```
Clave privada: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Dirección:     0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

**Repite el Paso B para cada cuenta que quieras importar.**

---

## 🚀 Usar con la Aplicación

### 1. Asegúrate de que Anvil esté corriendo

En una terminal:
```powershell
anvil
```

Debe mostrar "Listening on 127.0.0.1:8545"

### 2. Asegúrate de que el frontend esté corriendo

En otra terminal:
```powershell
cd frontend
npm run dev
```

### 3. Abre la aplicación en tu navegador

**Abre:** http://localhost:3000

(En tu navegador donde instalaste MetaMask, NO en el navegador de Cursor)

### 4. Conectar MetaMask

1. **Click en "Conectar MetaMask"** en la aplicación
2. **Se abrirá una ventana de MetaMask** pidiendo permiso
3. **Selecciona la cuenta que quieres usar** (Admin - Anvil)
4. **Click en "Siguiente"**
5. **Click en "Conectar"**
6. **¡Listo!** Deberías ver tu dirección arriba a la derecha

---

## 🎯 Flujo de Prueba Completo

### Como ADMIN (Primera cuenta):

1. **Usa la cuenta Admin** (la que importaste primero)
2. Conecta MetaMask
3. Deberías ver **"Panel Admin"** en el menú
4. Puedes aprobar/rechazar usuarios

### Como Usuario Nuevo:

1. **En MetaMask, cambia a la Cuenta 2** (click en el ícono de cuenta arriba)
2. **Recarga la página** (F5)
3. **Conecta MetaMask** nuevamente (selecciona Cuenta 2)
4. **Click en "Registrarse"**
5. Selecciona un rol (Productor, Factoría, etc.)
6. Ingresa tu nombre
7. **Click en "Registrar Usuario"**
8. **MetaMask mostrará una ventana** → **Click en "Confirmar"**
9. Espera 2-3 segundos
10. Tu estado será **"Pendiente"**

### Aprobar al Usuario:

1. **En MetaMask, cambia de vuelta a la cuenta Admin**
2. **Recarga la página**
3. **Ve a "Panel Admin"**
4. Verás el nuevo usuario con estado "Pendiente"
5. **Click en "Aprobar"**
6. **Confirma la transacción en MetaMask**
7. ¡Usuario aprobado! ✅

---

## ⚠️ Problemas Comunes

### "No tengo fondos / 0 ETH"

**Causas:**
- Anvil no está corriendo
- Estás en la red equivocada
- La cuenta no está importada correctamente

**Solución:**
1. Verifica que Anvil esté corriendo: `anvil`
2. En MetaMask, verifica que estés en "Localhost 8545"
3. Reimporta la cuenta si es necesario

### "Error al conectar / No se puede conectar"

**Solución:**
1. Asegúrate de que Anvil esté corriendo
2. Verifica que el frontend esté corriendo en http://localhost:3000
3. Abre la aplicación en el navegador donde instalaste MetaMask (NO en el de Cursor)

### "La transacción falla"

**Solución:**
1. Verifica que tengas suficiente ETH
2. Asegúrate de estar en la red "Localhost 8545"
3. Reinicia Anvil y redespliega el contrato si es necesario

### "Cada vez que reinicio Anvil pierdo los datos"

**Esto es normal.** Anvil no persiste datos por defecto. Cada vez que lo inicias, es una blockchain nueva. Para "resetear todo":

1. Cierra Anvil (Ctrl+C)
2. Inicia Anvil: `anvil`
3. Redespliega el contrato:
```powershell
cd SC
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
4. Actualiza la dirección del contrato en `frontend/src/lib/contracts.ts` si cambió
5. Reinicia el frontend
6. En MetaMask, cambia a otra red y vuelve a "Localhost 8545" (para refrescar el balance)

---

## 🔐 Seguridad

### ⚠️ ADVERTENCIAS IMPORTANTES:

1. **NUNCA uses estas claves privadas en redes reales** (Mainnet, testnets públicos, etc.)
2. **Estas claves son públicas** - Todos las conocen
3. **Solo para desarrollo local con Anvil**
4. **Para producción, crea cuentas nuevas y NUNCA compartas tus claves**

### Buenas Prácticas:

- ✅ Usa MetaMask solo para desarrollo/pruebas
- ✅ Ten una cuenta separada para producción
- ✅ Guarda tu frase de recuperación en un lugar seguro
- ✅ Nunca compartas tu clave privada con nadie
- ✅ Verifica la red antes de hacer transacciones

---

## 📱 Atajos de Teclado en MetaMask

- **Abrir MetaMask:** `Alt + Shift + M` (Windows/Linux) o `Option + Shift + M` (Mac)
- **Cerrar ventana emergente:** `Esc`

---

## 🆘 Recursos Adicionales

- **Documentación oficial de MetaMask:** https://docs.metamask.io/
- **Soporte de MetaMask:** https://support.metamask.io/
- **Documentación de Anvil:** https://book.getfoundry.sh/anvil/

---

¡Ahora estás listo para usar MetaMask con tu proyecto! 🎉

