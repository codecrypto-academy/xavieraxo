# Front End (Next.js)
El frontend está construido con Next.js y proporciona una interfaz de usuario moderna y responsiva para la gestión de registros de clientes.

## Características
- Vista de lista de clientes con paginación.
- Búsqueda de clientes por diferentes campos.
- Añadir nuevos clientes.
- Editar clientes existentes.
- Eliminar clientes.
- Diseño responsivo (adaptable).

## Detalles Técnicos
- Construido con Next.js y React.
- Material-UI o Styled Components para un estilizado consistente.
- Axios para la comunicación con la API.
- Gestión de estado mediante React Hooks.
- TypeScript para seguridad de tipos.

# Backend (Rust)
El backend es una API RESTful construida con Rust y Rocket que proporciona la funcionalidad de gestión de clientes. Se conecta a una base de datos SQLite (Northwind) e implementa operaciones CRUD.

## Características
- Obtener todos los clientes con paginación, filtrado y ordenamiento.
- Obtener un solo cliente por ID.
- Crear un nuevo cliente.
- Actualizar un cliente existente.
- Eliminar clientes.
- CORS habilitado para solicitudes de origen cruzado (Cross-Origin).

## Detalles Técnicos
- Construido con Rust y el framework web Rocket.
- Base de datos SQLite utilizando Rusqlite para la persistencia de datos.
- Serialización/Deserialización JSON con Serde.
- Acceso a la base de datos seguro para hilos (Thread-safe) mediante Mutex.
- Manejo de errores y validación de entradas.

# Ejecución del Proyecto

## Backend
1. Asegúrate de tener instalados Rust y Cargo.
2. Navega al directorio `/backend`.
3. Coloca el archivo de la base de datos SQLite `northwind` en la raíz del proyecto backend.
4. Ejecuta `cargo run` para iniciar el servidor.
5. La API estará disponible en http://127.0.0.1:8001

## Frontend
1. Asegúrate de tener instalado Node.js.
2. Navega al directorio `/frontend`.
3. Instala las dependencias con `npm install`.
4. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.
5. Accede a la aplicación en https://127.0.0.1:3000