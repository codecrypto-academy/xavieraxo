# 🚀 Guía Rápida - FoundryBasico

## Comandos Esenciales

### 📦 Compilación
```bash
forge build          # Compilar todos los contratos
forge build --force  # Forzar recompilación
forge clean          # Limpiar archivos de compilación
```

### 🧪 Testing
```bash
forge test                        # Ejecutar todos los tests
forge test -vv                    # Con detalles (2 niveles de verbose)
forge test -vvvv                  # Con trazas completas
forge test --match-test testX     # Test específico
forge test --match-contract XTest # Contrato específico
forge test --gas-report           # Reporte de gas
forge coverage                    # Cobertura de código
```

### 📝 Formateo
```bash
forge fmt              # Formatear código
forge fmt --check      # Solo verificar formato
```

### 🔍 Análisis
```bash
forge snapshot         # Crear snapshot de gas
forge inspect Contract abi  # Ver ABI del contrato
```

### 🚀 Deployment
```bash
# Simular deployment
forge script script/Deploy.s.sol

# Deploy en red local (Anvil)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

## 📁 Estructura de Archivos

```
src/          → Tus contratos aquí (.sol)
test/         → Tus tests aquí (.t.sol)
script/       → Scripts de deployment (.s.sol)
lib/          → Dependencias (no tocar)
```

## ✏️ Crear Nuevo Contrato

1. Crea `src/MiContrato.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MiContrato {
    // Tu código aquí
}
```

2. Crea `test/MiContrato.t.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MiContrato.sol";

contract MiContratoTest is Test {
    MiContrato public contrato;
    
    function setUp() public {
        contrato = new MiContrato();
    }
    
    function testAlgo() public {
        // Tu test aquí
    }
}
```

3. Compila y testea:
```bash
forge build
forge test
```

## 🎯 Assertions Comunes

```solidity
assertEq(a, b);              // a == b
assertTrue(condition);        // condition es true
assertFalse(condition);       // condition es false
assertGt(a, b);              // a > b
assertLt(a, b);              // a < b
vm.expectRevert("msg");      // Esperar que falle con mensaje
vm.expectEmit(true,...);     // Esperar que emita evento
vm.prank(address);           // Simular llamada desde address
```

## 📚 Imports Útiles

```solidity
import "forge-std/Test.sol";                        // Para tests
import "forge-std/Script.sol";                      // Para scripts
import "forge-std/console.sol";                     // Para console.log
import "@openzeppelin/contracts/access/Ownable.sol"; // Contratos OZ
```

## 💡 Tips Rápidos

- Los tests DEBEN empezar con `test`
- `setUp()` se ejecuta antes de cada test
- Usa `vm.prank(address)` para simular usuarios
- Usa `-vvvv` para debug detallado
- Los contratos de test heredan de `Test`
- Los scripts heredan de `Script`

## 🆘 Solución de Problemas

```bash
# Si falla la compilación
forge clean
forge build

# Si no encuentra dependencias
forge install

# Ver versión
forge --version

# Actualizar Foundry
foundryup
```

## 📖 Más Información

- README.md → Documentación completa
- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Docs](https://docs.soliditylang.org/)

---
✨ **¡Feliz coding!**

