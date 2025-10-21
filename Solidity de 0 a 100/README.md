# Proyecto de Ejercicios Solidity - Foundry

Este proyecto contiene todos los ejercicios de Solidity organizados en un solo proyecto Foundry.

## Estructura del Proyecto

```
├── src/                    # Contratos Solidity
│   ├── HolaMundo.sol      # Ejercicio 1: Contrato básico con Ownable
│   ├── Counter.sol        # Ejercicio 2: Contador simple con eventos
│   └── StorageBox.sol     # Ejercicio 3: Almacenamiento de datos
├── test/                   # Tests para los contratos
│   ├── testHolaMundo.t.sol
│   ├── Counter.t.sol
│   └── StorageBox.t.sol
├── lib/                    # Dependencias (OpenZeppelin, etc.)
├── script/                 # Scripts de deployment
├── foundry.toml           # Configuración de Foundry
└── README.md              # Este archivo
```

## Ejercicios Incluidos

### Ejercicio 1: HolaMundo
- Contrato básico que hereda de Ownable de OpenZeppelin
- Funciones para obtener y actualizar un mensaje
- Solo el owner puede actualizar el mensaje

### Ejercicio 2: Counter
- Contador simple con eventos
- Funciones `inc()` e `incBy(uint)`
- Validación de parámetros positivos

### Ejercicio 3: StorageBox
- Almacenamiento de diferentes tipos de datos
- Variables: uint256, string, array dinámico
- Funciones getter/setter para cada tipo

## Instalación y Uso

1. Instalar Foundry si no lo tienes:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Instalar dependencias:
   ```bash
   forge install
   ```

3. Compilar contratos:
   ```bash
   forge build
   ```

4. Ejecutar tests:
   ```bash
   forge test
   ```

## Carpetas Preservadas

- `Cursor/`: Contiene ejercicios específicos de la capacitación
- `Ejercicios/`: Contiene el proyecto Hardhat original (preservado como referencia)
