# Esquema de Base de Datos Local

Utilizamos la librería ligera `idb` para proveer un wrapper asíncrono sobre la API nativa de IndexedDB en el navegador.

## Nombre de BD y Versión
- **Nombre:** `notespro-db`
- **Versión:** `1`

## Tabla (ObjectStore): `notebooks`
Almacena todos los cuadernos creados por el usuario y resuelve anidaciones.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | Llave Primaria. |
| `title` | `string` | Nombre del Cuaderno. |
| `createdAt` | `number` (Epoch) | Fecha de creación. |
| `updatedAt` | `number` (Epoch) | Última actualización (Indexado para ordenar menú). |
| `blocks` | `string[]` (UUIDs) | Arreglo manual ordenado de los IDs de los bloques dentro de este cuaderno. Garantiza el orden del documento. |
| `parentId` | `string` (UUID, opcional) | Si está presente, el cuaderno es un **sub-cuaderno** estructurado bajo el cuaderno principal. |

## Tabla (ObjectStore): `blocks`
Almacena el contenido y tipo de fragmentos que componen el documento.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | Llave Primaria. |
| `notebookId` | `string` (UUID) | Relación (Indexada) hacia el Cuaderno al que pertenece este bloque. |
| `type` | `BlockType` (String) | `'text'`, `'h1'`, `'h2'`, `'h3'`, `'list_item'`, `'reference'`. Define cómo el nodo React mostrará el texto. |
| `content` | `string` | Texto del bloque. Si el modelo es `reference`, el content será explícitamente el `id` (UUID) del cuaderno de destino. |
| `properties` | `BlockProperties` (JSON) | Objeto JSON reservado para futuras expansiones de texto enriquecido (`bold`, `color`, etc). |

## Integridad
La base de datos actual realiza eliminaciones en cascada asíncronamente. Al ejecutar `deleteNotebook`, todos los `blocks` cuyo `notebookId === target.id` son interceptados y borrados, manteniendo la estructura local libre de basuras en índices.
