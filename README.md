# NotesPro

Aplicación local de notas por bloques con React, TypeScript, Vite, Zustand y Tauri 2. Las notas se guardan en IndexedDB y los respaldos JSON se abren y guardan mediante diálogos nativos.

## Requisitos

- Node.js compatible con pnpm 11 y Corepack.
- pnpm 11.10.0: `corepack enable` y `corepack pnpm install`.
- Rust estable con el target MSVC en Windows.
- Visual Studio Build Tools con Desarrollo de escritorio con C++ y Windows SDK.
- Microsoft Edge WebView2 Runtime.

## Desarrollo

`pnpm install`

`pnpm run tauri:dev`

Un solo comando inicia Vite y la ventana NotesPro Dev con HMR. Usa el perfil `com.notespro.app.dev` y la base `NotesProDB-dev`. No necesita otra terminal. El puerto 5173 debe estar disponible.

Para trabajar únicamente en el navegador: `pnpm run dev`.

## Producción / deploy

`pnpm run deploy` (equivalente a `pnpm run tauri:build`).

Compila el frontend en modo producción y genera el instalador NSIS para Windows en `src-tauri/target/release/bundle/nsis/`. El ejecutable usa el perfil `com.notespro.app` y la base `NotesProDB`. Los datos de desarrollo no se incluyen en el instalador. Deploy genera el instalador local; no lo publica en un servidor.

La separación de base se determina mediante `import.meta.env.DEV`, sustituido por Vite al compilar. No depende de una variable de entorno modificable en producción. El tema también tiene una clave distinta en desarrollo. Las bases se crean vacías al primer uso y persisten entre ejecuciones.

## Recuperar notas de la aplicación anterior

Antes de cambiar de aplicación, exporta un respaldo JSON desde la versión anterior. Después abre NotesPro de producción y usa Importar Respaldo. Los perfiles de almacenamiento de los dos runtimes son distintos; las notas anteriores no se copian automáticamente. El formato del respaldo y el esquema de IndexedDB se conservan.

## Verificación

- `pnpm run build`: TypeScript y bundle de producción.
- `pnpm run test:db`: aislamiento de datos, persistencia y eliminación en cascada.
- `pnpm run lint`: análisis del código.
- `cargo check --manifest-path src-tauri/Cargo.toml`: backend nativo.

## Estructura

- `src/`: interfaz, stores y repositorio de notas.
- `src/lib/environment.ts`: nombres de base y preferencias por entorno.
- `src/lib/backupFiles.ts`: respaldos mediante diálogos de Tauri y alternativa para navegador.
- `src-tauri/`: backend Rust, configuración y permisos de Tauri.
- `src-tauri/tauri.dev.conf.json`: perfil exclusivo de desarrollo.
- `pnpm-lock.yaml`: versiones reproducibles de dependencias.

## Licencia

GNU GPLv3. Consulta [LICENSE](./LICENSE).
