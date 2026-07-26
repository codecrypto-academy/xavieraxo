# Checklist de demo (5-10 minutos)

Guia corta para demostrar el MVP de punta a punta.
Setup completo (Anvil, deploy, MetaMask, frontend): ver EJECUTAR_PROYECTO.md.

## Antes de empezar

- [ ] Anvil corriendo en http://127.0.0.1:8545 (Chain ID 31337)
- [ ] Contrato desplegado y address actualizada en frontend/src/lib/contracts.ts (o .env.local)
- [ ] Frontend en http://localhost:3000
- [ ] MetaMask en red Localhost 8545

### Cuentas Anvil a importar

Usa las claves que imprime Anvil al iniciar. Las default habituales:

Admin (#0)
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Productor (#1)
0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Factoria (#2)
0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Opcional para demo extendida: importar tambien #3 (Retailer) y #4 (Consumidor) desde la salida de Anvil.

---

## Minuto a minuto

### 1) Admin conectado (1 min)

- [ ] En MetaMask, cuenta Admin (#0)
- [ ] Abrir http://localhost:3000 y conectar wallet
- [ ] Confirmar acceso a Dashboard y Panel Admin
- [ ] En Admin, ver estado del contrato (no pausado)

### 2) Registrar Productor y Factoria (2 min)

Para cuentas #1 y #2:

- [ ] Cambiar cuenta en MetaMask
- [ ] Ir a Registro
- [ ] Completar nombre y rol (Productor / Factoria)
- [ ] Confirmar la transaccion en MetaMask
- [ ] Verificar estado Pendiente

### 3) Aprobar usuarios (1 min)

- [ ] Volver a cuenta Admin
- [ ] Panel Admin -> usuarios pendientes
- [ ] Aprobar Productor y Factoria
- [ ] Confirmar que pasan a Aprobado

### 4) Crear materia prima (1 min)

- [ ] Cuenta Productor
- [ ] Tokens -> crear token
- [ ] Metadata ejemplo: {"nombre":"Cafe Verde","origen":"Colombia"}
- [ ] Parent token: 0 (materia prima)
- [ ] Supply inicial: 100
- [ ] Anotar el tokenId creado (ej. #1)

### 5) Transferencia Productor -> Factoria (2 min)

- [ ] Cuenta Productor -> Transfers
- [ ] Crear transferencia del token al address de Factoria, amount 50
- [ ] Cuenta Factoria -> aceptar transferencia pendiente
- [ ] Verificar balance en Profile o Dashboard

### 6) Token derivado (opcional, +2 min)

- [ ] Cuenta Factoria -> Tokens -> crear token con parent = token del cafe
- [ ] Metadata: {"nombre":"Cafe Tostado","lote":"A1"}
- [ ] Supply: 40
- [ ] Verificar en Tokens el texto "Deriva del token #N"

### 7) Cierre rapido (1 min)

- [ ] Admin: mostrar listado de usuarios y tokens
- [ ] (Opcional) Pausar contrato y verificar que no se pueden crear tokens
- [ ] (Opcional) Reanudar contrato

---

## Demo extendida (si hay tiempo)

Retailer (#3) y Consumidor (#4):

- [ ] Registrar y aprobar ambos roles
- [ ] Factoria transfiere producto a Retailer -> aceptar
- [ ] Retailer transfiere a Consumidor -> aceptar
- [ ] Mostrar portafolio del Consumidor

---

## Resultado esperado

Al terminar debes poder mostrar:

1. Usuarios con roles aprobados
2. Al menos un token de materia prima
3. Al menos una transferencia aceptada entre roles
4. (Ideal) un token derivado con parent distinto de 0
5. Historial visible en Transfers / Profile

## Si algo falla

Sintoma: MetaMask no conecta
Revisar: Anvil activo + red 31337

Sintoma: transacciones revierten
Revisar: address del contrato desactualizada tras redeploy

Sintoma: usuario no puede crear tokens
Revisar: estado Approved + contrato no pausado

Sintoma: no aparece transferencia
Revisar: cuenta receptora correcta + amount <= balance

Sintoma: datos desaparecieron
Revisar: Anvil se reinicio -> redeploy + repetir flujo

## Tiempo objetivo

- Setup ya hecho: 5-8 min
- Setup incluido (primera vez): 10-15 min (usar primero EJECUTAR_PROYECTO.md)
