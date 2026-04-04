# Guía de Extensión y Desarrollo de Blocks

El diseño modular de NotesPro permite añadir nuevas funcionalidades, renderizados de texto y elementos flotantes mediante la edición centralizada de `BlockNode.tsx` y el tipado en `types/index.ts`.

## ¿Cómo añadir un nuevo tipo de bloque (Ej. Checkbox)?

1. **Abre `src/types/index.ts`**
   Agrega tu nuevo literal al `BlockType`:
   ```typescript
   export type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'list_item' | 'reference' | 'checkbox';
   ```

2. **Abre `src/components/BlockNode.tsx`**
   - Agrega tu elemento iconográfico a la lista principal `slashOptions`:
     ```typescript
     { label: 'Check', type: 'checkbox' as BlockType, icon: CheckSquare },
     ```
   - Registra tu acceso directo desde el teclado en `handleInput`:
     ```typescript
     } else if (text === '[] ') {
         changeType('checkbox');
     }
     ```
   - Opcionalmente, intercepta y dibuja tu elemento antes del bloque editable. En el return statement:
     ```tsx
     {type === 'checkbox' && (
        <input 
           type="checkbox" 
           checked={content.startsWith('[x]')} 
           onChange={e => handleToggleContent(e)} 
        />
     )}
     ```
   - Actualiza tu clase base para CSS (`elementClass` switch).

## Integración con DB
Dado el tipado de `BlockProperties` como `Record<string, any>`, no es necesario alterar esquemas o migraciones en `db.ts`. Puedes guardar todo tu payload anidado simplemente disparando `updateBlockContent` con `JSON.stringify` o aprovechando el objeto `properties` para estados de check, colores, y fechas.

## Convenciones de Zustand
Para extender funcionalidades globales, utiliza siempre el formato actual de Zustand. La lógica asíncrona de obtención (load) debe limpiar la bandera `isLoading` en la promesa del try/catch, sin delegarla implícitamente a los componentes de UI.
