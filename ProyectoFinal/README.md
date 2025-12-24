# Supply Chain Tracker (Rastreador de Cadena de Suministro)

Sistema de trazabilidad de cadena de suministro basado en blockchain utilizando Solidity (Foundry) para los Smart Contracts y Next.js para la interfaz web descentralizada (DApp).

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema completo de trazabilidad que permite rastrear productos desde la materia prima hasta el consumidor final, utilizando la tecnología blockchain para garantizar transparencia, seguridad e inmutabilidad de los datos.

### Características Principales

- **Gestión de Roles**: Sistema de roles (Productor, Factoría, Distribuidor, Consumidor, Administrador)
- **Gestión de Usuarios**: Registro y aprobación de usuarios por parte del administrador
- **Sistema de Tokens**: Creación de tokens que representan materias primas y productos terminados
- **Trazabilidad**: Sistema de parentesco donde los productos derivan de materias primas
- **Transferencias Controladas**: Validación automática de permisos por rol para garantizar la cadena de suministro
- **Aceptación de Transferencias**: Los receptores deben aceptar las transferencias
- **Eventos Blockchain**: Eventos grabados en la blockchain para auditoría y recuperación de operaciones

## 🏗️ Estructura del Proyecto

```
ProyectoFinal/
├── SC/                    # Smart Contracts (Foundry)
│   ├── src/
│   │   └── SupplyChainTracker.sol
│   ├── test/
│   │   └── SupplyChainTracker.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
├── frontend/              # Aplicación Web Descentralizada (DApp)
│   ├── src/
│   │   ├── app/           # Páginas de Next.js
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Contexto Web3
│   │   ├── lib/           # Utilidades y ABI
│   │   └── styles/        # Estilos CSS
│   └── package.json
├── README.md
└── IAMD.md                # Documentación de uso de IA
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- Foundry (para Smart Contracts)
- MetaMask (extensión del navegador)
- il (para blockchain local)

### Instalación de Foundry

En la carpeta `SC/`, ejecuta:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

O siguiendo las instrucciones oficiales de Foundry: https://book.getfoundry.sh/getting-started/installation

### Configuración del Smart Contract

1. Navega a la carpeta `SC/`:
```bash
cd SC
```

2. Instala las dependencias (si es necesario):
```bash
forge install
```

3. Compila los contratos:
```bash
forge build
```

4. Ejecuta los tests:
```bash
forge test
```

### Configuración de la Blockchain Local

1. Ejecuta una blockchain local con `il` (que proporciona 10 cuentas de prueba)
2. Anota la dirección del contrato después del deployment
3. Configura MetaMask:
   - Red: Localhost 8545 (o la que uses con il)
   - Importa las cuentas de prueba (Admin, Producer, Factory, Retailer, Consumer)

### Despliegue del Contrato

```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

Copia la dirección del contrato desplegado y actualízala en `frontend/src/lib/contracts.ts`:
```typescript
export const CONTRACT_ADDRESS = "0x..."; // Tu dirección del contrato
```

### Configuración del Frontend

1. Navega a la carpeta `frontend/`:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` (opcional):
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Dirección del contrato desplegado
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📖 Uso del Sistema

### Flujo de Usuario

1. **Conexión**: Conecta MetaMask a la aplicación
2. **Registro**: Si no estás registrado, completa el formulario de registro con tu rol y nombre
3. **Aprobación**: Espera a que el administrador apruebe tu cuenta
4. **Dashboard**: Una vez aprobado, accede al dashboard para ver tus operaciones
5. **Crear Tokens**: Crea tokens (materias primas o productos) con metadata JSON
6. **Transferir**: Transfiere tokens siguiendo la cadena de suministro:
   - Productor → Factoría
   - Factoría → Distribuidor
   - Distribuidor → Consumidor
7. **Aceptar Transferencias**: Acepta o rechaza las transferencias recibidas

### Roles y Permisos

- **Administrador**: Puede aprobar/rechazar usuarios y tiene acceso al panel de administración
- **Productor**: Crea materias primas y las transfiere a Factorías
- **Factoría**: Recibe materias primas, crea productos terminados y los transfiere a Distribuidores
- **Distribuidor**: Recibe productos y los transfiere a Consumidores
- **Consumidor**: Recibe productos finales

## 🧪 Testing

Los tests están ubicados en `SC/test/SupplyChainTracker.t.sol`. Incluyen:

- `test_AdminIsAutomaticallyRegistered`: Verifica que el admin se registre automáticamente
- `test_ProducerCanRegister`: Verifica el registro de productores
- `test_AdminApprovesUser`: Verifica la aprobación de usuarios
- `test_ProducerCreatesToken`: Verifica la creación de tokens
- `test_FullSupplyChainFlow`: Test completo del flujo de cadena de suministro

Ejecuta los tests con:
```bash
forge test
```

## 📚 Tecnologías Utilizadas

### Smart Contracts
- **Solidity** (^0.8.24)
- **Foundry** (framework de desarrollo)

### Frontend
- **Next.js 14** (React framework)
- **TypeScript**
- **Tailwind CSS** (estilos)
- **Ethers.js** (interacción con blockchain)
- **Web3 Context** (gestión de estado)

## 🔐 Seguridad

- Validación de roles en cada transferencia
- Requisito de aprobación para usuarios
- Validación de estados de transferencia
- Eventos para auditoría completa

## 📝 Notas Adicionales

- Los metadatos se almacenan como strings JSON en el contrato
- El sistema mantiene balances individuales por usuario y token
- Todos los eventos se graban en la blockchain para trazabilidad completa
- La sesión se mantiene en localStorage para persistencia

## 🤝 Contribuciones

Este es un proyecto educativo. Las mejoras y sugerencias son bienvenidas.

## 📄 Licencia

MIT

## 👨‍💻 Autor

Proyecto desarrollado como parte del Proyecto Final de CodeCripto.

---

Para más información sobre el uso de IA en este proyecto, consulta `IAMD.md`.

