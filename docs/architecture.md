# NotesPro - Arquitectura del Código

NotesPro es una aplicación SPA (Single Page Application) construida con React, Vite y TypeScript. No requiere backend externo, gestionando todo su estado de forma local y persistente.

## 1. Patrón Arquitectónico (Stores y Servicios)
El frontend sigue un patrón inspirado en **Flux/Zustand** combinado con un **Repository Pattern** para la base de datos local.
- **Vistas/Componentes (`src/components/`)**: Capa de presentación que solo despacha acciones a los *Stores*.
- **Stores (`src/store/`)**: Manejadores de estado (Zustand). Mantienen el estado en memoria de UI (ej. cuaderno activo, bloques enfocados) y orquestan llamadas asíncronas hacia el motor de base de datos.
- **Capa DB (`src/lib/db.ts`)**: Repositorio y adaptador que envuelve la API nativa de IndexedDB, aislando a los *Stores* de la complejidad de transacciones SQL/NoSQL en cliente.

## 2. Flujo de Datos
- Al abrir la app, `App.tsx` invoca `initTheme()` y `loadNotebooks()` desde los Stores.
- Los cuadernos se cargan asíncronamente desde `db.ts` hacia `notebookStore`.
- Al seleccionar un cuaderno (Sidebar), `Editor.tsx` despacha `loadBlocks(notebookId)` para popular el estado en memoria en `blockStore`.
- Cualquier modificación en un bloque (`handleInput`/`handleBlur` en `BlockNode.tsx`) es primero reflejada y debounceada (si hubiera) en el *Store*, y después guardada explícitamente en la base de datos por eficiencia u on-blur.

## 3. Tematización
El estado global provee un `themeStore` que detecta preferencias de sistema. La aplicación lee de `localStorage` (`notespro-theme`) y aplica la clase `.dark-theme` al `document.body` activando variables CSS ubicadas en `index.css`.
