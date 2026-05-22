# Bitácora de Proyecto y Análisis de Tareas (WBS)

Este archivo actúa como el mapa de ruta y control de estado para los agentes de IA y el desarrollador. Cada tarea debe completarse secuencialmente respetando las `GitRules.md`.

## 📌 ESTADO GLOBAL DEL PROYECTO
* **Progreso Actual:** 20%
* **Rama Actual:** rustapi-#2

---

## 🗺️ DESGLOSE DE TAREAS (WBS)

### FASE 1: INFRAESTRUCTURA BASE & CONFIGURACIÓN INITIAL (Rama Objetivo: rustapi-#1)
- [ ] TAREA 1.1: Crear la estructura de directorios del proyecto (`/backend`, `/frontend`).
- [ ] TAREA 1.2: Inicializar el proyecto Backend con `cargo init`.
- [ ] TAREA 1.3: Inicializar el proyecto Frontend con `npx create-next-app@latest` (Configurar con TypeScript, ESLint y directorio `/src`).
- [ ] TAREA 1.4: Crear los archivos base de gobernanza (`GitRules.md` y `bitacora.md`) en la raíz.

### FASE 2: DESARROLLO DEL BACKEND (RUST & ROCKET)
#### Rama Objetivo: rustapi-#2 (Configuración del Servidor)
- [x] TAREA 2.1: Configurar el archivo `Cargo.toml` con las dependencias requeridas (`rocket`, `rusqlite`, `serde`, `serde_json`).
- [x] TAREA 2.2: Crear el servidor Rocket base (Hola Mundo) y configurar el puerto `8001`.

#### Rama Objetivo: rustapi-#3 (Base de Datos y Persistencia)
- [ ] TAREA 2.3: Descargar e integrar el archivo de base de datos `northwind.db` en la raíz del backend.
- [x] TAREA 2.4: Implementar el módulo de conexión segura a SQLite utilizando `Mutex` para asegurar el acceso multi-hilo (Thread-safe).

#### Rama Objetivo: rustapi-#4 (Endpoints CRUD de Clientes)
- [x] TAREA 2.5: Crear los modelos/estructuras de datos de Clientes (Customer) con soporte de serialización `Serde`.
- [ ] TAREA 2.6: Implementar el Endpoint GET para listar clientes con paginación, filtros y ordenamiento.
- [x] TAREA 2.7: Implementar los Endpoints de lectura por ID, creación (POST), actualización (PUT) y eliminación (DELETE).
- [ ] TAREA 2.8: Configurar y habilitar los bloques CORS en Rocket para permitir peticiones desde el puerto `3000`.

### FASE 3: DESARROLLO DEL FRONTEND (NEXT.JS & TS)
#### Rama Objetivo: rustapi-#5 (Configuración y Cliente API)
- [ ] TAREA 3.1: Instalar dependencias de UI (Material-UI o Styled Components) y Axios en el frontend.
- [ ] TAREA 3.2: Crear el cliente Axios configurado para apuntar a `http://127.0.0.1:8001`.

#### Rama Objetivo: rustapi-#6 (Componentes e Interfaz de Usuario)
- [ ] TAREA 3.3: Desarrollar la vista principal de Clientes con tabla responsiva y paginación nativa.
- [ ] TAREA 3.4: Implementar los componentes de búsqueda y filtrado de registros.
- [ ] TAREA 3.5: Desarrollar el formulario para añadir y editar clientes (reutilizable) con validación de campos.
- [ ] TAREA 3.6: Integrar las acciones de eliminación y control de estados globales.

---

## 📝 HISTORIAL DE CAMBIOS Y PASOS EJECUTADOS
*(El desarrollador registrará aquí qué se hizo en cada rama al momento del cierre de la misma)*
* **[2026-05-20] - Rama rustapi-#2:** Se configuró `Cargo.toml` con dependencias `rocket 0.5`, `rusqlite 0.31 (bundled)`, `serde` y `serde_json`. Se implementó `main.rs` con servidor Rocket en puerto 8001, estado global `Mutex<Connection>`, CORS fairing personalizado y rutas stub compilables para `get_customers`, `create`, `update`, `delete` y `get_customer`.
* **[Fecha] - Rama rustapi-#X:** (Esperando inicio...)