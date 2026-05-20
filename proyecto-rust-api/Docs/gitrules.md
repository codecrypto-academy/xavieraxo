# Reglas de Git y Estrategia de Branching

Este documento rige el flujo de trabajo del repositorio. Ningún desarrollo se integrará al margen de estas reglas.

## 1. Rama Base
* La rama principal de desarrollo y estabilidad del proyecto es: `rustapi`.
* Está terminantemente prohibido realizar commits directos sobre `rustapi`.

## 2. Nomenclatura de Ramas (Feature Branches)
* Toda nueva tarea, refactor o corrección debe nacer exclusivamente de la rama `rustapi`.
* El formato de nombres para las ramas es estrictamente secuencial y numérico:
  * `rustapi-#1` (Estructura inicial del proyecto)
  * `rustapi-#2` (Configuración del Backend Rust)
  * `rustapi-#3` (Módulo de conexión SQLite)
  * (Y así sucesivamente...)

## 3. Flujo de Trabajo con IDE / Agentes de IA (Cursor/Copilot)
1. **Creación:** Crear la rama desde `rustapi`: `git checkout -b rustapi-#X`.
2. **Desarrollo:** Ejecutar la tarea atómica descrita en `bitacora.md`.
3. **Commit:** Realizar commits claros. El mensaje debe describir de forma concisa qué se resolvió en esa rama.
4. **Push:** Subir la rama al repositorio remoto: `git push origin rustapi-#X`.
5. **Notificación:** Avisar al PM (Gemini) para validar la tarea y autorizar el mergeo de la rama remota hacia `rustapi`.
6. **Limpieza:** Una vez mergeado, volver a `rustapi`, hacer `git pull` y eliminar la rama local antes de iniciar la siguiente.