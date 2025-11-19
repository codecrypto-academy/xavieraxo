# FoundryBasico - Proyecto Base de Foundry

Proyecto base de Foundry configurado y listo para comenzar a desarrollar smart contracts en Solidity.

## 📋 Contenido

Este proyecto incluye:
- ✅ Estructura de carpetas estándar de Foundry
- ✅ Dependencias instaladas (forge-std, OpenZeppelin)
- ✅ Contrato de ejemplo (`MiPrimerContrato.sol`)
- ✅ Tests completos con múltiples patrones de testing
- ✅ Script de deployment
- ✅ Configuración optimizada de Foundry

## 📁 Estructura del Proyecto

```
FoundryBasico/
├── src/                          # Contratos Solidity
│   └── MiPrimerContrato.sol     # Contrato de ejemplo
├── test/                         # Tests
│   └── MiPrimerContrato.t.sol   # Tests del contrato de ejemplo
├── script/                       # Scripts de deployment
│   └── DeployMiPrimerContrato.s.sol
├── lib/                          # Dependencias
│   ├── forge-std/               # Librería estándar de Foundry
│   └── openzeppelin-contracts/  # Contratos de OpenZeppelin
├── foundry.toml                 # Configuración de Foundry
├── remapping.txt                # Remapeos de imports
└── README.md                    # Este archivo
```

## 🚀 Comandos Principales

### Compilación

```bash
# Compilar todos los contratos
forge build

# Compilar con información detallada
forge build --force
```

### Testing

```bash
# Ejecutar todos los tests
forge test

# Ejecutar tests con detalles (verbosity)
forge test -vv

# Ejecutar tests con trazas completas
forge test -vvvv

# Ejecutar un test específico
forge test --match-test testIncrementar

# Ejecutar tests de un contrato específico
forge test --match-contract MiPrimerContratoTest

# Ver cobertura de tests
forge coverage
```

### Deployment

```bash
# Simular deployment (no deployar realmente)
forge script script/DeployMiPrimerContrato.s.sol:DeployMiPrimerContrato

# Deployar en una red local (Anvil)
# Primero iniciar Anvil en otra terminal:
anvil

# Luego deployar:
forge script script/DeployMiPrimerContrato.s.sol:DeployMiPrimerContrato \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast
```

### Formateo

```bash
# Formatear código
forge fmt

# Verificar formato sin cambiar archivos
forge fmt --check
```

### Limpieza

```bash
# Limpiar archivos de compilación
forge clean
```

## 📝 Contrato de Ejemplo: MiPrimerContrato

El contrato de ejemplo demuestra conceptos básicos de Solidity y Foundry:

### Características

- **Herencia**: Hereda de `Ownable` de OpenZeppelin
- **Variables de estado**: `mensaje` (string) y `contador` (uint256)
- **Eventos**: `MensajeCambiado` y `ContadorIncrementado`
- **Modificadores de acceso**: Funciones públicas y funciones solo para el owner
- **Validaciones**: Requires para validar inputs

### Funciones Principales

```solidity
// Obtener el mensaje actual
function obtenerMensaje() public view returns (string memory)

// Cambiar el mensaje (solo owner)
function cambiarMensaje(string memory _nuevoMensaje) public onlyOwner

// Incrementar el contador
function incrementar() public

// Incrementar el contador por una cantidad
function incrementarPor(uint256 _cantidad) public

// Reiniciar el contador (solo owner)
function reiniciarContador() public onlyOwner
```

## 🧪 Tests

Los tests demuestran varios patrones importantes:

### Patrones de Testing Incluidos

1. **setUp()**: Inicialización antes de cada test
2. **Assertions**: `assertEq`, `assertTrue`, etc.
3. **Testing de eventos**: `vm.expectEmit()`
4. **Testing de reverts**: `vm.expectRevert()`
5. **Simulación de usuarios**: `vm.prank()`
6. **Fuzzing**: Tests con valores aleatorios
7. **Tests de control de acceso**: Verificar que solo el owner puede ejecutar ciertas funciones

### Ejecutar Tests Específicos

```bash
# Test del constructor
forge test --match-test testConstructor -vv

# Tests de mensaje
forge test --match-test testCambiarMensaje -vv

# Tests de contador
forge test --match-test testIncrementar -vv

# Tests de fuzzing
forge test --match-test testFuzz -vv
```

## 📚 Dependencias

### forge-std
Librería estándar de Foundry que proporciona:
- Funciones de testing (`Test.sol`)
- Console logging (`console.sol`)
- Herramientas de scripting (`Script.sol`)
- Cheatcodes de VM

### OpenZeppelin Contracts
Contratos seguros y auditados:
- `Ownable`: Control de acceso básico
- Y muchos más contratos estándar disponibles

## 🔧 Configuración

### foundry.toml

Configuración principal del proyecto:
- Versión de Solidity: 0.8.20
- Optimizer habilitado con 200 runs
- Remappings configurados
- Fuzzing con 256 runs por defecto

### remapping.txt

Mapeo de imports para facilitar el uso de librerías:
```
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
forge-std/=lib/forge-std/src/
```

## 💡 Cómo Agregar Nuevos Contratos

### 1. Crear el Contrato

```bash
# Crear un nuevo archivo en src/
touch src/MiNuevoContrato.sol
```

### 2. Crear el Test

```bash
# Crear el archivo de test
touch test/MiNuevoContrato.t.sol
```

Plantilla básica de test:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MiNuevoContrato.sol";

contract MiNuevoContratoTest is Test {
    MiNuevoContrato public contrato;
    
    function setUp() public {
        contrato = new MiNuevoContrato();
    }
    
    function testAlgo() public {
        // Tu test aquí
    }
}
```

### 3. Crear el Script de Deployment (opcional)

```bash
touch script/DeployMiNuevoContrato.s.sol
```

### 4. Compilar y Testear

```bash
forge build
forge test
```

## 📖 Recursos de Aprendizaje

### Documentación Oficial
- [Foundry Book](https://book.getfoundry.sh/) - Documentación oficial de Foundry
- [Solidity Docs](https://docs.soliditylang.org/) - Documentación de Solidity
- [OpenZeppelin Docs](https://docs.openzeppelin.com/) - Documentación de OpenZeppelin

### Tutoriales
- [Foundry Tutorial](https://github.com/smartcontractkit/foundry-starter-kit)
- [Solidity by Example](https://solidity-by-example.org/)

### Cheatsheets
```bash
# Ver todos los comandos de forge
forge --help

# Ver opciones de test
forge test --help

# Ver cheatcodes disponibles
# Consultar: https://book.getfoundry.sh/cheatcodes/
```

## 🐛 Debugging

### Ver trazas de ejecución
```bash
forge test -vvvv
```

### Ver gas usado
```bash
forge test --gas-report
```

### Snapshot de gas
```bash
forge snapshot
```

## 🔐 Seguridad

### Buenas Prácticas

1. **Nunca commitees claves privadas** al repositorio
2. **Usa variables de entorno** para información sensible
3. **Audita tus contratos** antes de deployar en mainnet
4. **Usa contratos de OpenZeppelin** cuando sea posible
5. **Escribe tests exhaustivos** para cubrir todos los casos

### Herramientas de Análisis

```bash
# Análisis estático con Slither (requiere instalación)
slither .

# Análisis de gas
forge test --gas-report
```

## 🤝 Contribuir

Para agregar nuevos ejercicios o mejoras:

1. Crea un nuevo archivo en `src/`
2. Crea los tests correspondientes en `test/`
3. Documenta tu código con NatSpec
4. Asegúrate de que todos los tests pasen

## 📝 Notas

- Este proyecto usa Solidity 0.8.20
- Los tests usan Foundry Testing Framework
- La configuración está optimizada para desarrollo y aprendizaje
- Todos los contratos incluyen documentación NatSpec

## 🎯 Próximos Pasos

1. Familiarízate con el contrato de ejemplo
2. Ejecuta los tests y observa los resultados
3. Modifica el contrato y agrega nuevas funcionalidades
4. Crea tus propios contratos siguiendo la estructura del ejemplo
5. Experimenta con fuzzing y otros patrones de testing

---

¡Feliz desarrollo! 🚀

