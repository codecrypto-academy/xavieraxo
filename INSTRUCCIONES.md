# 📋 Instrucciones de Uso del Repositorio

## Estructura Actual

El repositorio está organizado para contener múltiples proyectos y ejercicios:

```
xavieraxo/
├── Solidity de 0 a 100/     ← Proyecto actual de Solidity
├── Cursor/                   ← Ejercicios de bases de datos
└── [Nuevas carpetas]         ← Agrega aquí tus nuevos proyectos
```

## 🔧 Trabajar en el Proyecto de Solidity

Para trabajar con el proyecto de Solidity:

```bash
# Navegar al proyecto
cd "Solidity de 0 a 100"

# Compilar contratos
forge build

# Ejecutar todos los tests
forge test

# Ejecutar tests específicos
forge test --match-test testGetMessage

# Ejecutar tests con detalles
forge test -vvv
```

## ➕ Agregar Nuevos Proyectos

### Opción 1: Proyecto Individual
Crea una carpeta para tu nuevo ejercicio:

```bash
# En la raíz del repositorio
mkdir "Ejercicio 2 - Token ERC20"
cd "Ejercicio 2 - Token ERC20"

# Inicializa un nuevo proyecto Foundry
forge init --no-git
```

### Opción 2: Grupo de Ejercicios
Crea una carpeta que contenga múltiples ejercicios:

```bash
mkdir "Smart Contracts Avanzados"
cd "Smart Contracts Avanzados"

# Crea subcarpetas para cada ejercicio
mkdir "01-NFT"
mkdir "02-DEX"
mkdir "03-Governance"
```

## 📝 Ejemplo de Nueva Carpeta

Cuando agregues una nueva carpeta, actualiza el `README.md` principal:

1. Abre `README.md` en la raíz
2. Agrega tu nuevo proyecto en la sección "Proyectos Incluidos"
3. Incluye una breve descripción

## 🎯 Recomendaciones

- **Mantén cada proyecto independiente**: Cada carpeta debe tener su propio `README.md`
- **Usa nombres descriptivos**: Facilita encontrar los ejercicios más tarde
- **Documenta tu código**: Agrega comentarios explicativos en los contratos
- **Incluye tests**: Cada contrato debe tener sus propias pruebas

## 📂 Ejemplo de Estructura para Nuevo Proyecto

```
Nuevo Proyecto/
├── README.md           # Descripción del proyecto
├── foundry.toml       # Configuración de Foundry
├── src/               # Contratos
│   └── MiContrato.sol
├── test/              # Tests
│   └── MiContrato.t.sol
├── script/            # Scripts de deployment
└── lib/               # Dependencias
```

## 🔄 Mantener el Repositorio Organizado

- Usa `.gitignore` para excluir archivos de compilación
- Commits frecuentes con mensajes descriptivos
- Mantén actualizados los README de cada proyecto
- Elimina carpetas temporales o de prueba cuando termines

## 💡 Consejos

1. **Usa Git branches** para experimentar sin afectar el código principal
2. **Documenta tus aprendizajes** en los README de cada proyecto
3. **Comparte tu progreso** haciendo commits regulares
4. **Organiza por nivel de dificultad** si tienes muchos ejercicios

---

¡Feliz codificación! 🚀

